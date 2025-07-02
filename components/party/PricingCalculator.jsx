import React, { memo, useMemo } from 'react';
import { PRICING } from './partyData.js';
import { calcProteinUpcharge } from './partyValidation.js';

const PricingCalculator = memo(({ 
  adults,
  children,
  adultProteinCount,
  childProteinCount,
  adultProteins,
  childProteins,
  adultNoodles,
  childNoodles
}) => {
  const costs = useMemo(() => {
    const adultsCost = adults * PRICING.perAdult;
    const childrenCost = children * PRICING.perChild;
    
    // Extra protein costs (for 3rd protein)
    const adultProteinExtra = adultProteinCount === 3 ? adults * PRICING.extraProteinAdult : 0;
    const childProteinExtra = childProteinCount === 3 ? children * PRICING.extraProteinChild : 0;
    
    // Protein upcharges (premium proteins like lobster, filet mignon)
    const adultProteinUpcharge = calcProteinUpcharge(adultProteins, adults);
    const childProteinUpcharge = calcProteinUpcharge(childProteins, children, true);
    
    // Noodles
    const noodleExtra = (adultNoodles ? adults : 0) * PRICING.noodlePrice + 
                       (childNoodles ? children : 0) * PRICING.noodlePrice;
    
    const total = adultsCost + childrenCost + adultProteinExtra + 
                  childProteinExtra + adultProteinUpcharge + 
                  childProteinUpcharge + noodleExtra;
    
    return {
      adultsCost,
      childrenCost,
      adultProteinExtra,
      childProteinExtra,
      adultProteinUpcharge,
      childProteinUpcharge,
      noodleExtra,
      total
    };
  }, [adults, children, adultProteinCount, childProteinCount, adultProteins, childProteins, adultNoodles, childNoodles]);

  return (
    <div style={{ 
      background: "#fff", 
      padding: "1.5rem", 
      borderRadius: "12px", 
      border: "2px solid #e2e8f0",
      marginBottom: "2rem"
    }}>
      <h4 style={{ color: "#2d3748", marginBottom: "1rem" }}>
        <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>💰</span>
        Cost Breakdown
      </h4>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "1rem" 
      }}>
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Adults:</strong> {adults} × $55 = <span style={{ color: "#059669" }}>${costs.adultsCost}</span>
            </li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Children:</strong> {children} × $25 = <span style={{ color: "#059669" }}>${costs.childrenCost}</span>
            </li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Extra protein (adults):</strong> <span style={{ color: "#d69e2e" }}>${costs.adultProteinExtra}</span>
            </li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Extra protein (children):</strong> <span style={{ color: "#d69e2e" }}>${costs.childProteinExtra}</span>
            </li>
          </ul>
        </div>
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Protein upcharge (adults):</strong> <span style={{ color: "#d69e2e" }}>${costs.adultProteinUpcharge}</span>
            </li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Protein upcharge (children):</strong> <span style={{ color: "#d69e2e" }}>${costs.childProteinUpcharge}</span>
            </li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>Noodles:</strong> <span style={{ color: "#d69e2e" }}>${costs.noodleExtra}</span>
            </li>
            <li style={{ padding: "0.5rem 0", fontSize: "1.2rem", fontWeight: "bold" }}>
              <strong>Total:</strong> <span style={{ color: "#059669" }}>${costs.total}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div style={{ 
        marginTop: "1rem", 
        padding: "1rem", 
        background: "#f0f9ff", 
        borderRadius: "8px",
        fontSize: "0.9rem",
        color: "#0c4a6e"
      }}>
        <strong>Included:</strong> Cold sake, fried rice, fresh vegetables, side salad, signature sauce.<br />
        <strong>Extra:</strong> Noodles ($5 side).
      </div>
    </div>
  );
});

PricingCalculator.displayName = 'PricingCalculator';

export default PricingCalculator;
