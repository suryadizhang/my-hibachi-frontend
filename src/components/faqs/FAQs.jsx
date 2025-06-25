import React, { Suspense } from 'react';
import { Accordion, Spinner } from 'react-bootstrap';
import FAQCategory from './FAQCategory';
import faqData from './faqData';

const FAQs = () => (
  <div className="p-4 faq-wrapper">
    <h2 className="mb-4 text-center fw-bold menu-silver-garden" tabIndex={0} aria-label="Frequently Asked Questions">
      Frequently Asked Questions
    </h2>
    <Suspense fallback={<div className="text-center"><Spinner animation="border" variant="primary" /></div>}>
      <Accordion alwaysOpen flush>
        {Object.entries(faqData).map(([category, items], idx) => (
          <FAQCategory
            key={category}
            eventKey={idx.toString()}
            title={category}
            items={items}
          />
        ))}
      </Accordion>
    </Suspense>
  </div>
);

export default FAQs;