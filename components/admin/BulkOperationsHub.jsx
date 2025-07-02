import React, { memo, useState, useCallback, useMemo } from 'react';
import { Card, Button, Dropdown, ProgressBar, Alert, Badge, Modal, Form } from 'react-bootstrap';
import './AdminComponents.css';

/**
 * 🔄 BULK OPERATIONS HUB
 * Comprehensive bulk operations with progress tracking and confirmation
 */
const BulkOperationsHub = memo(({
  selectedItems = [],
  availableActions = [],
  onBulkAction,
  onSelectAll,
  onClearSelection,
  totalItems = 0,
  isLoading = false,
  operationProgress = null
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionParameters, setActionParameters] = useState({});
  const [showProgress, setShowProgress] = useState(false);

  // Available bulk actions with configurations
  const bulkActions = useMemo(() => ({
    approve: {
      label: 'Approve Bookings',
      icon: '✅',
      variant: 'success',
      requiresConfirmation: true,
      description: 'Approve selected bookings and send confirmation emails',
      parameters: []
    },
    cancel: {
      label: 'Cancel Bookings',
      icon: '❌',
      variant: 'danger',
      requiresConfirmation: true,
      description: 'Cancel selected bookings and notify customers',
      parameters: [
        { name: 'reason', type: 'select', label: 'Cancellation Reason', required: true,
          options: ['Customer Request', 'Restaurant Closure', 'Weather', 'Staff Shortage', 'Other'] },
        { name: 'refund', type: 'checkbox', label: 'Issue Full Refund', defaultValue: true },
        { name: 'customMessage', type: 'textarea', label: 'Custom Message (Optional)' }
      ]
    },
    reschedule: {
      label: 'Reschedule Bookings',
      icon: '📅',
      variant: 'warning',
      requiresConfirmation: true,
      description: 'Batch reschedule selected bookings',
      parameters: [
        { name: 'newDate', type: 'date', label: 'New Date', required: true },
        { name: 'newTime', type: 'time', label: 'New Time', required: true },
        { name: 'notifyCustomers', type: 'checkbox', label: 'Notify Customers', defaultValue: true }
      ]
    },
    export: {
      label: 'Export Data',
      icon: '📥',
      variant: 'info',
      requiresConfirmation: false,
      description: 'Export selected bookings to various formats',
      parameters: [
        { name: 'format', type: 'select', label: 'Export Format', required: true,
          options: ['CSV', 'Excel', 'PDF Report'] },
        { name: 'includeCustomerData', type: 'checkbox', label: 'Include Customer Details', defaultValue: true }
      ]
    },
    sendReminder: {
      label: 'Send Reminders',
      icon: '📧',
      variant: 'primary',
      requiresConfirmation: true,
      description: 'Send reminder emails to selected customers',
      parameters: [
        { name: 'template', type: 'select', label: 'Email Template', required: true,
          options: ['Standard Reminder', 'Urgent Reminder', 'Custom'] },
        { name: 'scheduleTime', type: 'datetime-local', label: 'Schedule Send Time (Optional)' }
      ]
    },
    updateStatus: {
      label: 'Update Status',
      icon: '🔄',
      variant: 'secondary',
      requiresConfirmation: true,
      description: 'Bulk update booking status',
      parameters: [
        { name: 'newStatus', type: 'select', label: 'New Status', required: true,
          options: ['pending', 'confirmed', 'completed', 'no-show'] }
      ]
    }
  }), []);

  // Filter available actions
  const filteredActions = useMemo(() => 
    availableActions.filter(actionKey => bulkActions[actionKey])
  , [availableActions, bulkActions]);

  // Handle action selection
  const handleActionSelect = useCallback((actionKey) => {
    const action = bulkActions[actionKey];
    setSelectedAction({ key: actionKey, ...action });
    setActionParameters({});
    
    if (action.requiresConfirmation || action.parameters.length > 0) {
      setShowConfirmModal(true);
    } else {
      executeBulkAction(actionKey, {});
    }
  }, [bulkActions]);

  // Handle parameter change
  const handleParameterChange = useCallback((paramName, value) => {
    setActionParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  }, []);

  // Execute bulk action
  const executeBulkAction = useCallback(async (actionKey, parameters) => {
    try {
      setShowProgress(true);
      setShowConfirmModal(false);
      
      await onBulkAction(actionKey, selectedItems, parameters);
      
      // Clear selection after successful operation
      onClearSelection();
    } catch (error) {
      console.error('Bulk action error:', error);
    } finally {
      setShowProgress(false);
      setSelectedAction(null);
    }
  }, [selectedItems, onBulkAction, onClearSelection]);

  // Confirm and execute action
  const handleConfirmAction = useCallback(() => {
    if (selectedAction) {
      executeBulkAction(selectedAction.key, actionParameters);
    }
  }, [selectedAction, actionParameters, executeBulkAction]);

  // Selection stats
  const selectionStats = useMemo(() => ({
    selected: selectedItems.length,
    total: totalItems,
    percentage: totalItems > 0 ? Math.round((selectedItems.length / totalItems) * 100) : 0
  }), [selectedItems.length, totalItems]);

  if (selectedItems.length === 0) {
    return (
      <Card className="bulk-operations-hub mb-4">
        <Card.Body className="text-center py-4">
          <div className="text-muted">
            <div className="bulk-operations-empty-icon mb-2">📦</div>
            <p className="mb-0">Select items to enable bulk operations</p>
            <small>Use checkboxes to select multiple bookings</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="bulk-operations-hub mb-4">
        <Card.Body>
          {/* Selection Summary */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="selection-summary">
              <Badge bg="primary" className="me-2">
                {selectionStats.selected} selected
              </Badge>
              <span className="text-muted">
                ({selectionStats.percentage}% of {selectionStats.total} items)
              </span>
            </div>
            
            <div className="selection-controls">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onSelectAll}
                className="me-2"
              >
                Select All ({totalItems})
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onClearSelection}
              >
                Clear Selection
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && operationProgress && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">
                  {operationProgress.operation} - {operationProgress.current} of {operationProgress.total}
                </small>
                <small className="text-muted">
                  {Math.round((operationProgress.current / operationProgress.total) * 100)}%
                </small>
              </div>
              <ProgressBar
                now={(operationProgress.current / operationProgress.total) * 100}
                variant={operationProgress.hasErrors ? 'warning' : 'success'}
                animated
              />
              {operationProgress.hasErrors && (
                <small className="text-warning">
                  ⚠️ {operationProgress.errors} errors encountered
                </small>
              )}
            </div>
          )}

          {/* Bulk Actions */}
          <div className="bulk-actions">
            <small className="text-muted me-3">Bulk Actions:</small>
            {filteredActions.map(actionKey => {
              const action = bulkActions[actionKey];
              return (
                <Button
                  key={actionKey}
                  variant={action.variant}
                  size="sm"
                  className="me-2 mb-2"
                  onClick={() => handleActionSelect(actionKey)}
                  disabled={isLoading || showProgress}
                >
                  {action.icon} {action.label}
                </Button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="bulk-stats mt-3 pt-3 border-top">
            <div className="row text-center">
              <div className="col">
                <div className="bulk-stat-value">{selectedItems.length}</div>
                <div className="bulk-stat-label">Selected Items</div>
              </div>
              <div className="col">
                <div className="bulk-stat-value">{filteredActions.length}</div>
                <div className="bulk-stat-label">Available Actions</div>
              </div>
              <div className="col">
                <div className="bulk-stat-value">{selectionStats.percentage}%</div>
                <div className="bulk-stat-label">Selection Coverage</div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAction?.icon} Confirm {selectedAction?.label}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Action:</strong> {selectedAction?.description}
            <br />
            <strong>Selected Items:</strong> {selectedItems.length} bookings
          </Alert>

          {/* Action Parameters */}
          {selectedAction?.parameters && selectedAction.parameters.length > 0 && (
            <div className="action-parameters">
              <h6>Parameters:</h6>
              {selectedAction.parameters.map(param => (
                <Form.Group key={param.name} className="mb-3">
                  <Form.Label>
                    {param.label}
                    {param.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  
                  {param.type === 'select' && (
                    <Form.Select
                      value={actionParameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      required={param.required}
                    >
                      <option value="">Select {param.label}</option>
                      {param.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Form.Select>
                  )}
                  
                  {param.type === 'textarea' && (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={actionParameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      placeholder={`Enter ${param.label.toLowerCase()}`}
                    />
                  )}
                  
                  {param.type === 'checkbox' && (
                    <Form.Check
                      type="checkbox"
                      label={param.label}
                      checked={actionParameters[param.name] ?? param.defaultValue ?? false}
                      onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                    />
                  )}
                  
                  {['date', 'time', 'datetime-local'].includes(param.type) && (
                    <Form.Control
                      type={param.type}
                      value={actionParameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      required={param.required}
                    />
                  )}
                </Form.Group>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={selectedAction?.variant || 'primary'} 
            onClick={handleConfirmAction}
            disabled={selectedAction?.parameters?.some(p => 
              p.required && !actionParameters[p.name]
            )}
          >
            {selectedAction?.icon} Execute {selectedAction?.label}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

BulkOperationsHub.displayName = 'BulkOperationsHub';

export default BulkOperationsHub;
