import React, { useState } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";

const tipPercents = [0, 10, 15, 20];

function CreditCardPayment() {
  const [amount, setAmount] = useState(0);
  const [tipType, setTipType] = useState("percent");
  const [tipValue, setTipValue] = useState(0);

  // Processing fee (5%)
  const processingFee = (amount + getTip()) * 0.05;

  function getTip() {
    if (tipType === "percent") {
      return (amount * tipValue) / 100;
    } else {
      return Number(tipValue);
    }
  }

  const total = Number(amount) + getTip() + processingFee;

  return (
    <Card className="p-4 my-4">
      <h2>Credit Card Payment</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Amount to Charge ($)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tip</Form.Label>
          <InputGroup>
            <Form.Select
              value={tipType}
              onChange={(e) => {
                setTipType(e.target.value);
                setTipValue(0);
              }}
            >
              <option value="percent">By %</option>
              <option value="amount">By $</option>
            </Form.Select>
            {tipType === "percent" ? (
              <Form.Select
                value={tipValue}
                onChange={(e) => setTipValue(Number(e.target.value))}
              >
                {tipPercents.map((percent) => (
                  <option value={percent} key={percent}>{percent}%</option>
                ))}
                <option value="custom">Custom</option>
              </Form.Select>
            ) : (
              <Form.Control
                type="number"
                min={0}
                value={tipValue}
                placeholder="Tip amount"
                onChange={(e) => setTipValue(Number(e.target.value))}
              />
            )}
          </InputGroup>
        </Form.Group>
        <div>
          <p>Subtotal: <b>${Number(amount).toFixed(2)}</b></p>
          <p>Tip: <b>${getTip().toFixed(2)}</b></p>
          <p>Processing Fee (5%): <b>${processingFee.toFixed(2)}</b></p>
          <h4>Total: ${total.toFixed(2)}</h4>
        </div>
        <Button variant="primary" disabled>Pay Now (Demo)</Button>
      </Form>
    </Card>
  );
}

export default CreditCardPayment;
