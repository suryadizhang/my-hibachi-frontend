import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, Spinner, Table, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';
import './NewsletterManager.css';

const NewsletterManager = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendingStats, setSendingStats] = useState({ total: 0, sent: 0, failed: 0 });
  
  // Filters
  const [cityFilter, setCityFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  
  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    targetCities: [],
    sendToAll: true,
    scheduledDate: '',
    isHtml: true
  });

  // Draft management
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchRecipients();
    loadDrafts();
  }, [token, navigate]);

  const fetchRecipients = async (cityFilter = '', nameFilter = '') => {
    setLoading(true);
    try {
      let url = `${API_BASE}/admin/newsletter/recipients`;
      const params = new URLSearchParams();
      if (cityFilter) params.append('city', cityFilter);
      if (nameFilter) params.append('name', nameFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipients(res.data.recipients || []);
      
      // Fetch cities separately
      const citiesRes = await axios.get(`${API_BASE}/admin/newsletter/cities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCities(citiesRes.data.cities || []);
    } catch (error) {
      setMessage("Failed to fetch newsletter recipients");
      setVariant("danger");
    }
    setLoading(false);
  };

  const loadDrafts = () => {
    const savedDrafts = JSON.parse(localStorage.getItem('newsletterDrafts') || '[]');
    setDrafts(savedDrafts);
  };

  const saveDraft = () => {
    const draftId = Date.now();
    const draft = {
      id: draftId,
      ...newsletterForm,
      savedAt: new Date().toISOString(),
      name: newsletterForm.subject || `Draft ${new Date().toLocaleDateString()}`
    };
    
    const savedDrafts = JSON.parse(localStorage.getItem('newsletterDrafts') || '[]');
    savedDrafts.push(draft);
    localStorage.setItem('newsletterDrafts', JSON.stringify(savedDrafts));
    setDrafts(savedDrafts);
    
    setMessage("Draft saved successfully");
    setVariant("success");
  };

  const loadDraft = (draft) => {
    setNewsletterForm({
      subject: draft.subject,
      content: draft.content,
      targetCities: draft.targetCities,
      sendToAll: draft.sendToAll,
      scheduledDate: draft.scheduledDate,
      isHtml: draft.isHtml
    });
    setSelectedDraft(draft);
    setMessage(`Draft "${draft.name}" loaded`);
    setVariant("info");
  };

  const deleteDraft = (draftId) => {
    const savedDrafts = JSON.parse(localStorage.getItem('newsletterDrafts') || '[]');
    const filtered = savedDrafts.filter(d => d.id !== draftId);
    localStorage.setItem('newsletterDrafts', JSON.stringify(filtered));
    setDrafts(filtered);
    setMessage("Draft deleted");
    setVariant("info");
  };

  const handleCityToggle = (city) => {
    if (newsletterForm.targetCities.includes(city)) {
      setNewsletterForm({
        ...newsletterForm,
        targetCities: newsletterForm.targetCities.filter(c => c !== city)
      });
    } else {
      setNewsletterForm({
        ...newsletterForm,
        targetCities: [...newsletterForm.targetCities, city]
      });
    }
  };

  const getTargetedRecipients = () => {
    if (newsletterForm.sendToAll && !cityFilter && !nameFilter) {
      return recipients;
    }
    return recipients.filter(r => {
      const cityMatch = !cityFilter || r.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const nameMatch = !nameFilter || r.name?.toLowerCase().includes(nameFilter.toLowerCase());
      const targetCityMatch = newsletterForm.sendToAll || 
        newsletterForm.targetCities.length === 0 || 
        newsletterForm.targetCities.includes(r.city);
      
      return cityMatch && nameMatch && targetCityMatch;
    });
  };

  const handlePreview = () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      setMessage("Please fill in subject and content");
      setVariant("warning");
      return;
    }
    setShowConfirmModal(true);
  };

  const sendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      setMessage("Please fill in all required fields");
      setVariant("danger");
      return;
    }

    setLoading(true);
    setSendingStats({ total: 0, sent: 0, failed: 0 });
    
    try {
      const targetRecipients = getTargetedRecipients();
      setSendingStats(prev => ({ ...prev, total: targetRecipients.length }));

      const payload = {
        subject: newsletterForm.subject,
        message: newsletterForm.content,
        city_filter: cityFilter,
        send_type: 'email'
      };

      const res = await axios.post(`${API_BASE}/admin/newsletter/send`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSendingStats({
        total: res.data.total_recipients || 0,
        sent: res.data.sent_count || 0,
        failed: res.data.failed_count || 0
      });

      setMessage(`Newsletter sent successfully! ${res.data.sent_count}/${res.data.total_recipients} emails delivered`);
      setVariant("success");
      
      // Clear form after successful send
      setNewsletterForm({
        subject: '',
        content: '',
        targetCities: [],
        sendToAll: true,
        scheduledDate: '',
        isHtml: true
      });
      setCityFilter('');
      setNameFilter('');
      
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to send newsletter");
      setVariant("danger");
    }
    
    setLoading(false);
    setShowConfirmModal(false);
  };

  const resetForm = () => {
    setNewsletterForm({
      subject: '',
      content: '',
      targetCities: [],
      sendToAll: true,
      scheduledDate: '',
      isHtml: true
    });
    setSelectedDraft(null);
  };

  const targetedRecipients = getTargetedRecipients();

  return (
    <div className="newsletter-manager">
      <Container fluid>
        <div className="newsletter-header">
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="newsletter-title">
                <span className="emoji-visible">📧</span>
                Newsletter Management
              </h1>
              <p className="newsletter-subtitle">
                Create and send newsletters to your customer database
              </p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin')}
                className="back-btn"
              >
                <span className="emoji-visible">⬅️</span>
                Back to Admin
              </Button>
            </Col>
          </Row>
        </div>

        {message && (
          <Alert variant={variant} className="mb-4" dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <Row>
          {/* Newsletter Creation Form */}
          <Col lg={8}>
            <Card className="newsletter-form-card">
              <Card.Header>
                <h3>
                  <span className="emoji-visible">✍️</span>
                  Create Newsletter
                </h3>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <span className="emoji-visible">📝</span>
                          Subject Line *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter newsletter subject..."
                          value={newsletterForm.subject}
                          onChange={(e) => setNewsletterForm({...newsletterForm, subject: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <span className="emoji-visible">📅</span>
                          Schedule (Optional)
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={newsletterForm.scheduledDate}
                          onChange={(e) => setNewsletterForm({...newsletterForm, scheduledDate: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="emoji-visible">📄</span>
                      Newsletter Content *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={12}
                      placeholder="Enter your newsletter content here..."
                      value={newsletterForm.content}
                      onChange={(e) => setNewsletterForm({...newsletterForm, content: e.target.value})}
                      required
                    />
                    <Form.Text className="text-muted">
                      {newsletterForm.isHtml ? "HTML content supported" : "Plain text only"}
                    </Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Send as HTML email"
                          checked={newsletterForm.isHtml}
                          onChange={(e) => setNewsletterForm({...newsletterForm, isHtml: e.target.checked})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="form-actions">
                    <Button variant="outline-secondary" onClick={saveDraft} className="me-2">
                      <span className="emoji-visible">💾</span>
                      Save Draft
                    </Button>
                    <Button variant="info" onClick={handlePreview} className="me-2">
                      <span className="emoji-visible">👁️</span>
                      Review & Send
                    </Button>
                    <Button variant="outline-warning" onClick={resetForm} className="me-2">
                      <span className="emoji-visible">🔄</span>
                      Reset
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={sendNewsletter} 
                      disabled={loading || !newsletterForm.subject || !newsletterForm.content}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <span className="emoji-visible">📤</span>
                          Send Newsletter
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Recipients & Targeting */}
            <Card className="mb-4">
              <Card.Header>
                <h5>
                  <span className="emoji-visible">🎯</span>
                  Target Audience
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="radio"
                    name="targeting"
                    label="Send to all subscribers"
                    checked={newsletterForm.sendToAll}
                    onChange={() => setNewsletterForm({...newsletterForm, sendToAll: true})}
                  />
                  <Form.Check
                    type="radio"
                    name="targeting"
                    label="Target specific cities"
                    checked={!newsletterForm.sendToAll}
                    onChange={() => setNewsletterForm({...newsletterForm, sendToAll: false})}
                  />
                </Form.Group>

                {!newsletterForm.sendToAll && (
                  <div className="city-selection">
                    <Form.Label>Select Cities:</Form.Label>
                    {cities.map(city => (
                      <Form.Check
                        key={city.city}
                        type="checkbox"
                        label={`${city.city} (${city.count} subscribers)`}
                        checked={newsletterForm.targetCities.includes(city.city)}
                        onChange={() => handleCityToggle(city.city)}
                      />
                    ))}
                  </div>
                )}

                <div className="recipient-stats mt-3">
                  <Badge bg="primary">
                    {targetedRecipients.length} recipients targeted
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Filters */}
            <Card className="mb-4">
              <Card.Header>
                <h5>
                  <span className="emoji-visible">🔍</span>
                  Filter Recipients
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by City:</Form.Label>
                  <Form.Select 
                    value={cityFilter} 
                    onChange={(e) => {
                      setCityFilter(e.target.value);
                      fetchRecipients(e.target.value, nameFilter);
                    }}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name to search..."
                    value={nameFilter}
                    onChange={(e) => {
                      setNameFilter(e.target.value);
                      fetchRecipients(cityFilter, e.target.value);
                    }}
                  />
                </Form.Group>

                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setCityFilter('');
                    setNameFilter('');
                    fetchRecipients('', '');
                  }}
                >
                  Clear Filters
                </Button>
              </Card.Body>
            </Card>

            {/* Future SMS Feature (Hidden) */}
            <Card className="mb-4" style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <Card.Header>
                <h5>
                  <span className="emoji-visible">📱</span>
                  SMS Campaign (Coming Soon)
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  label="Also send via SMS"
                  disabled
                />
                <Form.Text className="text-muted">
                  SMS functionality will be available when company SMS service is configured.
                </Form.Text>
              </Card.Body>
            </Card>

            {/* Drafts */}
            <Card>
              <Card.Header>
                <h5>
                  <span className="emoji-visible">📋</span>
                  Saved Drafts
                </h5>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {drafts.length === 0 ? (
                  <p className="text-muted">No saved drafts</p>
                ) : (
                  drafts.map(draft => (
                    <div key={draft.id} className="draft-item mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{draft.name}</strong>
                          <br />
                          <small className="text-muted">
                            {new Date(draft.savedAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            onClick={() => loadDraft(draft)}
                            className="me-1"
                          >
                            Load
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            onClick={() => deleteDraft(draft.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <span className="emoji-visible">�</span>
              Confirm Newsletter Send
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="newsletter-confirmation">
              <Alert variant="warning">
                <strong>⚠️ Review before sending:</strong> This action cannot be undone.
              </Alert>
              
              <div className="confirmation-details">
                <Row className="mb-3">
                  <Col sm={3}><strong>Subject:</strong></Col>
                  <Col sm={9}>{newsletterForm.subject}</Col>
                </Row>
                
                <Row className="mb-3">
                  <Col sm={3}><strong>Recipients:</strong></Col>
                  <Col sm={9}>
                    <Badge bg="primary">{targetedRecipients.length} recipients</Badge>
                    {cityFilter && (
                      <Badge bg="info" className="ms-2">
                        City: {cityFilter}
                      </Badge>
                    )}
                    {nameFilter && (
                      <Badge bg="info" className="ms-2">
                        Name: {nameFilter}
                      </Badge>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}><strong>Content Preview:</strong></Col>
                  <Col sm={9}>
                    <div className="content-preview border p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {newsletterForm.isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: newsletterForm.content.substring(0, 300) + '...' }} />
                      ) : (
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
                          {newsletterForm.content.substring(0, 300)}
                          {newsletterForm.content.length > 300 && '...'}
                        </pre>
                      )}
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}><strong>Recipient List:</strong></Col>
                  <Col sm={9}>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {targetedRecipients.slice(0, 10).map((recipient, index) => (
                        <div key={index} className="small">
                          {recipient.name} - {recipient.email} ({recipient.city})
                        </div>
                      ))}
                      {targetedRecipients.length > 10 && (
                        <div className="small text-muted">
                          ... and {targetedRecipients.length - 10} more recipients
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              <span className="emoji-visible">❌</span>
              Cancel
            </Button>
            <Button variant="success" onClick={sendNewsletter} disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <span className="emoji-visible">📤</span>
                  Confirm & Send Newsletter
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default NewsletterManager;
