import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

const proteins = [
  { name: "Chicken", adultExtra: 0, childExtra: 0 },
  { name: "NY Strip Steak", adultExtra: 0, childExtra: 0 },
  { name: "Filet Mignon", adultExtra: 10, childExtra: 5 },
  { name: "Calamari", adultExtra: 0, childExtra: 0 },
  { name: "Shrimp", adultExtra: 0, childExtra: 0 },
  { name: "Scallops", adultExtra: 5, childExtra: 5 },
  { name: "Lobster Tail", adultExtra: 20, childExtra: 15 },
  { name: "Salmon", adultExtra: 5, childExtra: 5 },
  { name: "Tofu", adultExtra: 0, childExtra: 0 }
];

function PartyGuestProteinForm() {
  const [adults, setAdults] = useState(10);
  const [children, setChildren] = useState(0);
  const [adultProteins, setAdultProteins] = useState([]);
  const [childProteins, setChildProteins] = useState([]);
  const [adultProteinCount, setAdultProteinCount] = useState(2);
  const [childProteinCount, setChildProteinCount] = useState(2);

  const perAdult = 55;
  const perChild = 25;

  function handleProteinChange(selected, setSelected, count) {
    return (e) => {
      const { value, checked } = e.target;
      let updated = checked
        ? [...selected, value]
        : selected.filter((item) => item !== value);

      // Allow only up to count, else ignore
      if (updated.length > count) return;
      setSelected(updated);
    };
  }

  // Adult proteins: if choose 3, extra $10/adult/child
  const adultProteinExtra =
    adultProteinCount === 3 ? adults * 10 : 0;
  const childProteinExtra =
    childProteinCount === 3 ? children * 10 : 0;

  // Add protein upcharge
  function calcProteinUpcharge(selected, group, child = false) {
    let total = 0;
    for (const protein of selected) {
      const proteinInfo = proteins.find((p) => p.name === protein);
      if (!proteinInfo) continue;
      total += (child ? proteinInfo.childExtra : proteinInfo.adultExtra) * group;
    }
    return total;
  }

  // Noodles upcharge
  const [adultNoodles, setAdultNoodles] = useState(false);
  const [childNoodles, setChildNoodles] = useState(false);

  const noodleExtra =
    (adultNoodles ? adults : 0) * 5 + (childNoodles ? children : 0) * 5;

  // Total cost
  const total =
    adults * perAdult +
    children * perChild +
    adultProteinExtra +
    childProteinExtra +
    calcProteinUpcharge(adultProteins, adults) +
    calcProteinUpcharge(childProteins, children, true) +
    noodleExtra;

  return (
    <Card className="p-4 my-4">
      <h2>Party Guests & Proteins</h2>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Number of Adults (10-100)</Form.Label>
              <Form.Control
                type="number"
                min={10}
                max={100}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Number of Children (12 & under)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <h5>Adults Menu</h5>
        <Form.Group>
          <Form.Label>How many proteins? (2 included, 3 +$10/adult)</Form.Label>
          <Form.Select
            value={adultProteinCount}
            onChange={(e) => {
              setAdultProteinCount(Number(e.target.value));
              setAdultProteins([]);
            }}
          >
            <option value={2}>2 Proteins (included)</option>
            <option value={3}>3 Proteins (+$10/adult)</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Choose Proteins</Form.Label>
          {proteins.map((protein) => (
            <Form.Check
              type="checkbox"
              key={protein.name}
              label={`${protein.name}${protein.adultExtra ? ` (+$${protein.adultExtra})` : ""}`}
              value={protein.name}
              checked={adultProteins.includes(protein.name)}
              disabled={
                !adultProteins.includes(protein.name) &&
                adultProteins.length >= adultProteinCount
              }
              onChange={handleProteinChange(adultProteins, setAdultProteins, adultProteinCount)}
            />
          ))}
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Add Noodles ($5 per adult)"
          checked={adultNoodles}
          onChange={(e) => setAdultNoodles(e.target.checked)}
        />

        <hr />
        <h5>Child Menu</h5>
        <Form.Group>
          <Form.Label>How many proteins? (2 included, 3 +$10/child)</Form.Label>
          <Form.Select
            value={childProteinCount}
            onChange={(e) => {
              setChildProteinCount(Number(e.target.value));
              setChildProteins([]);
            }}
          >
            <option value={2}>2 Proteins (included)</option>
            <option value={3}>3 Proteins (+$10/child)</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Choose Proteins</Form.Label>
          {proteins.map((protein) => (
            <Form.Check
              type="checkbox"
              key={protein.name + "child"}
              label={`${protein.name}${protein.childExtra ? ` (+$${protein.childExtra})` : ""}`}
              value={protein.name}
              checked={childProteins.includes(protein.name)}
              disabled={
                !childProteins.includes(protein.name) &&
                childProteins.length >= childProteinCount
              }
              onChange={handleProteinChange(childProteins, setChildProteins, childProteinCount)}
            />
          ))}
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Add Noodles ($5 per child)"
          checked={childNoodles}
          onChange={(e) => setChildNoodles(e.target.checked)}
        />

        <hr />
        <div>
          <b>Breakdown:</b>
          <ul>
            <li>Adults: {adults} × $55 = ${adults * perAdult}</li>
            <li>Children: {children} × $25 = ${children * perChild}</li>
            <li>Extra protein charge (adults): ${adultProteinExtra}</li>
            <li>Extra protein charge (children): ${childProteinExtra}</li>
            <li>Protein upcharge (adults): ${calcProteinUpcharge(adultProteins, adults)}</li>
            <li>Protein upcharge (children): ${calcProteinUpcharge(childProteins, children, true)}</li>
            <li>Noodles: ${noodleExtra}</li>
          </ul>
          <h4>Total: ${total}</h4>
          <small>
            [Included] Cold sake, fried rice, fresh vegetables, side salad, signature sauce.<br />
            [Extra] Noodles ($5 side).
          </small>
        </div>
        <Button variant="primary" disabled>
          Submit (Demo)
        </Button>
      </Form>
    </Card>
  );
}

export default PartyGuestProteinForm;
