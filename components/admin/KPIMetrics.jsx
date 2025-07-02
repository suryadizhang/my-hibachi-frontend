// KPIMetrics Component - Optimized Dashboard Statistics
import React, { memo, useMemo } from 'react';
import { Card, Row, Col, Badge, Spinner } from 'react-bootstrap';

const KPIMetrics = memo(({ 
  totalBookings = 0, 
  weeklyBookings = 0, 
  monthlyRevenue = 0, 
  averageBookingValue = 0,
  pendingBookings = 0,
  cancellationRate = 0,
  isLoading = false,
  lastUpdated = null 
}) => {
  // Memoized KPI data to prevent unnecessary recalculations
  const kpiData = useMemo(() => [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: "📅",
      color: "primary",
      trend: "+12%",
      subtitle: "All time"
    },
    {
      title: "This Week",
      value: weeklyBookings,
      icon: "📈",
      color: "success", 
      trend: "+8%",
      subtitle: "Weekly bookings"
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue?.toLocaleString()}`,
      icon: "💰",
      color: "info",
      trend: "+15%",
      subtitle: "Current month"
    },
    {
      title: "Average Booking",
      value: `$${averageBookingValue?.toFixed(2)}`,
      icon: "💵",
      color: "warning",
      trend: "+5%",
      subtitle: "Per booking"
    },
    {
      title: "Pending",
      value: pendingBookings,
      icon: "⏳",
      color: "secondary",
      trend: "-2%",
      subtitle: "Awaiting approval"
    },
    {
      title: "Cancellation Rate",
      value: `${cancellationRate?.toFixed(1)}%`,
      icon: "❌",
      color: cancellationRate > 10 ? "danger" : "success",
      trend: cancellationRate > 10 ? "+3%" : "-1%",
      subtitle: "Last 30 days"
    }
  ], [totalBookings, weeklyBookings, monthlyRevenue, averageBookingValue, pendingBookings, cancellationRate]);
  
  // Memoized card rendering to prevent unnecessary re-renders
  const renderKPICard = useMemo(() => 
    kpiData.map((kpi, index) => (
      <Col key={`kpi-${index}`} lg={2} md={4} sm={6} className="mb-3">
        <Card className={`kpi-card h-100 border-${kpi.color}`}>
          <Card.Body className="p-3">
            <div className="d-flex align-items-start justify-content-between">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <span className="kpi-icon me-2" style={{ fontSize: '1.5rem' }}>
                    {kpi.icon}
                  </span>
                  <Badge bg={kpi.color} className="trend-badge">
                    {kpi.trend}
                  </Badge>
                </div>
                <Card.Title className="h6 text-muted mb-1">{kpi.title}</Card.Title>
                <Card.Text className="h4 mb-1 fw-bold">
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    kpi.value
                  )}
                </Card.Text>
                <small className="text-muted">{kpi.subtitle}</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    )), 
    [kpiData, isLoading]
  );
  
  return (
    <div className="kpi-metrics-component">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">📊 Dashboard Overview</h5>
        {lastUpdated && (
          <small className="text-muted">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </small>
        )}
      </div>
      
      <Row className="kpi-metrics">
        {renderKPICard}
      </Row>
      
      {isLoading && (
        <div className="text-center py-3">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading dashboard metrics...</p>
        </div>
      )}
    </div>
  );
});

KPIMetrics.displayName = 'KPIMetrics';

export default KPIMetrics;
