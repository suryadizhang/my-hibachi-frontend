// BookingFilters Component - Optimized Search and Filter Controls
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Form, Row, Col, Button, Badge, InputGroup, Card } from 'react-bootstrap';

const BookingFilters = memo(({ 
  searchTerm = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  dateRange = { start: null, end: null },
  onDateRangeChange,
  sortBy = 'date',
  onSortChange,
  sortOrder = 'desc',
  onSortOrderChange,
  totalResults = 0,
  activeFiltersCount = 0,
  onClearFilters
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Memoized status options to prevent unnecessary re-renders
  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Bookings', color: 'secondary' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    { value: 'completed', label: 'Completed', color: 'info' }
  ], []);
  
  // Memoized sort options
  const sortOptions = useMemo(() => [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Customer Name' },
    { value: 'amount', label: 'Amount' },
    { value: 'status', label: 'Status' },
    { value: 'created', label: 'Created Date' }
  ], []);
  
  // Stable callback for search input
  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);
  
  // Stable callback for status filter
  const handleStatusChange = useCallback((e) => {
    onStatusFilterChange(e.target.value);
  }, [onStatusFilterChange]);
  
  // Stable callback for sort changes
  const handleSortChange = useCallback((e) => {
    onSortChange(e.target.value);
  }, [onSortChange]);
  
  // Stable callback for sort order toggle
  const handleSortOrderToggle = useCallback(() => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  }, [sortOrder, onSortOrderChange]);
  
  // Stable callback for date range changes
  const handleDateRangeChange = useCallback((field, value) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value
    });
  }, [dateRange, onDateRangeChange]);
  
  // Memoized status filter buttons
  const statusFilterButtons = useMemo(() => 
    statusOptions.map((status) => (
      <Button
        key={status.value}
        variant={statusFilter === status.value ? status.color : `outline-${status.color}`}
        size="sm"
        onClick={() => onStatusFilterChange(status.value)}
        className="me-2 mb-2"
      >
        {status.label}
      </Button>
    )),
    [statusOptions, statusFilter, onStatusFilterChange]
  );
  
  return (
    <Card className="booking-filters-component mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">🔍 Filter & Search</h6>
          <div className="d-flex align-items-center">
            {activeFiltersCount > 0 && (
              <Badge bg="primary" className="me-2">
                {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
            <Badge bg="info" className="me-2">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </Badge>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="p-0"
            >
              {isAdvancedOpen ? 'Hide' : 'Advanced'}
            </Button>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body>
        {/* Basic Filters */}
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔎</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by customer name, email, or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select value={sortBy} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant={sortOrder === 'asc' ? 'outline-primary' : 'primary'}
              onClick={handleSortOrderToggle}
              className="w-100"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </Button>
          </Col>
        </Row>
        
        {/* Status Filter Buttons */}
        <Row className="mb-3">
          <Col>
            <label className="form-label fw-bold">Status Filter:</label>
            <div>
              {statusFilterButtons}
            </div>
          </Col>
        </Row>
        
        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <Row className="advanced-filters border-top pt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date Range Start</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date Range End</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        
        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Row className="mt-3">
            <Col>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onClearFilters}
              >
                Clear All Filters
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
});

BookingFilters.displayName = 'BookingFilters';

export default BookingFilters;
