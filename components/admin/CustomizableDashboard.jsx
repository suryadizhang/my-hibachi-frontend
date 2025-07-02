import React, { memo, useState, useCallback, useMemo } from 'react';
import { Card, Row, Col, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
// Temporarily removed react-beautiful-dnd due to React 19 compatibility issues
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AdminComponents.css';

/**
 * 🎨 CUSTOMIZABLE DASHBOARD
 * Drag-and-drop dashboard with widget customization and layouts
 */
const CustomizableDashboard = memo(({
  widgets = [],
  layout = [],
  onLayoutChange,
  onWidgetToggle,
  onWidgetConfigChange,
  userPreferences = {},
  onPreferencesChange
}) => {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempLayout, setTempLayout] = useState(layout);

  // Available widget types with configurations
  const availableWidgets = useMemo(() => ({
    kpi_metrics: {
      title: 'KPI Metrics',
      description: 'Key performance indicators and metrics',
      icon: '📊',
      defaultSize: { w: 6, h: 2 },
      configurable: true,
      config: {
        showRevenue: true,
        showBookings: true,
        showCancellations: true,
        showGrowth: true,
        timeRange: '7d'
      }
    },
    recent_bookings: {
      title: 'Recent Bookings',
      description: 'Latest booking activities',
      icon: '📅',
      defaultSize: { w: 6, h: 4 },
      configurable: true,
      config: {
        limit: 10,
        showCustomerInfo: true,
        showAmount: true,
        autoRefresh: true
      }
    },
    revenue_chart: {
      title: 'Revenue Chart',
      description: 'Revenue trends and analytics',
      icon: '💰',
      defaultSize: { w: 8, h: 4 },
      configurable: true,
      config: {
        chartType: 'line',
        timeRange: '30d',
        showComparison: true,
        showProjection: false
      }
    },
    activity_feed: {
      title: 'Activity Feed',
      description: 'Real-time activity updates',
      icon: '🔔',
      defaultSize: { w: 4, h: 6 },
      configurable: true,
      config: {
        maxItems: 20,
        showTimestamps: true,
        autoScroll: true,
        filterTypes: ['all']
      }
    },
    booking_calendar: {
      title: 'Booking Calendar',
      description: 'Calendar view of upcoming bookings',
      icon: '🗓️',
      defaultSize: { w: 8, h: 6 },
      configurable: true,
      config: {
        view: 'month',
        showCapacity: true,
        colorByStatus: true,
        showWaitlist: true
      }
    },
    customer_insights: {
      title: 'Customer Insights',
      description: 'Customer analytics and segmentation',
      icon: '👥',
      defaultSize: { w: 6, h: 4 },
      configurable: true,
      config: {
        showSegments: true,
        showLifetimeValue: true,
        showSatisfaction: true,
        timeRange: '90d'
      }
    },
    quick_actions: {
      title: 'Quick Actions',
      description: 'Frequently used admin actions',
      icon: '⚡',
      defaultSize: { w: 4, h: 3 },
      configurable: true,
      config: {
        actions: ['new_booking', 'cancel_booking', 'send_reminder', 'export_data'],
        showLabels: true,
        layout: 'grid'
      }
    },
    notifications: {
      title: 'Smart Notifications',
      description: 'Intelligent alerts and notifications',
      icon: '🔔',
      defaultSize: { w: 4, h: 4 },
      configurable: true,
      config: {
        maxNotifications: 15,
        showPriority: true,
        autoMarkRead: false,
        groupByType: true
      }
    },
    performance_monitor: {
      title: 'Performance Monitor',
      description: 'System performance and health metrics',
      icon: '⚡',
      defaultSize: { w: 6, h: 3 },
      configurable: true,
      config: {
        showCPU: true,
        showMemory: true,
        showRequests: true,
        showErrors: true,
        refreshInterval: 30
      }
    }
  }), []);

  // Active widgets based on layout
  const activeWidgets = useMemo(() => 
    layout.map(item => ({
      ...item,
      ...availableWidgets[item.id],
      config: { ...availableWidgets[item.id]?.config, ...item.config }
    }))
  , [layout, availableWidgets]);

  // Inactive widgets (available to add)
  const inactiveWidgets = useMemo(() => 
    Object.keys(availableWidgets).filter(id => 
      !layout.find(item => item.id === id)
    ).map(id => ({ id, ...availableWidgets[id] }))
  , [availableWidgets, layout]);

  // Handle drag end
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const newLayout = Array.from(tempLayout);
    const [reorderedItem] = newLayout.splice(result.source.index, 1);
    newLayout.splice(result.destination.index, 0, reorderedItem);

    setTempLayout(newLayout);
    if (!editMode) {
      onLayoutChange(newLayout);
    }
  }, [tempLayout, editMode, onLayoutChange]);

  // Add widget to dashboard
  const handleAddWidget = useCallback((widgetId) => {
    const widget = availableWidgets[widgetId];
    if (!widget) return;

    const newWidget = {
      id: widgetId,
      x: 0,
      y: 0,
      ...widget.defaultSize,
      config: { ...widget.config }
    };

    const newLayout = [...layout, newWidget];
    onLayoutChange(newLayout);
    setShowCustomizeModal(false);
  }, [availableWidgets, layout, onLayoutChange]);

  // Remove widget from dashboard
  const handleRemoveWidget = useCallback((widgetId) => {
    const newLayout = layout.filter(item => item.id !== widgetId);
    onLayoutChange(newLayout);
  }, [layout, onLayoutChange]);

  // Open widget configuration
  const handleConfigureWidget = useCallback((widget) => {
    setSelectedWidget(widget);
  }, []);

  // Save widget configuration
  const handleSaveWidgetConfig = useCallback((config) => {
    if (!selectedWidget) return;

    const newLayout = layout.map(item => 
      item.id === selectedWidget.id 
        ? { ...item, config: { ...item.config, ...config } }
        : item
    );

    onLayoutChange(newLayout);
    setSelectedWidget(null);
  }, [selectedWidget, layout, onLayoutChange]);

  // Toggle edit mode
  const handleToggleEditMode = useCallback(() => {
    if (editMode) {
      // Save changes when exiting edit mode
      onLayoutChange(tempLayout);
    } else {
      // Initialize temp layout when entering edit mode
      setTempLayout(layout);
    }
    setEditMode(!editMode);
  }, [editMode, tempLayout, layout, onLayoutChange]);

  // Preset layouts
  const presetLayouts = {
    default: [
      { id: 'kpi_metrics', x: 0, y: 0, w: 12, h: 2 },
      { id: 'recent_bookings', x: 0, y: 2, w: 6, h: 4 },
      { id: 'activity_feed', x: 6, y: 2, w: 6, h: 4 },
      { id: 'revenue_chart', x: 0, y: 6, w: 12, h: 4 }
    ],
    analytics: [
      { id: 'kpi_metrics', x: 0, y: 0, w: 8, h: 2 },
      { id: 'performance_monitor', x: 8, y: 0, w: 4, h: 2 },
      { id: 'revenue_chart', x: 0, y: 2, w: 8, h: 4 },
      { id: 'customer_insights', x: 8, y: 2, w: 4, h: 4 },
      { id: 'booking_calendar', x: 0, y: 6, w: 12, h: 4 }
    ],
    operations: [
      { id: 'quick_actions', x: 0, y: 0, w: 4, h: 3 },
      { id: 'notifications', x: 4, y: 0, w: 4, h: 3 },
      { id: 'kpi_metrics', x: 8, y: 0, w: 4, h: 3 },
      { id: 'recent_bookings', x: 0, y: 3, w: 8, h: 4 },
      { id: 'activity_feed', x: 8, y: 3, w: 4, h: 4 }
    ]
  };

  return (
    <>
      {/* Dashboard Controls */}
      <Card className="dashboard-controls mb-4">
        <Card.Body className="py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button
                variant={editMode ? 'success' : 'outline-primary'}
                size="sm"
                onClick={handleToggleEditMode}
                className="me-2"
              >
                {editMode ? '💾 Save Layout' : '✏️ Edit Layout'}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowCustomizeModal(true)}
                className="me-2"
              >
                ⚙️ Add Widgets
              </Button>
              {editMode && (
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => setTempLayout(layout)}
                >
                  🔄 Reset Changes
                </Button>
              )}
            </div>
            
            <div>
              <span className="text-muted me-3">
                {activeWidgets.length} active widgets
              </span>
              {editMode && (
                <Badge bg="warning">Edit Mode</Badge>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Dashboard Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="dashboard-grid"
            >
              <Row>
                {(editMode ? tempLayout : layout).map((widget, index) => {
                  const widgetConfig = availableWidgets[widget.id];
                  if (!widgetConfig) return null;

                  return (
                    <Draggable 
                      key={widget.id} 
                      draggableId={widget.id} 
                      index={index}
                      isDragDisabled={!editMode}
                    >
                      {(provided, snapshot) => (
                        <Col
                          md={widget.w || 6}
                          className="mb-4"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Card 
                            className={`dashboard-widget ${snapshot.isDragging ? 'dragging' : ''} ${editMode ? 'edit-mode' : ''}`}
                            style={{ height: `${(widget.h || 4) * 100}px` }}
                          >
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                {editMode && (
                                  <div {...provided.dragHandleProps} className="drag-handle me-2">
                                    ⋮⋮
                                  </div>
                                )}
                                <span>
                                  {widgetConfig.icon} {widgetConfig.title}
                                </span>
                              </div>
                              
                              <div>
                                {widgetConfig.configurable && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 me-2"
                                    onClick={() => handleConfigureWidget({ ...widget, ...widgetConfig })}
                                  >
                                    ⚙️
                                  </Button>
                                )}
                                {editMode && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 text-danger"
                                    onClick={() => handleRemoveWidget(widget.id)}
                                  >
                                    🗑️
                                  </Button>
                                )}
                              </div>
                            </Card.Header>
                            
                            <Card.Body className="widget-content">
                              {editMode ? (
                                <div className="text-center text-muted">
                                  <div className="widget-preview-icon">{widgetConfig.icon}</div>
                                  <p>{widgetConfig.description}</p>
                                  <small>Size: {widget.w}x{widget.h}</small>
                                </div>
                              ) : (
                                <div className="widget-placeholder">
                                  {/* Actual widget content would be rendered here */}
                                  <div className="text-center">
                                    <div style={{ fontSize: '3rem' }}>{widgetConfig.icon}</div>
                                    <h6>{widgetConfig.title}</h6>
                                    <p className="text-muted">{widgetConfig.description}</p>
                                  </div>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                    </Draggable>
                  );
                })}
              </Row>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Widget Modal */}
      <Modal show={showCustomizeModal} onHide={() => setShowCustomizeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎨 Customize Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Preset Layouts */}
          <div className="mb-4">
            <h6>Quick Setup:</h6>
            <div className="d-flex gap-2 mb-3">
              {Object.entries(presetLayouts).map(([name, layoutConfig]) => (
                <Button
                  key={name}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    onLayoutChange(layoutConfig);
                    setShowCustomizeModal(false);
                  }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)} Layout
                </Button>
              ))}
            </div>
          </div>

          {/* Available Widgets */}
          <div>
            <h6>Available Widgets:</h6>
            <Row>
              {inactiveWidgets.map(widget => (
                <Col md={6} key={widget.id} className="mb-3">
                  <Card className="widget-selector">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">
                            {widget.icon} {widget.title}
                          </h6>
                          <p className="text-muted mb-2 small">{widget.description}</p>
                          <small className="text-muted">
                            Size: {widget.defaultSize.w}x{widget.defaultSize.h}
                          </small>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddWidget(widget.id)}
                        >
                          + Add
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {inactiveWidgets.length === 0 && (
              <Alert variant="info">
                All available widgets are already added to your dashboard.
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Widget Configuration Modal */}
      {selectedWidget && (
        <Modal show={!!selectedWidget} onHide={() => setSelectedWidget(null)}>
          <Modal.Header closeButton>
            <Modal.Title>
              ⚙️ Configure {selectedWidget.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {Object.entries(selectedWidget.config || {}).map(([key, value]) => (
                <Form.Group key={key} className="mb-3">
                  <Form.Label>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Form.Label>
                  
                  {typeof value === 'boolean' ? (
                    <Form.Check
                      type="checkbox"
                      checked={value}
                      onChange={(e) => {
                        const newConfig = { ...selectedWidget.config, [key]: e.target.checked };
                        setSelectedWidget({ ...selectedWidget, config: newConfig });
                      }}
                    />
                  ) : typeof value === 'number' ? (
                    <Form.Control
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newConfig = { ...selectedWidget.config, [key]: parseInt(e.target.value) };
                        setSelectedWidget({ ...selectedWidget, config: newConfig });
                      }}
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newConfig = { ...selectedWidget.config, [key]: e.target.value };
                        setSelectedWidget({ ...selectedWidget, config: newConfig });
                      }}
                    />
                  )}
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedWidget(null)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleSaveWidgetConfig(selectedWidget.config)}
            >
              Save Configuration
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
});

CustomizableDashboard.displayName = 'CustomizableDashboard';

export default CustomizableDashboard;
