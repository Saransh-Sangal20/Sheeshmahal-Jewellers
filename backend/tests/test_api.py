"""
Sheeshmahal Jewellers API Tests
Tests for: Public endpoints, Admin auth, Jewellery CRUD, Review management
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@jewellery.com"
ADMIN_PASSWORD = "Admin@123"


class TestHealthAndPublicEndpoints:
    """Test public endpoints that don't require authentication"""
    
    def test_api_health(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        print("✓ API health check passed")
    
    def test_get_jewellery_list(self):
        """Test GET /api/jewellery returns list of items"""
        response = requests.get(f"{BASE_URL}/api/jewellery")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0  # Should have seed data
        # Verify item structure
        item = data[0]
        assert "id" in item
        assert "name" in item
        assert "category" in item
        assert "description" in item
        assert "imageUrl" in item
        print(f"✓ GET /api/jewellery returned {len(data)} items")
    
    def test_get_jewellery_by_category(self):
        """Test GET /api/jewellery?category=Gold filters correctly"""
        response = requests.get(f"{BASE_URL}/api/jewellery?category=Gold")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All items should be Gold category
        for item in data:
            assert item["category"] == "Gold"
        print(f"✓ Category filter returned {len(data)} Gold items")
    
    def test_get_categories(self):
        """Test GET /api/jewellery/categories returns category list"""
        response = requests.get(f"{BASE_URL}/api/jewellery/categories")
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        assert "All" in data["categories"]
        print(f"✓ GET /api/jewellery/categories returned: {data['categories']}")
    
    def test_get_approved_reviews(self):
        """Test GET /api/reviews returns only approved reviews"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned reviews should be approved
        for review in data:
            assert review.get("approved") == True
        print(f"✓ GET /api/reviews returned {len(data)} approved reviews")


class TestAdminAuth:
    """Test admin authentication endpoints"""
    
    def test_admin_login_success(self):
        """Test POST /api/admin/login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "admin" in data
        assert data["admin"]["email"] == ADMIN_EMAIL
        assert len(data["token"]) > 0
        print("✓ Admin login successful")
    
    def test_admin_login_invalid_password(self):
        """Test POST /api/admin/login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid password correctly rejected")
    
    def test_admin_login_invalid_email(self):
        """Test POST /api/admin/login with non-existent email"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "nonexistent@test.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401
        print("✓ Invalid email correctly rejected")
    
    def test_admin_verify_valid_token(self):
        """Test GET /api/admin/verify with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["token"]
        
        # Verify token
        response = requests.get(f"{BASE_URL}/api/admin/verify", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        print("✓ Token verification successful")
    
    def test_admin_verify_invalid_token(self):
        """Test GET /api/admin/verify with invalid token"""
        response = requests.get(f"{BASE_URL}/api/admin/verify", headers={
            "Authorization": "Bearer invalidtoken123"
        })
        assert response.status_code == 401
        print("✓ Invalid token correctly rejected")


class TestJewelleryCRUD:
    """Test jewellery CRUD operations (requires auth)"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_create_jewellery(self, auth_token):
        """Test POST /api/jewellery creates new item"""
        test_item = {
            "name": f"TEST_Jewellery_{uuid.uuid4().hex[:8]}",
            "category": "Gold",
            "description": "Test description for automated testing",
            "imageUrl": "https://example.com/test-image.jpg"
        }
        
        response = requests.post(f"{BASE_URL}/api/jewellery", 
            json=test_item,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == test_item["name"]
        assert data["category"] == test_item["category"]
        assert "id" in data
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/jewellery/{data['id']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["name"] == test_item["name"]
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/jewellery/{data['id']}", 
            headers={"Authorization": f"Bearer {auth_token}"})
        print("✓ Create jewellery and verify persistence passed")
    
    def test_create_jewellery_without_auth(self):
        """Test POST /api/jewellery without token fails"""
        test_item = {
            "name": "Unauthorized Item",
            "category": "Gold",
            "description": "Should fail",
            "imageUrl": "https://example.com/test.jpg"
        }
        response = requests.post(f"{BASE_URL}/api/jewellery", json=test_item)
        assert response.status_code in [401, 403]
        print("✓ Unauthorized create correctly rejected")
    
    def test_update_jewellery(self, auth_token):
        """Test PUT /api/jewellery/{id} updates item"""
        # First create an item
        test_item = {
            "name": f"TEST_Update_{uuid.uuid4().hex[:8]}",
            "category": "Silver",
            "description": "Original description",
            "imageUrl": "https://example.com/original.jpg"
        }
        create_response = requests.post(f"{BASE_URL}/api/jewellery",
            json=test_item,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        item_id = create_response.json()["id"]
        
        # Update the item
        update_data = {"name": "TEST_Updated_Name", "description": "Updated description"}
        update_response = requests.put(f"{BASE_URL}/api/jewellery/{item_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["name"] == "TEST_Updated_Name"
        assert updated["description"] == "Updated description"
        assert updated["category"] == "Silver"  # Unchanged field
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/jewellery/{item_id}")
        assert get_response.json()["name"] == "TEST_Updated_Name"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/jewellery/{item_id}",
            headers={"Authorization": f"Bearer {auth_token}"})
        print("✓ Update jewellery and verify persistence passed")
    
    def test_delete_jewellery(self, auth_token):
        """Test DELETE /api/jewellery/{id} removes item"""
        # First create an item
        test_item = {
            "name": f"TEST_Delete_{uuid.uuid4().hex[:8]}",
            "category": "Diamond",
            "description": "To be deleted",
            "imageUrl": "https://example.com/delete.jpg"
        }
        create_response = requests.post(f"{BASE_URL}/api/jewellery",
            json=test_item,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        item_id = create_response.json()["id"]
        
        # Delete the item
        delete_response = requests.delete(f"{BASE_URL}/api/jewellery/{item_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        
        # Verify removal
        get_response = requests.get(f"{BASE_URL}/api/jewellery/{item_id}")
        assert get_response.status_code == 404
        print("✓ Delete jewellery and verify removal passed")
    
    def test_delete_nonexistent_jewellery(self, auth_token):
        """Test DELETE /api/jewellery/{id} with invalid ID returns 404"""
        response = requests.delete(f"{BASE_URL}/api/jewellery/nonexistent-id-12345",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 404
        print("✓ Delete nonexistent item returns 404")


class TestReviewManagement:
    """Test review submission and admin management"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_submit_review(self, auth_token):
        """Test POST /api/reviews creates pending review"""
        review = {
            "name": f"TEST_Reviewer_{uuid.uuid4().hex[:8]}",
            "rating": 5,
            "comment": "Test review for automated testing"
        }
        
        response = requests.post(f"{BASE_URL}/api/reviews", json=review)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == review["name"]
        assert data["rating"] == 5
        assert data["approved"] == False  # New reviews are pending
        assert "id" in data
        
        # Cleanup - delete via admin
        requests.delete(f"{BASE_URL}/api/admin/reviews/{data['id']}",
            headers={"Authorization": f"Bearer {auth_token}"})
        print("✓ Submit review creates pending review")
    
    def test_get_admin_reviews(self, auth_token):
        """Test GET /api/admin/reviews returns all reviews including pending"""
        response = requests.get(f"{BASE_URL}/api/admin/reviews",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin reviews endpoint returned {len(data)} reviews")
    
    def test_approve_review(self, auth_token):
        """Test PUT /api/admin/reviews/{id}?approved=true approves review"""
        # Create a test review
        review = {
            "name": f"TEST_Approve_{uuid.uuid4().hex[:8]}",
            "rating": 4,
            "comment": "Review to be approved"
        }
        create_response = requests.post(f"{BASE_URL}/api/reviews", json=review)
        review_id = create_response.json()["id"]
        
        # Approve the review
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/reviews/{review_id}?approved=true",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert approve_response.status_code == 200
        
        # Verify it appears in public reviews
        public_reviews = requests.get(f"{BASE_URL}/api/reviews").json()
        approved_ids = [r["id"] for r in public_reviews]
        assert review_id in approved_ids
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/reviews/{review_id}",
            headers={"Authorization": f"Bearer {auth_token}"})
        print("✓ Approve review works correctly")
    
    def test_reject_review(self, auth_token):
        """Test PUT /api/admin/reviews/{id}?approved=false rejects review"""
        # Create and approve a test review first
        review = {
            "name": f"TEST_Reject_{uuid.uuid4().hex[:8]}",
            "rating": 3,
            "comment": "Review to be rejected"
        }
        create_response = requests.post(f"{BASE_URL}/api/reviews", json=review)
        review_id = create_response.json()["id"]
        
        # First approve it
        requests.put(f"{BASE_URL}/api/admin/reviews/{review_id}?approved=true",
            headers={"Authorization": f"Bearer {auth_token}"})
        
        # Then reject it
        reject_response = requests.put(
            f"{BASE_URL}/api/admin/reviews/{review_id}?approved=false",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert reject_response.status_code == 200
        
        # Verify it no longer appears in public reviews
        public_reviews = requests.get(f"{BASE_URL}/api/reviews").json()
        public_ids = [r["id"] for r in public_reviews]
        assert review_id not in public_ids
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/reviews/{review_id}",
            headers={"Authorization": f"Bearer {auth_token}"})
        print("✓ Reject review works correctly")
    
    def test_delete_review(self, auth_token):
        """Test DELETE /api/admin/reviews/{id} removes review"""
        # Create a test review
        review = {
            "name": f"TEST_Delete_{uuid.uuid4().hex[:8]}",
            "rating": 2,
            "comment": "Review to be deleted"
        }
        create_response = requests.post(f"{BASE_URL}/api/reviews", json=review)
        review_id = create_response.json()["id"]
        
        # Delete the review
        delete_response = requests.delete(f"{BASE_URL}/api/admin/reviews/{review_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        
        # Verify removal - check admin reviews list
        admin_reviews = requests.get(f"{BASE_URL}/api/admin/reviews",
            headers={"Authorization": f"Bearer {auth_token}"}).json()
        admin_ids = [r["id"] for r in admin_reviews]
        assert review_id not in admin_ids
        print("✓ Delete review works correctly")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
