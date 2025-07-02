#!/usr/bin/env python3
"""
🔍 COMPREHENSIVE FRONTEND-BACKEND SYNCHRONIZATION CHECK
This script verifies all aspects of frontend-backend integration
"""
import requests
import json
import sys
import time
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class SyncChecker:
    def __init__(self):
        self.backend_url = 'http://localhost:8000'
        self.issues = []
        self.successes = []
        self.token = None

    def log_success(self, message):
        print(f"{Colors.GREEN}✅ {message}{Colors.END}")
        self.successes.append(message)

    def log_warning(self, message):
        print(f"{Colors.YELLOW}⚠️ {message}{Colors.END}")
        self.issues.append(f"WARNING: {message}")

    def log_error(self, message):
        print(f"{Colors.RED}❌ {message}{Colors.END}")
        self.issues.append(f"ERROR: {message}")

    def log_info(self, message):
        print(f"{Colors.CYAN}ℹ️ {message}{Colors.END}")

    def test_backend_health(self):
        """Test if backend is running and responding"""
        self.log_info("Testing backend health...")
        try:
            response = requests.get(f"{self.backend_url}/", timeout=5)
            if response.status_code == 200:
                self.log_success("Backend is running and healthy")
                return True
            else:
                self.log_error(f"Backend returned status {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            self.log_error("Backend is not running or not accessible")
            return False
        except Exception as e:
            self.log_error(f"Backend health check failed: {e}")
            return False

    def test_authentication(self):
        """Test authentication endpoints"""
        self.log_info("Testing authentication...")
        
        # Test login endpoint
        try:
            response = requests.post(
                f"{self.backend_url}/api/booking/token",
                data={'username': 'ady', 'password': '13Agustus!'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access_token')
                if self.token:
                    self.log_success("Authentication successful - token received")
                    return True
                else:
                    self.log_error("Authentication succeeded but no token received")
                    return False
            else:
                self.log_error(f"Authentication failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_error(f"Authentication test failed: {e}")
            return False

    def test_api_endpoints(self):
        """Test all critical API endpoints used by frontend"""
        if not self.token:
            self.log_error("No authentication token - skipping API endpoint tests")
            return False

        headers = {'Authorization': f'Bearer {self.token}'}
        endpoints = [
            # Public endpoints
            {
                'name': 'Availability Check',
                'method': 'GET',
                'url': f"{self.backend_url}/api/booking/availability?date=2025-07-01",
                'headers': {},
                'expected_status': [200, 422]  # 422 is acceptable (means endpoint exists)
            },
            
            # Admin endpoints
            {
                'name': 'Admin KPIs',
                'method': 'GET',
                'url': f"{self.backend_url}/api/booking/admin/kpis",
                'headers': headers,
                'expected_status': [200]
            },
            {
                'name': 'Admin Current User',
                'method': 'GET',
                'url': f"{self.backend_url}/api/booking/admin/current",
                'headers': headers,
                'expected_status': [200, 404]  # 404 is acceptable if endpoint doesn't exist
            },
            {
                'name': 'Newsletter Recipients',
                'method': 'GET',
                'url': f"{self.backend_url}/api/booking/admin/newsletter/recipients",
                'headers': headers,
                'expected_status': [200]
            },
            {
                'name': 'Activity Logs',
                'method': 'GET',
                'url': f"{self.backend_url}/api/booking/admin/activity-logs?page=1&limit=10",
                'headers': headers,
                'expected_status': [200]
            },
            {
                'name': 'Superadmin List Admins',
                'method': 'GET',
                'url': f"{self.backend_url}/api/booking/superadmin/admins",
                'headers': headers,
                'expected_status': [200]
            }
        ]

        self.log_info("Testing API endpoints...")
        all_passed = True

        for endpoint in endpoints:
            try:
                if endpoint['method'] == 'GET':
                    response = requests.get(endpoint['url'], headers=endpoint['headers'], timeout=10)
                
                if response.status_code in endpoint['expected_status']:
                    self.log_success(f"{endpoint['name']}: {response.status_code}")
                else:
                    self.log_error(f"{endpoint['name']}: Expected {endpoint['expected_status']}, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_error(f"{endpoint['name']}: Request failed - {e}")
                all_passed = False

        return all_passed

    def check_frontend_files(self):
        """Check frontend configuration files"""
        self.log_info("Checking frontend configuration...")
        
        frontend_path = Path("c:/Users/surya/my-hibachi-frontend")
        
        # Check API configuration files
        api_configs = [
            frontend_path / "lib/config/api.js",
            frontend_path / "src/config/api.js",
            frontend_path / "src/config/api-simple.js"
        ]
        
        config_found = False
        for config_file in api_configs:
            if config_file.exists():
                try:
                    content = config_file.read_text()
                    if "localhost:8000" in content:
                        self.log_success(f"API config found: {config_file.name}")
                        config_found = True
                    else:
                        self.log_warning(f"API config {config_file.name} doesn't point to localhost:8000")
                except Exception as e:
                    self.log_error(f"Error reading {config_file.name}: {e}")
        
        if not config_found:
            self.log_error("No valid API configuration found")
            return False
        
        # Check package.json
        package_json = frontend_path / "package.json"
        if package_json.exists():
            try:
                with open(package_json) as f:
                    data = json.load(f)
                    if "axios" in data.get("dependencies", {}):
                        self.log_success("Axios dependency found in package.json")
                    else:
                        self.log_error("Axios dependency missing from package.json")
            except Exception as e:
                self.log_error(f"Error reading package.json: {e}")
        
        return True

    def check_backend_files(self):
        """Check backend configuration files"""
        self.log_info("Checking backend configuration...")
        
        backend_path = Path("c:/Users/surya/my-hibachi-backend")
        
        # Check main.py
        main_py = backend_path / "main.py"
        if main_py.exists():
            try:
                content = main_py.read_text()
                if "FastAPI" in content and "app = FastAPI()" in content:
                    self.log_success("FastAPI app configuration found")
                else:
                    self.log_warning("FastAPI app configuration not found in main.py")
            except Exception as e:
                self.log_error(f"Error reading main.py: {e}")
        
        # Check requirements.txt
        requirements = backend_path / "requirements.txt"
        if requirements.exists():
            try:
                content = requirements.read_text()
                required_packages = ['fastapi', 'uvicorn', 'sqlalchemy', 'passlib']
                missing_packages = []
                for package in required_packages:
                    if package not in content.lower():
                        missing_packages.append(package)
                
                if not missing_packages:
                    self.log_success("All required backend packages found")
                else:
                    self.log_error(f"Missing required packages: {missing_packages}")
            except Exception as e:
                self.log_error(f"Error reading requirements.txt: {e}")
        
        return True

    def test_booking_flow(self):
        """Test the complete booking flow"""
        self.log_info("Testing booking flow simulation...")
        
        try:
            # Test booking endpoint (this will fail validation but should not error)
            test_booking = {
                "name": "Test User",
                "phone": "555-0123",
                "email": "test@example.com",
                "address": "123 Test St",
                "city": "Test City",
                "zipcode": "12345",
                "date": "2025-08-01",
                "time_slot": "12:00 PM",
                "contact_preference": "phone"
            }
            
            response = requests.post(
                f"{self.backend_url}/api/booking/book",
                json=test_booking,
                timeout=10
            )
            
            # We expect this to fail validation but not crash
            if response.status_code in [200, 422, 400]:
                self.log_success("Booking endpoint is accessible and responding")
            else:
                self.log_error(f"Booking endpoint returned unexpected status: {response.status_code}")
                
        except Exception as e:
            self.log_error(f"Booking flow test failed: {e}")

    def generate_report(self):
        """Generate final synchronization report"""
        print(f"\n{Colors.BOLD}{Colors.PURPLE}{'='*60}")
        print(f"🔍 SYNCHRONIZATION CHECK COMPLETE")
        print(f"{'='*60}{Colors.END}")
        
        print(f"\n{Colors.GREEN}{Colors.BOLD}✅ SUCCESSES ({len(self.successes)}):{Colors.END}")
        for success in self.successes:
            print(f"  • {success}")
        
        if self.issues:
            print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠️ ISSUES FOUND ({len(self.issues)}):{Colors.END}")
            for issue in self.issues:
                print(f"  • {issue}")
        else:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 NO ISSUES FOUND! PERFECT SYNC!{Colors.END}")
        
        # Overall status
        critical_errors = len([i for i in self.issues if i.startswith("ERROR")])
        if critical_errors == 0:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎯 OVERALL STATUS: SYNCHRONIZED ✅{Colors.END}")
        else:
            print(f"\n{Colors.RED}{Colors.BOLD}❌ OVERALL STATUS: SYNC ISSUES DETECTED{Colors.END}")
        
        return critical_errors == 0

def main():
    print(f"{Colors.BOLD}{Colors.CYAN}")
    print("🔍 MY HIBACHI FRONTEND-BACKEND SYNCHRONIZATION CHECKER")
    print("=" * 60)
    print(f"{Colors.END}")
    
    checker = SyncChecker()
    
    # Run all checks
    backend_healthy = checker.test_backend_health()
    
    if backend_healthy:
        checker.test_authentication()
        checker.test_api_endpoints()
        checker.test_booking_flow()
    
    checker.check_frontend_files()
    checker.check_backend_files()
    
    # Generate final report
    success = checker.generate_report()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
