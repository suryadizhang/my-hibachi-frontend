// AdminHeader Component - Optimized Authentication and User Info
import React, { memo, useCallback, useMemo } from 'react';
import { Navbar, Nav, Dropdown, Badge, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const AdminHeader = memo(({ 
  currentUser = null,
  isAuthenticated = false,
  notifications = [],
  onLogout,
  onNotificationClick,
  onSettingsClick,
  currentPath = '',
  isLoading = false
}) => {
  const router = useRouter();
  
  // Memoized user initials for avatar
  const userInitials = useMemo(() => {
    if (!currentUser?.username) return 'U';
    return currentUser.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [currentUser?.username]);
  
  // Memoized unread notifications count
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );
  
  // Stable logout handler
  const handleLogout = useCallback(async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
      localStorage.removeItem('adminToken');
      router.push('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [onLogout, router]);
  
  // Stable navigation handler
  const handleNavigation = useCallback((path) => {
    router.push(path);
  }, [router]);
  
  // Memoized navigation items
  const navigationItems = useMemo(() => [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ], []);
  
  // Memoized nav links
  const navLinks = useMemo(() => 
    navigationItems.map((item) => (
      <Nav.Link
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        className={currentPath === item.path ? 'active fw-bold' : ''}
        style={{ cursor: 'pointer' }}
      >
        <span className="me-1">{item.icon}</span>
        {item.label}
      </Nav.Link>
    )),
    [navigationItems, currentPath, handleNavigation]
  );
  
  // Memoized user dropdown
  const userDropdown = useMemo(() => {
    if (!isAuthenticated || !currentUser) return null;
    
    return (
      <Dropdown align="end">
        <Dropdown.Toggle variant="outline-light" className="d-flex align-items-center">
          <div className="user-avatar me-2">
            {userInitials}
          </div>
          <div className="user-info d-none d-md-block">
            <div className="fw-bold">{currentUser.username}</div>
            <small className="text-muted">{currentUser.role}</small>
          </div>
        </Dropdown.Toggle>
        
        <Dropdown.Menu>
          <Dropdown.Header>
            <strong>{currentUser.username}</strong>
            <br />
            <small className="text-muted">{currentUser.email}</small>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => handleNavigation('/admin/profile')}>
            👤 Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={onSettingsClick}>
            ⚙️ Settings
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleNavigation('/admin/help')}>
            ❓ Help
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout} className="text-danger">
            🚪 Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }, [isAuthenticated, currentUser, userInitials, handleNavigation, onSettingsClick, handleLogout]);
  
  // Memoized notifications dropdown
  const notificationsDropdown = useMemo(() => (
    <Dropdown align="end">
      <Dropdown.Toggle variant="outline-light" className="position-relative">
        🔔
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>
      
      <Dropdown.Menu style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        <Dropdown.Header className="d-flex justify-content-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge bg="primary">{unreadCount} new</Badge>
          )}
        </Dropdown.Header>
        
        {notifications.length === 0 ? (
          <Dropdown.Item disabled>
            No notifications
          </Dropdown.Item>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <Dropdown.Item
              key={notification.id}
              onClick={() => onNotificationClick(notification)}
              className={!notification.read ? 'bg-light' : ''}
            >
              <div className="d-flex">
                <div className="flex-grow-1">
                  <div className="fw-bold">{notification.title}</div>
                  <small className="text-muted">{notification.message}</small>
                  <br />
                  <small className="text-muted">
                    {new Date(notification.created_at).toLocaleTimeString()}
                  </small>
                </div>
                {!notification.read && (
                  <Badge bg="primary" className="ms-2">New</Badge>
                )}
              </div>
            </Dropdown.Item>
          ))
        )}
        
        {notifications.length > 10 && (
          <>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => handleNavigation('/admin/notifications')}>
              View all notifications
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  ), [notifications, unreadCount, onNotificationClick, handleNavigation]);
  
  if (!isAuthenticated) {
    return (
      <Navbar bg="primary" variant="dark" className="admin-header">
        <Container>
          <Navbar.Brand>🍱 My Hibachi Admin</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
  
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="admin-header shadow">
      <Container fluid>
        <Navbar.Brand onClick={() => handleNavigation('/admin')} style={{ cursor: 'pointer' }}>
          🍱 My Hibachi Admin
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            {navLinks}
          </Nav>
          
          <Nav className="d-flex align-items-center">
            {/* Real-time status indicator */}
            <div className="me-3 d-flex align-items-center">
              <div className="status-indicator online me-2" title="System Online">
                <div className="status-dot"></div>
              </div>
              <small className="text-light">Online</small>
            </div>
            
            {/* Notifications */}
            <div className="me-3">
              {notificationsDropdown}
            </div>
            
            {/* User dropdown */}
            {userDropdown}
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      <style jsx>{`
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #28a745;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .admin-header .navbar-nav .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .admin-header .navbar-nav .nav-link.active {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </Navbar>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
