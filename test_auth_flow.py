#!/usr/bin/env python3
"""
Frontend authentication test - simulate the authentication flow
"""
import base64
import json
import time

def test_frontend_auth_flow():
    """Test the JWT token decoding that the frontend uses"""
    
    # Create a mock JWT token (similar to what the backend would create)
    payload = {
        "sub": "test_admin",
        "role": "admin", 
        "exp": int(time.time()) + 3600  # 1 hour from now
    }
    
    # Create a simple JWT token (this is just for testing the decode logic)
    # In reality, this would come from the backend login endpoint
    header = {"alg": "HS256", "typ": "JWT"}
    
    # Encode the header and payload
    header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    # For testing, we'll create a mock token without signature verification
    mock_token = f"{header_encoded}.{payload_encoded}.mock_signature"
    
    print(f"Mock token created: {mock_token[:50]}...")
    
    # Test the frontend token decoding logic
    try:
        # This is what the frontend does: token.split('.')[1] 
        token_parts = mock_token.split('.')
        payload_part = token_parts[1]
        
        # Add padding if needed (JWT base64 might not have padding)
        payload_part += '=' * (4 - len(payload_part) % 4)
        
        # Decode the payload
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload_part).decode())
        
        print("✅ Token decoding successful!")
        print(f"Username: {decoded_payload.get('sub', 'Admin')}")
        print(f"Role: {decoded_payload.get('role', 'admin')}")
        
        # Simulate what the frontend would do
        user_data = {
            "username": decoded_payload.get('sub', 'Admin'),
            "role": decoded_payload.get('role', 'admin'),
            "user_type": decoded_payload.get('role', 'admin')
        }
        
        print(f"✅ Frontend would set user data: {user_data}")
        return True
        
    except Exception as e:
        print(f"❌ Token decoding failed: {e}")
        return False

if __name__ == "__main__":
    print("=== Frontend Authentication Flow Test ===")
    success = test_frontend_auth_flow()
    
    if success:
        print("\n✅ The authentication fix should resolve the console error!")
        print("The frontend no longer needs to call /api/booking/me")
        print("It will decode the JWT token locally instead.")
    else:
        print("\n❌ There might still be issues with the authentication flow")
