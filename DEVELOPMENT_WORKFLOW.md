# 🔧 Development Workflow & Best Practices

## 📋 Overview
This document outlines the development workflow, coding standards, and best practices for maintaining and extending the My Hibachi booking system.

## 🎯 Development Principles

### Code Quality Standards
- **Readability First**: Code should be self-documenting
- **Security by Design**: Every feature considers security implications
- **Performance Aware**: Optimize for user experience
- **Maintainability**: Write code that's easy to modify and extend
- **Test-Driven**: Include tests for critical functionality

### Architecture Guidelines
- **Separation of Concerns**: UI, business logic, and data access are separate
- **Single Responsibility**: Each function/component has one clear purpose
- **DRY (Don't Repeat Yourself)**: Reuse common functionality
- **SOLID Principles**: Follow object-oriented design principles
- **API-First**: Design APIs before implementing UI

---

## 🛠️ Development Setup

### Initial Setup
```bash
# Clone repositories
git clone <frontend-repo-url> my-hibachi-frontend
git clone <backend-repo-url> my-hibachi-backend

# Frontend setup
cd my-hibachi-frontend
npm install
cp .env.example .env
# Edit .env with your configuration

# Backend setup
cd ../my-hibachi-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

### Daily Development Workflow
```bash
# 1. Start development environment
cd my-hibachi-backend
python main.py &  # Start backend server

cd ../my-hibachi-frontend
npm run dev  # Start frontend development server

# 2. Run health checks
cd ../my-hibachi-backend
python system_health_monitor.py

# 3. Make changes and test
# 4. Commit changes with descriptive messages
git add .
git commit -m "feat: add new booking validation"

# 5. Push to repository
git push origin main
```

---

## 📝 Coding Standards

### Frontend (React/JavaScript)

#### Component Structure
```jsx
// ComponentName.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
  }, [dependencies]);

  const handleAction = () => {
    // Event handler logic
    onAction?.(data);
  };

  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.required,
  prop2: PropTypes.number,
  onAction: PropTypes.func
};

ComponentName.defaultProps = {
  prop2: 0,
  onAction: () => {}
};

export default ComponentName;
```

#### Naming Conventions
- **Components**: PascalCase (`AdminPanel`, `OrderServices`)
- **Files**: PascalCase for components (`AdminPanel.jsx`)
- **Variables**: camelCase (`selectedDate`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE`, `TIME_SLOTS`)
- **CSS Classes**: kebab-case (`admin-panel`, `booking-form`)

#### State Management
```jsx
// Local state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

// Update state immutably
const handleInputChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};

// Side effects
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.getData();
      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };
  
  fetchData();
}, [dependencies]);
```

#### Error Handling
```jsx
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  setError('');
  
  try {
    await api.submitData(data);
    setSuccess('Data submitted successfully');
  } catch (err) {
    setError(err.response?.data?.detail || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Backend (Python/FastAPI)

#### API Endpoint Structure
```python
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/booking")

class BookingRequest(BaseModel):
    name: str
    email: str
    phone: str
    date: str
    time_slot: str

class BookingResponse(BaseModel):
    id: int
    status: str
    message: str

@router.post("/book", response_model=BookingResponse)
async def create_booking(
    booking: BookingRequest,
    current_user: dict = Depends(get_current_user),
    db: Connection = Depends(get_db)
):
    """
    Create a new booking
    
    Args:
        booking: Booking details
        current_user: Authenticated user
        db: Database connection
        
    Returns:
        BookingResponse with booking ID and status
        
    Raises:
        HTTPException: If booking validation fails
    """
    try:
        # Validate input
        if not booking.name or not booking.email:
            raise HTTPException(
                status_code=400, 
                detail="Name and email are required"
            )
        
        # Business logic
        booking_id = create_booking_in_db(db, booking)
        
        return BookingResponse(
            id=booking_id,
            status="confirmed",
            message="Booking created successfully"
        )
        
    except Exception as e:
        logger.error(f"Booking creation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
```

#### Database Operations
```python
import sqlite3
from contextlib import contextmanager

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    try:
        yield conn
    except Exception as e:
        conn.rollback()
        raise e
    else:
        conn.commit()
    finally:
        conn.close()

def create_booking_in_db(booking_data: dict) -> int:
    """Create booking in database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO bookings (name, email, phone, date, time_slot)
            VALUES (?, ?, ?, ?, ?)
        """, (
            booking_data['name'],
            booking_data['email'],
            booking_data['phone'],
            booking_data['date'],
            booking_data['time_slot']
        ))
        return cursor.lastrowid
```

#### Error Handling
```python
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

def safe_database_operation(operation_func):
    """Decorator for safe database operations"""
    def wrapper(*args, **kwargs):
        try:
            return operation_func(*args, **kwargs)
        except sqlite3.IntegrityError as e:
            logger.error(f"Database integrity error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Data integrity violation"
            )
        except sqlite3.Error as e:
            logger.error(f"Database error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Database operation failed"
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Internal server error"
            )
    return wrapper
```

---

## 🧪 Testing Strategy

### Frontend Testing

#### Unit Tests
```javascript
// ComponentName.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName prop1="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    const mockAction = jest.fn();
    render(<ComponentName onAction={mockAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalledWith(expectedData);
  });
});
```

#### Integration Tests
```javascript
// integration.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/booking/availability', (req, res, ctx) => {
    return res(ctx.json({ '12:00 PM': { status: 'available' } }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('booking flow works end-to-end', async () => {
  render(<App />);
  
  // Navigate to booking page
  fireEvent.click(screen.getByText('Book Now'));
  
  // Fill out form
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John Doe' }
  });
  
  // Submit form
  fireEvent.click(screen.getByText('Submit Booking'));
  
  // Wait for success message
  await waitFor(() => {
    expect(screen.getByText('Booking confirmed')).toBeInTheDocument();
  });
});
```

### Backend Testing

#### Unit Tests
```python
# test_booking.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_booking_success():
    booking_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "date": "2024-01-15",
        "time_slot": "12:00 PM"
    }
    
    response = client.post("/api/booking/book", json=booking_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "confirmed"
    assert "id" in data

def test_create_booking_invalid_data():
    booking_data = {
        "name": "",  # Invalid: empty name
        "email": "john@example.com"
    }
    
    response = client.post("/api/booking/book", json=booking_data)
    
    assert response.status_code == 422  # Validation error
```

#### Database Tests
```python
# test_database.py
import sqlite3
import tempfile
import os
from database import create_tables, create_booking_in_db

@pytest.fixture
def temp_db():
    """Create temporary database for testing"""
    fd, path = tempfile.mkstemp()
    conn = sqlite3.connect(path)
    create_tables(conn)
    conn.close()
    yield path
    os.close(fd)
    os.unlink(path)

def test_create_booking(temp_db):
    booking_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "date": "2024-01-15",
        "time_slot": "12:00 PM"
    }
    
    booking_id = create_booking_in_db(temp_db, booking_data)
    
    assert booking_id > 0
    
    # Verify booking was created
    conn = sqlite3.connect(temp_db)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,))
    booking = cursor.fetchone()
    conn.close()
    
    assert booking is not None
    assert booking[1] == "Test User"  # name field
```

---

## 🔒 Security Guidelines

### Authentication & Authorization
```python
# auth.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Input Validation
```python
from pydantic import BaseModel, validator
import re

class BookingRequest(BaseModel):
    name: str
    email: str
    phone: str
    date: str
    time_slot: str
    
    @validator('name')
    def name_must_be_valid(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        if not re.match(r'^[a-zA-Z\s]+$', v):
            raise ValueError('Name can only contain letters and spaces')
        return v.strip()
    
    @validator('email')
    def email_must_be_valid(cls, v):
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('phone')
    def phone_must_be_valid(cls, v):
        phone_regex = r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$'
        if not re.match(phone_regex, v):
            raise ValueError('Invalid phone number format')
        return re.sub(r'[^\d]', '', v)  # Store only digits
```

### SQL Injection Prevention
```python
# Always use parameterized queries
def get_booking_by_id(booking_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # GOOD: Parameterized query
    cursor.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,))
    
    # BAD: String concatenation (vulnerable to SQL injection)
    # cursor.execute(f"SELECT * FROM bookings WHERE id = {booking_id}")
    
    result = cursor.fetchone()
    conn.close()
    return result
```

---

## 🚀 Deployment Best Practices

### Environment Configuration
```bash
# .env.production
DATABASE_URL=postgresql://user:password@localhost/myhibachi
SECRET_KEY=your-very-secure-secret-key-here
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DEBUG=false
LOG_LEVEL=INFO
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up
- [ ] Security headers configured
- [ ] Error tracking enabled

### Docker Deployment
```dockerfile
# Dockerfile.backend
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📊 Performance Optimization

### Frontend Optimization
```jsx
// Lazy loading
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
  }, [data]);
  
  return <div>{expensiveValue}</div>;
});

// Debounced input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
```

### Backend Optimization
```python
# Database connection pooling
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True
)

# Caching
from functools import lru_cache

@lru_cache(maxsize=128)
def get_cached_availability(date: str):
    """Cache availability data for frequently requested dates"""
    return fetch_availability_from_db(date)

# Background tasks
from fastapi import BackgroundTasks

def send_email_notification(email: str, message: str):
    """Send email in background"""
    # Email sending logic here
    pass

@app.post("/api/booking/book")
async def create_booking(
    booking: BookingRequest,
    background_tasks: BackgroundTasks
):
    # Create booking
    booking_id = create_booking_in_db(booking)
    
    # Send confirmation email in background
    background_tasks.add_task(
        send_email_notification,
        booking.email,
        f"Booking confirmed: {booking_id}"
    )
    
    return {"id": booking_id, "status": "confirmed"}
```

---

## 🔍 Debugging & Troubleshooting

### Logging Configuration
```python
# logging_config.py
import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set specific log levels
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)
```

### Debug Tools
```python
# debug_helpers.py
import time
from functools import wraps

def timer(func):
    """Decorator to time function execution"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        return result
    return wrapper

def debug_request(request):
    """Debug request details"""
    print(f"Method: {request.method}")
    print(f"URL: {request.url}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Body: {request.body}")
```

### Common Issues & Solutions

#### Issue: Database connection errors
```python
# Solution: Add connection retry logic
import time
import sqlite3

def get_db_connection_with_retry(max_retries=3):
    for attempt in range(max_retries):
        try:
            conn = sqlite3.connect(DATABASE_PATH, timeout=10)
            return conn
        except sqlite3.Error as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(1)  # Wait before retry
```

#### Issue: JWT token validation errors
```python
# Solution: Add better error handling
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail="Token verification failed")
```

---

## 📚 Documentation Standards

### Code Documentation
```python
def calculate_booking_cost(
    base_price: float,
    guest_count: int,
    date: str,
    special_requests: list = None
) -> dict:
    """
    Calculate the total cost for a booking.
    
    Args:
        base_price (float): Base price per person
        guest_count (int): Number of guests (minimum 10)
        date (str): Booking date in YYYY-MM-DD format
        special_requests (list, optional): List of special requests
        
    Returns:
        dict: Contains 'subtotal', 'tax', 'total', and 'breakdown'
        
    Raises:
        ValueError: If guest_count is less than 10
        ValueError: If date is invalid format
        
    Example:
        >>> calculate_booking_cost(50.0, 15, "2024-01-15")
        {'subtotal': 750.0, 'tax': 67.5, 'total': 817.5, 'breakdown': {...}}
    """
    if guest_count < 10:
        raise ValueError("Minimum 10 guests required")
    
    # Implementation here
    pass
```

### API Documentation
```python
# Use FastAPI's automatic documentation
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="My Hibachi Booking API",
    description="API for managing hibachi catering bookings",
    version="1.0.0"
)

class BookingRequest(BaseModel):
    name: str = Field(..., description="Customer name", example="John Doe")
    email: str = Field(..., description="Customer email", example="john@example.com")
    phone: str = Field(..., description="Phone number", example="555-123-4567")
    date: str = Field(..., description="Booking date", example="2024-01-15")
    time_slot: str = Field(..., description="Time slot", example="6:00 PM")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "555-123-4567",
                "date": "2024-01-15",
                "time_slot": "6:00 PM"
            }
        }
```

---

## 🔄 Version Control

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-booking-validation
# Make changes
git add .
git commit -m "feat: add enhanced booking validation"
git push origin feature/new-booking-validation
# Create pull request

# Bug fixes
git checkout -b bugfix/fix-kpi-calculation
# Fix the bug
git add .
git commit -m "fix: correct monthly KPI calculation logic"
git push origin bugfix/fix-kpi-calculation
```

### Commit Message Standards
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks

Examples:
feat: add waitlist functionality to booking system
fix: resolve KPI calculation mismatch for monthly view
docs: update API documentation with new endpoints
refactor: extract common validation logic into utilities
test: add integration tests for admin panel
chore: update dependencies to latest versions
```

---

*This workflow guide is maintained by the development team. Last updated: December 2024*
