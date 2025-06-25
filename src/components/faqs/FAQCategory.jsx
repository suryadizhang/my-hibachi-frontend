import React from 'react';
import { Accordion } from 'react-bootstrap';

const FAQCategory = ({ eventKey, title, items }) => (
  <Accordion.Item eventKey={eventKey}>
    <Accordion.Header as="h3" className="faq-category-title">{title}</Accordion.Header>
    <Accordion.Body>
      <Accordion alwaysOpen flush>
        {items.map((faq, i) => (
          <Accordion.Item eventKey={`${eventKey}-${i}`} key={faq.header}>
            <Accordion.Header as="h4">{faq.header}</Accordion.Header>
            <Accordion.Body>{faq.body}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Accordion.Body>
  </Accordion.Item>
);

export default FAQCategory;