# ============================================================
# Sheeshmahal Jewellers - Backend API Server
# ============================================================
# This is the main backend file using FastAPI (Python web framework).
# It handles:
#   - JWT-based admin authentication (login, token verify)
#   - CRUD operations for jewellery items
#   - Review management (public submission + admin approval)
#   - Seeding default admin account and sample data on startup
#
# All routes are prefixed with /api (e.g., /api/jewellery, /api/admin/login)
# MongoDB is used as the database via the Motor async driver.
# ============================================================

from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

# ============================================================
# CONFIGURATION - Load environment variables from .env file
# ============================================================
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Connect to MongoDB using the MONGO_URL from .env
# DB_NAME defines which database to use inside MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT settings for admin authentication
# JWT_SECRET: the secret key used to sign/verify tokens
# JWT_ALGORITHM: the algorithm used for JWT encoding (HS256 is standard)
# JWT_EXPIRATION_HOURS: how long a login token stays valid
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# HTTPBearer extracts the "Bearer <token>" from the Authorization header
security = HTTPBearer()

# ============================================================
# APP & ROUTER SETUP
# ============================================================
# FastAPI app instance - this is what uvicorn runs
app = FastAPI(title="Sheeshmahal Jewellers API")

# All routes go through this router, which adds /api prefix automatically
# So a route defined as "/jewellery" becomes "/api/jewellery"
api_router = APIRouter(prefix="/api")

# ============================================================
# DATA MODELS (Pydantic)
# ============================================================
# These define the shape of data for requests and responses.
# Pydantic automatically validates incoming data against these models.

# --- Admin Models ---

class AdminLogin(BaseModel):
    """What the admin sends to log in"""
    email: str
    password: str

class AdminResponse(BaseModel):
    """Admin info returned after login (no password!)"""
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str

class TokenResponse(BaseModel):
    """Response after successful login - includes JWT token + admin info"""
    token: str
    admin: AdminResponse

# --- Jewellery Models ---

class JewelleryBase(BaseModel):
    """Base fields every jewellery item has"""
    name: str          # e.g., "Royal Gold Necklace"
    category: str      # e.g., "Gold", "Diamond", "Silver", "Platinum"
    description: str   # Description of the piece
    imageUrl: str      # URL to the jewellery image

class JewelleryCreate(JewelleryBase):
    """Used when admin creates a new jewellery item (same fields as base)"""
    pass

class JewelleryUpdate(BaseModel):
    """Used when admin updates a jewellery item - all fields optional"""
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None

class Jewellery(JewelleryBase):
    """Full jewellery item with auto-generated id and timestamp"""
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# --- Review Models ---

class ReviewBase(BaseModel):
    """Base fields for a customer review"""
    name: str                           # Reviewer's name
    rating: int = Field(ge=1, le=5)     # 1-5 star rating
    comment: str                        # Review text

class ReviewCreate(ReviewBase):
    """Used when a customer submits a review (same as base)"""
    pass

class Review(ReviewBase):
    """Full review with auto-generated id, timestamp, and approval status"""
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved: bool = False  # Reviews need admin approval before showing publicly

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt (one-way encryption)"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Check if a plain-text password matches its bcrypt hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(admin_id: str, email: str) -> str:
    """Create a JWT token that expires after JWT_EXPIRATION_HOURS"""
    payload = {
        "sub": admin_id,     # "sub" = subject (who the token belongs to)
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Middleware/dependency that verifies the JWT token from the request header.
    Used by protected routes - if token is invalid, returns 401 error.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin_id = payload.get("sub")
        if admin_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============================================================
# STARTUP - Runs once when the server starts
# ============================================================
# This creates the default admin account and sample data if they don't exist.
# Default admin credentials: admin@jewellery.com / Admin@123

@app.on_event("startup")
async def create_default_admin():
    """
    On server startup:
    1. Create default admin if not exists
    2. Add sample jewellery items if collection is empty
    3. Add sample reviews if collection is empty
    """
    # --- Create default admin account ---
    existing_admin = await db.admins.find_one({"email": "admin@jewellery.com"})
    if not existing_admin:
        admin_doc = {
            "id": str(uuid.uuid4()),
            "email": "admin@jewellery.com",
            "password": hash_password("Admin@123"),  # Hashed password stored in DB
            "name": "Admin",
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        await db.admins.insert_one(admin_doc)
        print("Default admin created: admin@jewellery.com / Admin@123")

    # --- Seed sample jewellery items ---
    jewellery_count = await db.jewellery.count_documents({})
    if jewellery_count == 0:
        sample_jewellery = [
            {
                "id": str(uuid.uuid4()),
                "name": "Royal Gold Necklace",
                "category": "Gold",
                "description": "Exquisite 22 karat gold necklace with traditional Varanasi craftsmanship. Perfect for weddings and special occasions.",
                "imageUrl": "https://plus.unsplash.com/premium_photo-1724762183134-c17cf5f5bed2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Diamond Solitaire Ring",
                "category": "Diamond",
                "description": "Elegant diamond solitaire ring featuring a brilliant cut diamond set in 18k white gold.",
                "imageUrl": "https://images.unsplash.com/photo-1607703829739-c05b7beddf60?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Traditional Silver Anklet",
                "category": "Silver",
                "description": "Handcrafted silver anklet with intricate jhankar bells. A beautiful piece of Indian heritage.",
                "imageUrl": "https://imgs.search.brave.com/GZi-9JrlfRpn8kXUE0JCJecmltT4wsgco4Np1_37rqw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2JlLzc0/L2MyL2JlNzRjMmY3/MjY3NzZiYzZkOWQ1/MzljYTQ4ZjE4ZjQ3/LmpwZw",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Sapphire Platinum Ring",
                "category": "Platinum",
                "description": "Stunning blue sapphire set in premium platinum. A symbol of royalty and elegance.",
                "imageUrl": "https://images.unsplash.com/photo-1762019313711-8b5d1e4f7ba4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwyfHxkaWFtb25kJTIwcmluZyUyMGx1eHVyeSUyMG1hY3JvJTIwc2hvdHxlbnwwfHx8fDE3Njk1ODYwODZ8MA&ixlib=rb-4.1.0&q=85",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Bridal Gold Set",
                "category": "Gold",
                "description": "Complete bridal jewellery set including necklace, earrings, and maang tikka in pure gold.",
                "imageUrl": "https://images.unsplash.com/photo-1737515046830-1680d82e043c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBicmlkYWwlMjBqZXdlbGxlcnklMjBzZXQlMjBtb2RlbHxlbnwwfHx8fDE3Njk1ODYwOTB8MA&ixlib=rb-4.1.0&q=85",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Temple Gold Earrings",
                "category": "Gold",
                "description": "Traditional temple-style gold earrings with detailed engravings. Handcrafted by master artisans.",
                "imageUrl": "https://images.unsplash.com/photo-1651160670627-2896ddf7822f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "createdAt": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.jewellery.insert_many(sample_jewellery)
        print("Sample jewellery added")

    # --- Seed sample reviews ---
    reviews_count = await db.reviews.count_documents({})
    if reviews_count == 0:
        sample_reviews = [
            {
                "id": str(uuid.uuid4()),
                "name": "Priya Sharma",
                "rating": 5,
                "comment": "Absolutely stunning collection! Bought my wedding jewellery from here and couldn't be happier.",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "approved": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Rahul Verma",
                "rating": 5,
                "comment": "Best jewellery shop in Varanasi. The craftsmanship is exceptional and prices are fair.",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "approved": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Anita Gupta",
                "rating": 4,
                "comment": "Beautiful designs and very helpful staff. Highly recommended for traditional jewellery.",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "approved": True
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Vikram Singh",
                "rating": 5,
                "comment": "Trusted shop for generations. Pure gold and excellent service every time.",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "approved": True
            }
        ]
        await db.reviews.insert_many(sample_reviews)
        print("Sample reviews added")

# ============================================================
# PUBLIC ROUTES (No authentication required)
# ============================================================

# Health check - simple endpoint to verify the API is running
@api_router.get("/")
async def root():
    return {"message": "Sheeshmahal Jewellers API", "status": "running"}

# GET /api/jewellery - Fetch all jewellery items (optionally filter by category)
# Example: /api/jewellery?category=Gold
@api_router.get("/jewellery", response_model=List[Jewellery])
async def get_all_jewellery(category: Optional[str] = None):
    query = {}
    if category and category != "All":
        query["category"] = category

    # {"_id": 0} excludes MongoDB's internal _id field from results
    jewellery_list = await db.jewellery.find(query, {"_id": 0}).sort("createdAt", -1).to_list(100)

    # Convert ISO string dates back to datetime objects for Pydantic
    for item in jewellery_list:
        if isinstance(item.get('createdAt'), str):
            item['createdAt'] = datetime.fromisoformat(item['createdAt'].replace('Z', '+00:00'))

    return jewellery_list

# GET /api/jewellery/categories - Get list of all unique categories
@api_router.get("/jewellery/categories")
async def get_categories():
    categories = await db.jewellery.distinct("category")
    return {"categories": ["All"] + categories}

# GET /api/jewellery/{item_id} - Get a single jewellery item by its ID
@api_router.get("/jewellery/{item_id}")
async def get_jewellery_item(item_id: str):
    item = await db.jewellery.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Jewellery item not found")

    if isinstance(item.get('createdAt'), str):
        item['createdAt'] = datetime.fromisoformat(item['createdAt'].replace('Z', '+00:00'))

    return item

# GET /api/reviews - Fetch only approved reviews (shown publicly on the website)
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({"approved": True}, {"_id": 0}).sort("createdAt", -1).to_list(50)

    for review in reviews:
        if isinstance(review.get('createdAt'), str):
            review['createdAt'] = datetime.fromisoformat(review['createdAt'].replace('Z', '+00:00'))

    return reviews

# POST /api/reviews - Submit a new review (public, but requires admin approval)
@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['approved'] = False  # New reviews are NOT approved by default

    await db.reviews.insert_one(doc)
    return review_obj

# ============================================================
# ADMIN AUTH ROUTES
# ============================================================

# POST /api/admin/login - Admin login, returns JWT token on success
@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(login_data: AdminLogin):
    # Look up the admin by email
    admin = await db.admins.find_one({"email": login_data.email}, {"_id": 0})

    # If no admin found OR password doesn't match, return 401
    if not admin or not verify_password(login_data.password, admin['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create a JWT token for the admin
    token = create_token(admin['id'], admin['email'])

    return TokenResponse(
        token=token,
        admin=AdminResponse(
            id=admin['id'],
            email=admin['email'],
            name=admin['name']
        )
    )

# GET /api/admin/verify - Check if a JWT token is still valid
# Used by the frontend's ProtectedRoute component
@api_router.get("/admin/verify")
async def verify_admin_token(payload: dict = Depends(verify_token)):
    admin = await db.admins.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"valid": True, "admin": admin}

# ============================================================
# PROTECTED ADMIN ROUTES (Require valid JWT token)
# ============================================================
# These routes use `Depends(verify_token)` which means the request
# must include a valid JWT token in the Authorization header.
# Format: Authorization: Bearer <your-jwt-token>

# POST /api/jewellery - Create a new jewellery item (admin only)
@api_router.post("/jewellery", response_model=Jewellery)
async def create_jewellery(jewellery: JewelleryCreate, payload: dict = Depends(verify_token)):
    jewellery_obj = Jewellery(**jewellery.model_dump())
    doc = jewellery_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()

    await db.jewellery.insert_one(doc)
    return jewellery_obj

# PUT /api/jewellery/{item_id} - Update an existing jewellery item (admin only)
@api_router.put("/jewellery/{item_id}", response_model=Jewellery)
async def update_jewellery(item_id: str, update_data: JewelleryUpdate, payload: dict = Depends(verify_token)):
    existing = await db.jewellery.find_one({"id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Jewellery item not found")

    # Only update fields that were actually provided (not None)
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}

    if update_dict:
        await db.jewellery.update_one({"id": item_id}, {"$set": update_dict})

    # Return the updated item
    updated = await db.jewellery.find_one({"id": item_id}, {"_id": 0})

    if isinstance(updated.get('createdAt'), str):
        updated['createdAt'] = datetime.fromisoformat(updated['createdAt'].replace('Z', '+00:00'))

    return updated

# DELETE /api/jewellery/{item_id} - Delete a jewellery item (admin only)
@api_router.delete("/jewellery/{item_id}")
async def delete_jewellery(item_id: str, payload: dict = Depends(verify_token)):
    result = await db.jewellery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jewellery item not found")
    return {"message": "Jewellery deleted successfully"}

# GET /api/admin/reviews - Get ALL reviews including pending ones (admin only)
@api_router.get("/admin/reviews", response_model=List[Review])
async def get_all_reviews(payload: dict = Depends(verify_token)):
    reviews = await db.reviews.find({}, {"_id": 0}).sort("createdAt", -1).to_list(100)

    for review in reviews:
        if isinstance(review.get('createdAt'), str):
            review['createdAt'] = datetime.fromisoformat(review['createdAt'].replace('Z', '+00:00'))

    return reviews

# PUT /api/admin/reviews/{review_id}?approved=true/false - Approve or reject a review (admin only)
@api_router.put("/admin/reviews/{review_id}")
async def update_review_status(review_id: str, approved: bool, payload: dict = Depends(verify_token)):
    result = await db.reviews.update_one({"id": review_id}, {"$set": {"approved": approved}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": f"Review {'approved' if approved else 'rejected'} successfully"}

# DELETE /api/admin/reviews/{review_id} - Delete a review permanently (admin only)
@api_router.delete("/admin/reviews/{review_id}")
async def delete_review(review_id: str, payload: dict = Depends(verify_token)):
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}

# ============================================================
# REGISTER ROUTER & MIDDLEWARE
# ============================================================

# Attach all /api routes to the app
app.include_router(api_router)

# CORS middleware allows the frontend (running on a different port) to call the API
# allow_origins=["*"] means any frontend URL can access the API
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# LOGGING & SHUTDOWN
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close the MongoDB connection when the server shuts down"""
    client.close()
