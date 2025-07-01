import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE } from '../lib/config/api';
import './LogPanel.css';

const LogPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState('');
  const [creatingData, setCreatingData] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    entityType: '',
    actionType: ''
  });

  const router = useRouter();
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("adminToken");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (!token) {
      router.push("/admin-login");
      return;
    }
    fetchLogs();
  }, [token, router, pagination.page, filters, fetchLogs, isClient]);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (filters.entityType) params.append('entity_type', filters.entityType);
      if (filters.actionType) params.append('action_type', filters.actionType);

      const res = await axios.get(`${API_BASE}/api/booking/admin/activity-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLogs(res.data.logs || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.total,
        totalPages: res.data.total_pages
      }));
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : err.response?.data?.detail || "Error fetching activity logs."
      );
      
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
      }
    }
    
    setLoading(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getActionTypeBadge = (actionType) => {
    const badgeMap = {
      'BOOKING_CREATED': 'success',
      'BOOKING_CANCELLED': 'danger',
      'DEPOSIT_CONFIRMED': 'primary',
      'NEWSLETTER_SENT': 'info',
      'WAITLIST_ADDED': 'secondary',
      'WAITLIST_REMOVED': 'warning',
      'USER_LOGIN': 'light',
      'DATA_EXPORT': 'dark'
    };
    
    return badgeMap[actionType] || 'secondary';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const clearFilters = () => {
    setFilters({ entityType: '', actionType: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const createSampleData = async () => {
    setCreatingData(true);
    setMessage('');
    
    try {
      const res = await axios.post(`${API_BASE}/api/booking/admin/create-sample-data`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setMessage('Sample data created successfully! Refresh to see new activity logs.');
        setMessageVariant('success');
        // Refresh logs after creating sample data
        setTimeout(fetchLogs, 1000);
      } else {
        setMessage(`Failed to create sample data: ${res.data.message}`);
        setMessageVariant('danger');
      }
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Error creating sample data"
      );
      setMessageVariant('danger');
    }
    
    setCreatingData(false);
  };

  return (
    <Container fluid className="log-panel">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>Activity Logs</h4>
              <p className="text-muted mb-0">
                Track all changes and activities in the system
              </p>
            </Card.Header>
            <Card.Body>
              {/* Filters */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Entity Type</Form.Label>
                    <Form.Select
                      value={filters.entityType}
                      onChange={(e) => handleFilterChange('entityType', e.target.value)}
                    >
                      <option value="">All Entities</option>
                      <option value="BOOKING">Bookings</option>
                      <option value="WAITLIST">Waitlist</option>
                      <option value="NEWSLETTER">Newsletter</option>
                      <option value="USER">Users</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Action Type</Form.Label>
                    <Form.Select
                      value={filters.actionType}
                      onChange={(e) => handleFilterChange('actionType', e.target.value)}
                    >
                      <option value="">All Actions</option>
                      <option value="BOOKING_CREATED">Booking Created</option>
                      <option value="BOOKING_CANCELLED">Booking Cancelled</option>
                      <option value="DEPOSIT_CONFIRMED">Deposit Confirmed</option>
                      <option value="NEWSLETTER_SENT">Newsletter Sent</option>
                      <option value="WAITLIST_ADDED">Waitlist Added</option>
                      <option value="WAITLIST_REMOVED">Waitlist Removed</option>
                      <option value="USER_LOGIN">User Login</option>
                      <option value="DATA_EXPORT">Data Export</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </Col>
                <Col md={3} className="d-flex align-items-end justify-content-end">
                  <Button variant="primary" onClick={fetchLogs} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Refresh'}
                  </Button>
                </Col>
              </Row>

              {/* Development Tools */}
              <Row className="mb-3">
                <Col>
                  <Card className="border-info">
                    <Card.Header className="bg-light">
                      <small className="text-muted">Development Tools</small>
                    </Card.Header>
                    <Card.Body className="py-2">
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-3">
                          Generate sample data for testing:
                        </small>
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          onClick={createSampleData} 
                          disabled={creatingData}
                        >
                          {creatingData ? (
                            <>
                              <Spinner size="sm" className="me-1" />
                              Creating...
                            </>
                          ) : (
                            'Create Sample Data'
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Message Alert */}
              {message && (
                <Alert variant={messageVariant} className="mb-3">
                  {message}
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {/* Message Alert */}
              {message && (
                <Alert variant={messageVariant} className="mb-3">
                  {message}
                </Alert>
              )}

              {/* Logs Table */}
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Entity</th>
                        <th>Description</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No activity logs found
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id}>
                            <td className="text-nowrap">
                              {formatTimestamp(log.timestamp)}
                            </td>
                            <td>
                              <strong>{log.username}</strong>
                            </td>
                            <td>
                              <Badge bg={getActionTypeBadge(log.action_type)}>
                                {log.action_type.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg="light" text="dark">
                                {log.entity_type}
                                {log.entity_id && ` #${log.entity_id}`}
                              </Badge>
                            </td>
                            <td>
                              <div className="description-cell">
                                {log.description}
                                {log.details && (
                                  <small className="text-muted d-block mt-1">
                                    {log.details}
                                  </small>
                                )}
                              </div>
                            </td>
                            <td>
                              {log.reason && (
                                <span className="reason-text">
                                  {log.reason}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <Row className="mt-3">
                      <Col className="d-flex justify-content-between align-items-center">
                        <div>
                          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                          {pagination.total} entries
                        </div>
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="me-2"
                          >
                            Previous
                          </Button>
                          <span className="mx-2">
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="ms-2"
                          >
                            Next
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogPanel;
