import React, { memo, useState, useCallback } from 'react';
import { ButtonGroup, Button, Dropdown, Modal, Form, Alert } from 'react-bootstrap';

/**
 * ⚡ QUICK ACTIONS TOOLBAR
 * Fast access to common admin operations
 */
const QuickActionsToolbar = memo(({ 
  selectedBookings = [], 
  onRefresh, 
  onBulkAction 
}) => {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkNote, setBulkNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickAction = useCallback(async (action) => {
    setIsProcessing(true);
    try {
      switch (action) {
        case 'refresh':
          await onRefresh();
          break;
        case 'export':
          await exportBookings();
          break;
        case 'backup':
          await createBackup();
          break;
        case 'maintenance':
          await toggleMaintenanceMode();
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Quick action error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onRefresh]);

  const handleBulkAction = useCallback(async () => {
    if (!bulkAction || selectedBookings.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onBulkAction(bulkAction, selectedBookings, bulkNote);
      setShowBulkModal(false);
      setBulkAction('');
      setBulkNote('');
    } catch (error) {
      console.error('Bulk action error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [bulkAction, selectedBookings, bulkNote, onBulkAction]);

  const exportBookings = async () => {
    try {
      const response = await fetch('/api/admin/export/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const createBackup = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      
      if (response.ok) {
        alert('Backup created successfully!');
      }
    } catch (error) {
      console.error('Backup error:', error);
    }
  };

  const toggleMaintenanceMode = async () => {
    if (confirm('Are you sure you want to toggle maintenance mode?')) {
      try {
        await fetch('/api/admin/maintenance/toggle', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        alert('Maintenance mode toggled!');
      } catch (error) {
        console.error('Maintenance toggle error:', error);
      }
    }
  };

  return (
    <>
      <div className="quick-actions-toolbar d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
        <div className="primary-actions">
          <ButtonGroup>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => handleQuickAction('refresh')}
              disabled={isProcessing}
            >
              <span className="emoji-visible">🔄</span>
              Refresh
            </Button>
            
            <Button 
              variant="success" 
              size="sm"
              onClick={() => handleQuickAction('export')}
              disabled={isProcessing}
            >
              <span className="emoji-visible">📊</span>
              Export
            </Button>
            
            <Button 
              variant="info" 
              size="sm"
              onClick={() => handleQuickAction('backup')}
              disabled={isProcessing}
            >
              <span className="emoji-visible">💾</span>
              Backup
            </Button>
          </ButtonGroup>
        </div>

        <div className="bulk-actions">
          {selectedBookings.length > 0 && (
            <div className="d-flex align-items-center">
              <span className="me-2 text-muted">
                {selectedBookings.length} selected
              </span>
              <Button 
                variant="warning" 
                size="sm"
                onClick={() => setShowBulkModal(true)}
              >
                <span className="emoji-visible">⚡</span>
                Bulk Actions
              </Button>
            </div>
          )}
        </div>

        <div className="system-actions">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <span className="emoji-visible">⚙️</span>
              System
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleQuickAction('maintenance')}>
                <span className="emoji-visible">🔧</span>
                Toggle Maintenance
              </Dropdown.Item>
              <Dropdown.Item href="/admin/logs">
                <span className="emoji-visible">📋</span>
                View Logs
              </Dropdown.Item>
              <Dropdown.Item href="/admin/settings">
                <span className="emoji-visible">⚙️</span>
                Settings
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Bulk Actions Modal */}
      <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="emoji-visible">⚡</span>
            Bulk Actions ({selectedBookings.length} bookings)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Action</Form.Label>
              <Form.Select 
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Select an action...</option>
                <option value="approve">✅ Approve All</option>
                <option value="reject">❌ Reject All</option>
                <option value="cancel">🚫 Cancel All</option>
                <option value="send_reminder">📧 Send Reminder</option>
                <option value="mark_paid">💰 Mark as Paid</option>
                <option value="add_note">📝 Add Note</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Note (Optional)</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)}
                placeholder="Add a note for this bulk action..."
              />
            </Form.Group>

            {bulkAction && (
              <Alert variant="warning">
                <strong>Warning:</strong> This action will be applied to {selectedBookings.length} bookings.
                This cannot be undone.
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBulkAction}
            disabled={!bulkAction || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Execute Action'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

QuickActionsToolbar.displayName = 'QuickActionsToolbar';
export default QuickActionsToolbar;
