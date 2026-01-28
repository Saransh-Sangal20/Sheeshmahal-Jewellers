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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'sheeshmahal_jewellers_secret_key_2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="Sheeshmahal Jewellers API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# Admin Model
class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str

class TokenResponse(BaseModel):
    token: str
    admin: AdminResponse

# Jewellery Model
class JewelleryBase(BaseModel):
    name: str
    category: str
    description: str
    imageUrl: str

class JewelleryCreate(JewelleryBase):
    pass

class JewelleryUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None

class Jewellery(JewelleryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Review Model
class ReviewBase(BaseModel):
    name: str
    rating: int = Field(ge=1, le=5)
    comment: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved: bool = False

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(admin_id: str, email: str) -> str:
    payload = {
        "sub": admin_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
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

# ==================== STARTUP - CREATE DEFAULT ADMIN ====================

@app.on_event("startup")
async def create_default_admin():
    # Check if admin exists
    existing_admin = await db.admins.find_one({"email": "admin@jewellery.com"})
    if not existing_admin:
        admin_doc = {
            "id": str(uuid.uuid4()),
            "email": "admin@jewellery.com",
            "password": hash_password("Admin@123"),
            "name": "Admin",
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        await db.admins.insert_one(admin_doc)
        print("Default admin created: admin@jewellery.com / Admin@123")
    
    # Add sample jewellery if none exists
    jewellery_count = await db.jewellery.count_documents({})
    if jewellery_count == 0:
        sample_jewellery = [
            {
                "id": str(uuid.uuid4()),
                "name": "Royal Gold Necklace",
                "category": "Gold",
                "description": "Exquisite 22 karat gold necklace with traditional Varanasi craftsmanship. Perfect for weddings and special occasions.",
                "imageUrl": "https://images.pexels.com/photos/32780784/pexels-photo-32780784.jpeg",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Diamond Solitaire Ring",
                "category": "Diamond",
                "description": "Elegant diamond solitaire ring featuring a brilliant cut diamond set in 18k white gold.",
                "imageUrl": "https://images.unsplash.com/photo-1760081912307-fe4c5cc3aee0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGx1eHVyeSUyMG1hY3JvJTIwc2hvdHxlbnwwfHx8fDE3Njk1ODYwODZ8MA&ixlib=rb-4.1.0&q=85",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Traditional Silver Anklet",
                "category": "Silver",
                "description": "Handcrafted silver anklet with intricate jhankar bells. A beautiful piece of Indian heritage.",
                "imageUrl": "https://images.unsplash.com/photo-1653227907877-e097195908fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBqZXdlbGxlcnklMjBzaG93cm9vbSUyMGludGVyaW9yJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY5NTg2MDg4fDA&ixlib=rb-4.1.0&q=85",
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
                "imageUrl": "https://images.pexels.com/photos/29371789/pexels-photo-29371789.jpeg",
                "createdAt": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.jewellery.insert_many(sample_jewellery)
        print("Sample jewellery added")
    
    # Add sample reviews
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

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Sheeshmahal Jewellers API", "status": "running"}

# Get all jewellery (public)
@api_router.get("/jewellery", response_model=List[Jewellery])
async def get_all_jewellery(category: Optional[str] = None):
    query = {}
    if category and category != "All":
        query["category"] = category
    
    jewellery_list = await db.jewellery.find(query, {"_id": 0}).sort("createdAt", -1).to_list(100)
    
    for item in jewellery_list:
        if isinstance(item.get('createdAt'), str):
            item['createdAt'] = datetime.fromisoformat(item['createdAt'].replace('Z', '+00:00'))
    
    return jewellery_list

# Get jewellery categories
@api_router.get("/jewellery/categories")
async def get_categories():
    categories = await db.jewellery.distinct("category")
    return {"categories": ["All"] + categories}

# Get single jewellery item
@api_router.get("/jewellery/{item_id}")
async def get_jewellery_item(item_id: str):
    item = await db.jewellery.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Jewellery item not found")
    
    if isinstance(item.get('createdAt'), str):
        item['createdAt'] = datetime.fromisoformat(item['createdAt'].replace('Z', '+00:00'))
    
    return item

# Get approved reviews (public)
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({"approved": True}, {"_id": 0}).sort("createdAt", -1).to_list(50)
    
    for review in reviews:
        if isinstance(review.get('createdAt'), str):
            review['createdAt'] = datetime.fromisoformat(review['createdAt'].replace('Z', '+00:00'))
    
    return reviews

# Submit a review (public)
@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['approved'] = False  # Requires admin approval
    
    await db.reviews.insert_one(doc)
    return review_obj

# ==================== ADMIN AUTH ROUTES ====================

@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(login_data: AdminLogin):
    admin = await db.admins.find_one({"email": login_data.email}, {"_id": 0})
    
    if not admin or not verify_password(login_data.password, admin['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(admin['id'], admin['email'])
    
    return TokenResponse(
        token=token,
        admin=AdminResponse(
            id=admin['id'],
            email=admin['email'],
            name=admin['name']
        )
    )

# Verify token
@api_router.get("/admin/verify")
async def verify_admin_token(payload: dict = Depends(verify_token)):
    admin = await db.admins.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"valid": True, "admin": admin}

# ==================== PROTECTED ADMIN ROUTES ====================

# Create jewellery (admin only)
@api_router.post("/jewellery", response_model=Jewellery)
async def create_jewellery(jewellery: JewelleryCreate, payload: dict = Depends(verify_token)):
    jewellery_obj = Jewellery(**jewellery.model_dump())
    doc = jewellery_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.jewellery.insert_one(doc)
    return jewellery_obj

# Update jewellery (admin only)
@api_router.put("/jewellery/{item_id}", response_model=Jewellery)
async def update_jewellery(item_id: str, update_data: JewelleryUpdate, payload: dict = Depends(verify_token)):
    existing = await db.jewellery.find_one({"id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Jewellery item not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.jewellery.update_one({"id": item_id}, {"$set": update_dict})
    
    updated = await db.jewellery.find_one({"id": item_id}, {"_id": 0})
    
    if isinstance(updated.get('createdAt'), str):
        updated['createdAt'] = datetime.fromisoformat(updated['createdAt'].replace('Z', '+00:00'))
    
    return updated

# Delete jewellery (admin only)
@api_router.delete("/jewellery/{item_id}")
async def delete_jewellery(item_id: str, payload: dict = Depends(verify_token)):
    result = await db.jewellery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jewellery item not found")
    return {"message": "Jewellery deleted successfully"}

# Get all reviews including pending (admin only)
@api_router.get("/admin/reviews", response_model=List[Review])
async def get_all_reviews(payload: dict = Depends(verify_token)):
    reviews = await db.reviews.find({}, {"_id": 0}).sort("createdAt", -1).to_list(100)
    
    for review in reviews:
        if isinstance(review.get('createdAt'), str):
            review['createdAt'] = datetime.fromisoformat(review['createdAt'].replace('Z', '+00:00'))
    
    return reviews

# Approve/reject review (admin only)
@api_router.put("/admin/reviews/{review_id}")
async def update_review_status(review_id: str, approved: bool, payload: dict = Depends(verify_token)):
    result = await db.reviews.update_one({"id": review_id}, {"$set": {"approved": approved}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": f"Review {'approved' if approved else 'rejected'} successfully"}

# Delete review (admin only)
@api_router.delete("/admin/reviews/{review_id}")
async def delete_review(review_id: str, payload: dict = Depends(verify_token)):
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
