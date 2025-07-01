# 🚀 Future Development & Maintainability Guide

## 📋 Overview
This guide provides comprehensive instructions for maintaining and extending the My Hibachi booking system. The system is designed to be production-ready, maintainable, and future-proof.

## 🎯 System Architecture

### Current Technology Stack
- **Frontend**: React 18 + Vite + Bootstrap 5
- **Backend**: FastAPI + Python 3.9+ + SQLite
- **Authentication**: JWT tokens with bcrypt hashing
- **State Management**: React hooks + local state
- **Styling**: CSS3 + Bootstrap + custom CSS
- **Build Tools**: Vite (frontend) + Uvicorn (backend)

### Design Principles
- **Single Responsibility**: Each component has one clear purpose
- **Separation of Concerns**: Business logic separated from UI
- **Security First**: All sensitive operations require authentication
- **Performance Optimized**: Lazy loading, caching, and debouncing
- **Accessibility Ready**: ARIA labels and keyboard navigation support

---

## 🛠️ Development Environment Setup

### Prerequisites
```bash
# Frontend
Node.js 18+
npm 9+

# Backend
Python 3.9+
pip 22+
```

### Quick Start Commands
```bash
# Frontend Development
cd my-hibachi-frontend
npm install
npm run dev

# Backend Development
cd my-hibachi-backend
pip install -r requirements.txt
python main.py

# Build for Production
npm run build        # Frontend
python main.py       # Backend (production mode)
```

### Environment Configuration
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=My Hibachi
VITE_APP_DESCRIPTION=Premium Hibachi Catering Service

# Backend (.env)
DATABASE_URL=sqlite:///./mh-bookings.db
SECRET_KEY=your-secret-key-here
ADMIN_SESSION_TIMEOUT=3600
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📂 Project Structure & Code Organization

### Frontend Structure
```
src/
├── components/           # React components
│   ├── AdminPanel.jsx   # Main admin dashboard
│   ├── OrderServices.jsx # Customer booking form
│   ├── chatbot/         # AI chatbot system
│   └── ...
├── config/
│   └── api.js          # API configuration
├── assets/             # Static assets
└── styles/             # CSS files
```

### Backend Structure
```
app/
├── routes.py           # API endpoints
├── database.py         # Database connection
├── auth.py            # Authentication logic
├── models.py          # Data models
└── email_utils.py     # Email functionality
```

### Key Files to Know

#### Frontend Critical Files
- `src/components/AdminPanel.jsx` - Admin dashboard with all KPI cards and booking management
- `src/components/OrderServices.jsx` - Customer booking form with calendar integration
- `src/config/api.js` - API base URL configuration
- `package.json` - Dependencies and scripts

#### Backend Critical Files
- `app/routes.py` - All API endpoints and business logic
- `app/database.py` - Database connection and schema
- `app/auth.py` - JWT authentication and password management
- `main.py` - Application entry point
- `requirements.txt` - Python dependencies

---

## 🔧 Common Development Tasks

### Adding New Features

#### 1. Adding a New Admin Panel Feature
```jsx
// Example: Adding a new KPI card
const NewKPICard = ({ title, value, onClick }) => (
  <div className="kpi-card" onClick={onClick}>
    <h3>{title}</h3>
    <div className="kpi-value">{value}</div>
  </div>
);

// Add to AdminPanel.jsx
const [newKPI, setNewKPI] = useState(0);

// Add API call to fetch data
const fetchNewKPI = async () => {
  const res = await axios.get(`${API_BASE}/api/booking/admin/new-kpi`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setNewKPI(res.data.count);
};
```

#### 2. Adding a New API Endpoint
```python
# In app/routes.py
@app.get("/api/booking/admin/new-endpoint")
async def new_endpoint(
    current_user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    # Verify admin role
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Your logic here
    cursor = db.cursor()
    cursor.execute("SELECT * FROM your_table")
    results = cursor.fetchall()
    
    return {"data": results}
```

### Modifying Existing Features

#### 1. Updating KPI Calculations
```python
# In app/routes.py, find the KPI calculation functions
# Example: Updating monthly booking count
def get_monthly_bookings(db, year, month):
    cursor = db.cursor()
    cursor.execute("""
        SELECT COUNT(*) FROM bookings 
        WHERE strftime('%Y', date) = ? 
        AND strftime('%m', date) = ?
    """, (str(year), str(month).zfill(2)))
    return cursor.fetchone()[0]
```

#### 2. Adding Form Fields
```jsx
// In OrderServices.jsx
const [formData, setFormData] = useState({
  // ... existing fields
  newField: ''
});

// Add to form JSX
<Form.Group>
  <Form.Label>New Field</Form.Label>
  <Form.Control
    type="text"
    value={formData.newField}
    onChange={(e) => setFormData({...formData, newField: e.target.value})}
  />
</Form.Group>
```

---

## 🔒 Security Best Practices

### Authentication & Authorization
- All admin endpoints require JWT token validation
- Passwords are hashed using bcrypt
- Admin role verification on sensitive operations
- Session timeout after 1 hour of inactivity

### Data Protection
```python
# Never store plain text passwords
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### API Security
```python
# Rate limiting example
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/sensitive-endpoint")
@limiter.limit("5/minute")
async def sensitive_endpoint(request: Request):
    # Your logic here
    pass
```

---

## 📊 Database Management

### Current Schema
```sql
-- Main tables
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'pending'
);

CREATE TABLE waitlist (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Migrations
```python
# Example migration script
def migrate_add_column():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE bookings ADD COLUMN new_field TEXT")
        conn.commit()
        print("Migration successful")
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()
```

### Backup Strategy
```bash
# Manual backup
cp mh-bookings.db mh-bookings-backup-$(date +%Y%m%d).db

# Automated backup script (add to cron)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/mh-bookings.db /path/to/backups/mh-bookings-$DATE.db
find /path/to/backups -name "mh-bookings-*.db" -mtime +30 -delete
```

---

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Backend Testing
```python
# Example test file: test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_admin_login():
    response = client.post("/api/booking/admin/login", json={
        "username": "test_admin",
        "password": "test_password"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

### Integration Testing
```bash
# Test full booking flow
python test_booking_flow.py

# Test admin panel functionality
python test_admin_panel.py

# Test KPI calculations
python test_kpi_consistency.py
```

---

## 🚀 Deployment Guide

### Production Checklist
- [ ] Update environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Test all critical paths

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Backend Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Docker deployment
docker build -t my-hibachi-backend .
docker run -p 8000:8000 my-hibachi-backend
```

---

## 🔄 Maintenance Tasks

### Daily Tasks
- Check application logs for errors
- Monitor database size
- Verify backup completion

### Weekly Tasks
- Review and clean old bookings
- Update dependencies (security patches)
- Check performance metrics

### Monthly Tasks
- Full system backup
- Performance optimization review
- Security audit
- Documentation updates

### Maintenance Scripts
```python
# Database cleanup script
def cleanup_old_bookings():
    """Remove bookings older than 6 months"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    six_months_ago = datetime.now() - timedelta(days=180)
    cursor.execute(
        "DELETE FROM bookings WHERE date < ?",
        (six_months_ago.strftime('%Y-%m-%d'),)
    )
    
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    
    print(f"Deleted {deleted_count} old bookings")
```

---

## 📈 Performance Optimization

### Frontend Optimization
```jsx
// Lazy loading components
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Debounced API calls
const debouncedSearch = useCallback(
  debounce((searchTerm) => {
    fetchSearchResults(searchTerm);
  }, 300),
  []
);
```

### Backend Optimization
```python
# Database indexing
cursor.execute("CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date)")

# Caching frequently accessed data
from functools import lru_cache

@lru_cache(maxsize=100)
def get_cached_stats(date_key):
    return calculate_stats(date_key)

# Connection pooling
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool,
    pool_size=20,
    max_overflow=30
)
```

---

## 🔍 Troubleshooting Guide

### Common Issues

#### 1. Admin Login Issues
```bash
# Check if admin account exists
python check_admin_users.py

# Reset admin password
python reset_admin_password.py username new_password

# Check JWT token validation
python test_admin_login_direct.py
```

#### 2. KPI Data Mismatches
```bash
# Debug KPI calculations
python test_kpi_consistency.py

# Check database integrity
python check_database.py

# Verify date ranges
python test_upcoming_logic.py
```

#### 3. API Connection Issues
```bash
# Check API health
curl http://localhost:8000/

# Test specific endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/booking/admin/weekly?start_date=2024-01-01
```

### Log Analysis
```python
# Check application logs
tail -f app.log

# Filter for errors
grep "ERROR" app.log

# Check admin activities
grep "admin" app.log | tail -20
```

---

## 🔮 Future Enhancements

### Short-term (3-6 months)
- [ ] Add automated testing pipeline
- [ ] Implement real-time notifications
- [ ] Add data export functionality
- [ ] Enhance mobile responsiveness

### Medium-term (6-12 months)
- [ ] Migrate to PostgreSQL
- [ ] Add advanced analytics dashboard
- [ ] Implement customer portal
- [ ] Add payment processing integration

### Long-term (12+ months)
- [ ] Microservices architecture
- [ ] Multi-tenant support
- [ ] Advanced reporting system
- [ ] Mobile application

### Technology Migration Path
```
Current: SQLite → PostgreSQL (reliability)
Current: Single server → Load balanced (scalability)
Current: Manual deployment → CI/CD pipeline (automation)
Current: Local storage → Cloud storage (availability)
```

---

## 🆘 Support & Documentation

### Getting Help
1. Check this documentation first
2. Review error logs
3. Test in development environment
4. Contact system administrator

### Key Contacts
- **Development**: [Your development team]
- **Operations**: [Your operations team]
- **Security**: [Your security team]

### Documentation Links
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Security Guide](./docs/SECURITY.md)

---

## 📝 Change Log

### Version 1.0.0 (Current)
- ✅ Complete admin panel with KPI dashboard
- ✅ Secure authentication system
- ✅ Booking management functionality
- ✅ Waitlist management
- ✅ Newsletter system
- ✅ Comprehensive documentation

### Planned Updates
- Version 1.1.0: Enhanced mobile support
- Version 1.2.0: Advanced analytics
- Version 2.0.0: PostgreSQL migration

---

*This guide is maintained by the development team and updated regularly. Last updated: December 2024*
