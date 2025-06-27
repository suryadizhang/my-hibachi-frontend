import React from 'react';
import { Accordion } from 'react-bootstrap';

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || typeof text !== 'string') return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <span key={index} className="search-highlight">{part}</span>
    ) : part
  );
};

const FAQCategory = ({ eventKey, title, items, searchTerm }) => (
  <Accordion.Item eventKey={eventKey}>
    <Accordion.Header as="h3" className="faq-category-title">
      {title}
    </Accordion.Header>
    <Accordion.Body>
      <Accordion alwaysOpen flush>
        {items.map((faq, i) => (
          <Accordion.Item eventKey={`${eventKey}-${i}`} key={faq.header}>
            <Accordion.Header as="h4">
              {highlightSearchTerm(faq.header, searchTerm)}
            </Accordion.Header>
            <Accordion.Body>
              {typeof faq.body === 'string' 
                ? highlightSearchTerm(faq.body, searchTerm)
                : faq.body
              }
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Accordion.Body>
  </Accordion.Item>
);

export default FAQCategory;