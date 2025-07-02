import React, { memo } from 'react';
import { Form } from 'react-bootstrap';

const ProteinCard = memo(({ 
  protein, 
  isSelected, 
  isDisabled, 
  onChange, 
  suffix = "",
  isChild = false 
}) => {
  const extraCost = isChild ? protein.childExtra : protein.adultExtra;
  const label = `${protein.name}${extraCost ? ` (+$${extraCost})` : ""}`;
  
  return (
    <Form.Check
      type="checkbox"
      label={label}
      value={protein.name}
      checked={isSelected}
      disabled={isDisabled}
      onChange={onChange}
      style={{
        padding: "0.5rem",
        background: isSelected ? "#e6fffa" : "white",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1
      }}
    />
  );
});

ProteinCard.displayName = 'ProteinCard';

export default ProteinCard;
