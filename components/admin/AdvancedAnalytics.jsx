import React, { memo, useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Dropdown, Spinner } from 'react-bootstrap';

/**
 * 📊 ADVANCED ANALYTICS DASHBOARD
 * Comprehensive business insights with performance metrics
 */
const AdvancedAnalytics = memo(() => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Analytics loading error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!analyticsData) return null;

    return {
      bookingTrends: analyticsData.bookingTrends || [],
      revenueGrowth: analyticsData.revenueGrowth || [],
      customerSegments: analyticsData.customerSegments || [],
      popularTimeSlots: analyticsData.popularTimeSlots || []
    };
  }, [analyticsData]);

  if (isLoading) {
    return (
      <Card>
        <Card.Body className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading analytics...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="advanced-analytics">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <span className="emoji-visible">📊</span>
            Business Analytics
          </h5>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {timeRange === '7d' ? 'Last 7 Days' : 
               timeRange === '30d' ? 'Last 30 Days' : 
               timeRange === '90d' ? 'Last 3 Months' : 'Last Year'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTimeRange('7d')}>Last 7 Days</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeRange('30d')}>Last 30 Days</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeRange('90d')}>Last 3 Months</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeRange('1y')}>Last Year</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Booking Trends */}
            <Col md={6} className="mb-4">
              <div className="analytics-chart">
                <h6 className="chart-title">
                  <span className="emoji-visible">📈</span>
                  Booking Trends
                </h6>
                <div className="chart-container">
                  {chartData?.bookingTrends?.length > 0 ? (
                    <div className="trend-chart">
                      {chartData.bookingTrends.map((point, index) => (
                        <div key={index} className="trend-point">
                          <div className="trend-date">{point.date}</div>
                          <div className="trend-value">{point.bookings}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data">No booking data available</div>
                  )}
                </div>
              </div>
            </Col>

            {/* Revenue Growth */}
            <Col md={6} className="mb-4">
              <div className="analytics-chart">
                <h6 className="chart-title">
                  <span className="emoji-visible">💰</span>
                  Revenue Growth
                </h6>
                <div className="chart-container">
                  {analyticsData?.totalRevenue && (
                    <div className="revenue-summary">
                      <div className="revenue-amount">
                        ${analyticsData.totalRevenue.toLocaleString()}
                      </div>
                      <div className="revenue-growth">
                        <span className={`growth-indicator ${analyticsData.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                          {analyticsData.revenueGrowth >= 0 ? '↗️' : '↘️'}
                          {Math.abs(analyticsData.revenueGrowth)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            {/* Popular Time Slots */}
            <Col md={6} className="mb-4">
              <div className="analytics-chart">
                <h6 className="chart-title">
                  <span className="emoji-visible">⏰</span>
                  Popular Time Slots
                </h6>
                <div className="time-slots-chart">
                  {chartData?.popularTimeSlots?.map((slot, index) => (
                    <div key={index} className="time-slot-bar">
                      <div className="slot-time">{slot.time}</div>
                      <div className="slot-bar">
                        <div 
                          className="slot-fill"
                          style={{ width: `${(slot.bookings / chartData.popularTimeSlots[0].bookings) * 100}%` }}
                        ></div>
                      </div>
                      <div className="slot-count">{slot.bookings}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {/* Customer Insights */}
            <Col md={6} className="mb-4">
              <div className="analytics-chart">
                <h6 className="chart-title">
                  <span className="emoji-visible">👥</span>
                  Customer Insights
                </h6>
                <div className="customer-metrics">
                  <div className="metric-item">
                    <span className="metric-label">New Customers</span>
                    <span className="metric-value">{analyticsData?.newCustomers || 0}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Repeat Customers</span>
                    <span className="metric-value">{analyticsData?.repeatCustomers || 0}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Average Party Size</span>
                    <span className="metric-value">{analyticsData?.avgPartySize || 0}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Customer Satisfaction</span>
                    <span className="metric-value">{analyticsData?.avgRating || 0}⭐</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
});

AdvancedAnalytics.displayName = 'AdvancedAnalytics';
export default AdvancedAnalytics;
