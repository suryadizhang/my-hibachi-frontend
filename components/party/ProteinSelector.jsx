import React, { memo, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import ProteinCard from './ProteinCard.jsx';
import { proteins } from './partyData.js';
import { createProteinChangeHandler } from './partyValidation.js';

const ProteinSelector = memo(({ 
  guestType, // 'adult' or 'child'
  proteinCount,
  selectedProteins,
  onProteinCountChange,
  onProteinSelectionChange,
  noodlesSelected,
  onNoodleChange,
  guestCount
}) => {
  const isChild = guestType === 'child';
  const sectionStyle = {
    background: isChild ? "#f0fff4" : "#f8fafc",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    border: isChild ? "1px solid #c6f6d5" : "1px solid #e2e8f0"
  };

  const handleProteinChange = useCallback(
    createProteinChangeHandler(selectedProteins, onProteinSelectionChange, proteinCount),
    [selectedProteins, onProteinSelectionChange, proteinCount]
  );

  const emoji = isChild ? "🧒" : "🥩";
  const title = isChild ? "Child Protein Selection" : "Adult Protein Selection";
  const guestLabel = isChild ? "Child" : "Adult";

  return (
    <div style={sectionStyle}>
      <h4 style={{ color: "#2d3748", marginBottom: "1rem" }}>
        <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>{emoji}</span>
        {title}
      </h4>
      
      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
          Number of Proteins per {guestLabel}
        </Form.Label>
        <Form.Select
          value={proteinCount}
          onChange={(e) => onProteinCountChange(Number(e.target.value))}
          style={{
            borderRadius: "8px",
            border: "2px solid #e2e8f0",
            padding: "0.75rem",
            maxWidth: "300px"
          }}
        >
          <option value={2}>2 Proteins (included)</option>
          <option value={3}>3 Proteins (+$10/{guestLabel.toLowerCase()})</option>
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
          Choose {guestLabel} Proteins ({selectedProteins.length}/{proteinCount} selected)
        </Form.Label>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "0.5rem",
          marginTop: "0.5rem"
        }}>
          {proteins.map((protein) => (
            <ProteinCard
              key={`${protein.name}_${guestType}`}
              protein={protein}
              isSelected={selectedProteins.includes(protein.name)}
              isDisabled={
                !selectedProteins.includes(protein.name) &&
                selectedProteins.length >= proteinCount
              }
              onChange={handleProteinChange}
              isChild={isChild}
            />
          ))}
        </div>
      </Form.Group>
      
      <Form.Check
        type="checkbox"
        label={`Add Noodles ($5 per ${guestLabel.toLowerCase()})`}
        checked={noodlesSelected}
        onChange={(e) => onNoodleChange(e.target.checked)}
        style={{
          padding: "0.5rem",
          background: "#fff",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          marginTop: "1rem"
        }}
      />
    </div>
  );
});

ProteinSelector.displayName = 'ProteinSelector';

export default ProteinSelector;
