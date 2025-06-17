import React from 'react';
import { Accordion } from 'react-bootstrap';

const FAQs = () => (
  <div className="p-4">
    <h2>Frequently Asked Questions</h2>
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>What areas do you serve?</Accordion.Header>
        <Accordion.Body>We serve San Jose, San Francisco, and Sacramento.</Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Do you offer vegetarian options?</Accordion.Header>
        <Accordion.Body>Yes, we do offer vegetarian and vegan options.</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </div>
);

export default FAQs;
