import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Table, Badge, Button, Spinner, Row, Col, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE } from '../../lib/config/api';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('total_bookings');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Load customers and analytics
  useEffect(() => {
    loadCustomersData();
    loadAnalytics();
  }, []);

  const loadCustomersData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/api/booking/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError('Failed to load customer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/api/booking/admin/customer-analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const loadCustomerDetail = async (email) => {
    try {
      setDetailLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/api/booking/admin/customer/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomerDetail(response.data);
    } catch (err) {
      console.error('Failed to load customer detail:', err);
      setError('Failed to load customer details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCustomerClick = async (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
    await loadCustomerDetail(customer.customer_info.email);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCustomer(null);
    setCustomerDetail(null);
  };

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const searchLower = searchTerm.toLowerCase();
      const info = customer.customer_info;
      return (
        info.name.toLowerCase().includes(searchLower) ||
        info.email.toLowerCase().includes(searchLower) ||
        info.phone.includes(searchTerm) ||
        (info.city && info.city.toLowerCase().includes(searchLower))
      );
    });

    // Sort customers
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.customer_info.name.toLowerCase();
          bValue = b.customer_info.name.toLowerCase();
          break;
        case 'total_bookings':
          aValue = a.total_bookings;
          bValue = b.total_bookings;
          break;
        case 'total_spent':
          aValue = a.total_spent;
          bValue = b.total_spent;
          break;
        case 'last_booking':
          aValue = new Date(a.last_booking_date || 0);
          bValue = new Date(b.last_booking_date || 0);
          break;
        case 'customer_tier':
          const tierOrder = { 'VIP': 4, 'Premium': 3, 'Regular': 2, 'New': 1 };
          aValue = tierOrder[a.customer_tier] || 0;
          bValue = tierOrder[b.customer_tier] || 0;
          break;
        default:
          aValue = a.total_bookings;
          bValue = b.total_bookings;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, sortBy, sortOrder]);

  // Pagination
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / pageSize);

  const getTierBadgeVariant = (tier) => {
    switch (tier) {
      case 'VIP': return 'warning';
      case 'Premium': return 'info';
      case 'Regular': return 'success';
      case 'New': return 'secondary';
      default: return 'light';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className="customer-management">
      {/* Analytics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="analytics-card">
            <Card.Body className="text-center">
              <div className="analytics-icon">👥</div>
              <h3 className="analytics-value">{analytics.total_customers || 0}</h3>
              <p className="analytics-label">Total Customers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="analytics-card">
            <Card.Body className="text-center">
              <div className="analytics-icon">🆕</div>
              <h3 className="analytics-value">{analytics.new_customers_this_month || 0}</h3>
              <p className="analytics-label">New This Month</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="analytics-card">
            <Card.Body className="text-center">
              <div className="analytics-icon">🔄</div>
              <h3 className="analytics-value">{analytics.returning_customers || 0}</h3>
              <p className="analytics-label">Returning Customers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="analytics-card">
            <Card.Body className="text-center">
              <div className="analytics-icon">📈</div>
              <h3 className="analytics-value">{(analytics.retention_rate || 0).toFixed(1)}%</h3>
              <p className="analytics-label">Retention Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Customer Tier Distribution */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <span className="me-2">🏆</span>
                Customer Tier Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {Object.entries(analytics.customer_tiers || {}).map(([tier, count]) => (
                  <Col md={3} key={tier}>
                    <div className="tier-stat">
                      <Badge bg={getTierBadgeVariant(tier)} className="tier-badge">
                        {tier}
                      </Badge>
                      <div className="tier-count">{count}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col md={4}>
              <h5 className="mb-0">
                <span className="me-2">📊</span>
                Customer Database ({filteredAndSortedCustomers.length})
              </h5>
            </Col>
            <Col md={8}>
              <Row className="align-items-center">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="total_bookings">Total Bookings</option>
                    <option value="name">Name</option>
                    <option value="total_spent">Total Spent</option>
                    <option value="last_booking">Last Booking</option>
                    <option value="customer_tier">Customer Tier</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-primary"
                    onClick={loadCustomersData}
                    disabled={loading}
                  >
                    <span className="me-1">🔄</span>
                    Refresh
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Header>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Customer Table */}
      <Card>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Tier</th>
                  <th>Bookings</th>
                  <th>Total Spent</th>
                  <th>Last Booking</th>
                  <th>Favorite Times</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="no-data">
                        <span className="no-data-icon">👥</span>
                        <p>No customers found</p>
                        <small className="text-muted">Try adjusting your search criteria</small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer, index) => (
                    <tr key={customer.customer_info.email} className="customer-row">
                      <td>
                        <div className="customer-info">
                          <strong>{customer.customer_info.name}</strong>
                          <br />
                          <small className="text-muted">{customer.customer_info.email}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{formatPhone(customer.customer_info.phone)}</div>
                          <small className="text-muted">
                            Prefers: {customer.customer_info.contact_preference}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {customer.customer_info.city && (
                            <>
                              {customer.customer_info.city}
                              <br />
                              <small className="text-muted">
                                {customer.customer_info.zipcode}
                              </small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getTierBadgeVariant(customer.customer_tier)}>
                          {customer.customer_tier}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <strong>{customer.total_bookings}</strong>
                        <br />
                        <small className="text-muted">
                          {customer.booking_status_counts.confirmed} confirmed
                        </small>
                      </td>
                      <td className="text-center">
                        <strong>{formatCurrency(customer.total_spent)}</strong>
                      </td>
                      <td>
                        {formatDate(customer.last_booking_date)}
                      </td>
                      <td>
                        <div className="favorite-times">
                          {customer.favorite_time_slots.slice(0, 2).map((slot, idx) => (
                            <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleCustomerClick(customer)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <div className="pagination-controls">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={closeDetailModal}
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="me-2">👤</span>
            Customer Details: {selectedCustomer?.customer_info.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading customer details...</p>
            </div>
          ) : customerDetail ? (
            <div className="customer-detail">
              {/* Customer Info */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Contact Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Email:</strong> {customerDetail.customer_info.email}</p>
                      <p><strong>Phone:</strong> {formatPhone(customerDetail.customer_info.phone)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Address:</strong> {customerDetail.customer_info.address}</p>
                      <p><strong>City:</strong> {customerDetail.customer_info.city} {customerDetail.customer_info.zipcode}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Booking History */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    Booking History ({customerDetail.booking_history.length} bookings)
                  </h6>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Deposit</th>
                          <th>Booked On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerDetail.booking_history.map((booking, index) => (
                          <tr key={index}>
                            <td>{formatDate(booking.date)}</td>
                            <td>{booking.time_slot}</td>
                            <td>
                              <Badge bg={
                                booking.status === 'confirmed' ? 'success' :
                                booking.status === 'cancelled' ? 'danger' : 'warning'
                              }>
                                {booking.status}
                              </Badge>
                            </td>
                            <td>
                              {booking.deposit_received ? (
                                <Badge bg="success">Paid</Badge>
                              ) : (
                                <Badge bg="warning">Pending</Badge>
                              )}
                            </td>
                            <td>{formatDate(booking.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <Alert variant="warning">
              Failed to load customer details.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDetailModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
