import { Badge } from 'react-bootstrap';

const faqData = {
  "🍱 Menu & Food": [
    {
      header: "What is on the menu?",
      body: (
        <>
          <strong>🥩 Protein Options (Choose 2):</strong><br />
          • <strong>Chicken</strong>: Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze<br />
          • <strong>Premium Angus Sirloin Steak</strong>: Premium Angus steak cooked to your preferred temperature<br />
          • <strong>Shrimp</strong>: Fresh jumbo shrimp with garlic butter and hibachi spices<br />
          • <strong>Salmon</strong>: Wild-caught Atlantic salmon with teriyaki glaze and sesame seeds<br />
          • <strong>Tofu</strong>: Organic marinated tofu grilled with vegetables - perfect vegetarian option<br /><br />
          
          <strong>🍚 Included with every meal:</strong><br />
          • Hibachi fried rice with egg and vegetables<br />
          • Mixed seasonal vegetables (zucchini, onions, mushrooms)<br />
          • Fresh garden salad with ginger dressing<br />
          • Signature yum yum sauce<br />
          • Traditional ginger dressing<br />
          • House Special Hot Sauce<br /><br />
          
          <strong>⭐ Premium Upgrades:</strong>
          <ul>
            <li><strong>Yakisoba Noodles</strong> (Japanese style lo mein): <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Scallops</strong>: Fresh sea scallops grilled to perfection: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Filet Mignon</strong>: Premium tender beef filet: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Salmon</strong>: Wild-caught Atlantic salmon upgrade: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Lobster Tail</strong>: Fresh lobster tail with garlic butter: <Badge bg="warning" text="dark">+$10</Badge></li>
            <li><strong>3rd Protein</strong>: Add a third protein to your meal: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Extra Fried Rice</strong>: Additional portion of hibachi fried rice: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Extra Vegetables</strong>: Additional mixed seasonal vegetables: <Badge bg="warning" text="dark">+$5</Badge></li>
          </ul>
        </>
      )
    },
    {
      header: "Do you offer vegetarian and vegan options?",
      body: (
        <>
          Yes! We offer excellent vegetarian and vegan options including:
          <ul>
            <li><strong>Tofu</strong>: Organic marinated tofu grilled with vegetables</li>
            <li><strong>Yakisoba Noodles</strong>: Japanese style lo mein (upgrade +$5)</li>
            <li><strong>Extra vegetables</strong>: We supplement with additional mixed seasonal vegetables</li>
          </ul>
          The price per person remains the same for vegetarian guests. All sauces and sides are vegetarian-friendly.
        </>
      )
    },
    {
      header: "Can you accommodate dietary restrictions and food allergies?",
      body: (
        <>
          Yes, we can accommodate most dietary restrictions including vegan, vegetarian, gluten-free, dairy-free, halal, and kosher. Please inform us when booking.<br /><br />
          
          <strong>🚫 We DON'T use:</strong><br />
          • Peanuts<br />
          • Sesame products<br />
          • Dairy products (we use dairy-free liquid butter)<br /><br />
          
          <strong>⚠️ Possible allergens in our food:</strong><br />
          • Eggs (in fried rice)<br />
          • Mushrooms (in mixed vegetables)<br />
          • Gluten (soy sauce, teriyaki sauce)<br />
          • Seafood (shrimp, salmon, scallops, lobster)<br /><br />
          
          <strong>Important:</strong> Please inform us of any food allergies when booking. We use separate cooking utensils when needed.
        </>
      )
    },
    {
      header: "What if I need a third protein or premium upgrades?",
      body: (
        <>
          Each guest selects two proteins from: <strong>Chicken, Premium Angus Steak, Shrimp, Salmon, or Tofu</strong>.<br />
          <strong>Premium Upgrades (extra charge):</strong>
          <ul>
            <li>Yakisoba Noodles: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Scallops: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Filet Mignon: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Salmon: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Lobster Tail: <Badge bg="warning" text="dark">+$10</Badge></li>
            <li>3rd Protein: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Extra Fried Rice: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Extra Vegetables: <Badge bg="warning" text="dark">+$5</Badge></li>
          </ul>
          <span className="text-muted">
            See the Menu section for all available upgrades and details.
          </span>
        </>
      )
    },
    {
      header: "Can I provide my own proteins or food?",
      body: (
        <>
          Due to insurance and safety regulations, we do not cook any outside proteins or food at this time. All ingredients are provided by My Hibachi to ensure quality and safety.
        </>
      )
    },
    {
      header: "How should I send the protein choices list?",
      body: (
        <>
          Each guest can choose 2 proteins. The easiest way is to send an Excel sheet with columns for: Name, First Protein, Second Protein. 
          <br />Alternatively, you can send a text format like: Guest1-Protein1/Protein2, Guest2-Protein1/Protein2, etc.
          <br /><br />
          <strong>Deadline:</strong> Please send the protein list at least 3 days before your party. If not received, we'll default to chicken and steak (our most popular choices).
        </>
      )
    }
  ],
  
  "💰 Pricing & Payments": [
    {
      header: "How much does your service cost?",
      body: (
        <>
          <strong>Base Pricing:</strong>
          <ul>
            <li>Adults: $55 per person</li>
            <li>Children (6-12 years): $30 per person</li>
            <li>Children 5 and under: <span style={{ color: 'green', fontWeight: 'bold' }}>FREE!</span></li>
          </ul>
          <strong>Minimum:</strong> $550 total (equivalent to 10 adults)<br />
          <strong>Includes:</strong> 2 proteins per guest, hibachi fried rice, vegetables, salad, sauces, and unlimited sake!
        </>
      )
    },
    {
      header: "What does the total cost include?",
      body: (
        <>
          <ol>
            <li>
              <strong>Base Cost:</strong> $55 per adult, $30 per child, with a $550 minimum. (The base price includes each guest's choice of two complimentary proteins, plenty of fried rice, vegetables, salad, sauces, and unlimited sake.)
            </li>
            <li>
              <strong>Menu Upgrades:</strong> Filet Mignon (+$5), Lobster Tail (+$10), Scallops (+$5), Yakisoba Noodles (+$5), Salmon (+$5), 3rd Protein (+$5), Extra Fried Rice (+$5), Extra Vegetables (+$5)
            </li>
            <li>
              <strong>Travel Fee:</strong> The first 30 miles are FREE; after that, it's $2 per mile (up to 150 miles maximum).
            </li>
          </ol>
          <span className="text-danger">
            *Gratuity is not included. We suggest a tip of 20-35% of the total cost, paid directly to the chef.
          </span>
        </>
      )
    },
    {
      header: "Can I have more details on kids pricing?",
      body: (
        <>
          <strong>Age Breakdown:</strong>
          <ul>
            <li><strong>5 and under:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>Eats FREE!</span> (1 protein, half portion of rice)</li>
            <li><strong>6-12 years:</strong> $30 per child (2 proteins, full portions)</li>
            <li><strong>13 and older:</strong> $55 adult price (2 proteins, full portions)</li>
          </ul>
        </>
      )
    },
    {
      header: "What about travel fees and service areas?",
      body: (
        <>
          <strong>Travel Policy:</strong>
          <ul>
            <li>First 30 miles: <span style={{ color: 'green', fontWeight: 'bold' }}>FREE!</span></li>
            <li>31-150 miles: $2 per mile</li>
            <li>Beyond 150 miles: Contact us for special arrangements</li>
          </ul>
          We serve many counties in California. For remote areas, we offer travel fee reimbursement based on the number of guests. Contact customer service for details.
        </>
      )
    },
    {
      header: "Do I need to tip the chef? How much?",
      body: (
        <>
          Gratuity goes directly to the chef and is greatly appreciated! We suggest a tip of <strong>20-35% of the total cost</strong>.
          <br />Tips can be paid in cash, Venmo, or Zelle directly to the chef at the end of the party.
        </>
      )
    },
    {
      header: "What payment methods do you accept?",
      body: (
        <>
          <strong>For Deposits:</strong> Credit/debit cards, Venmo, Zelle<br />
          <strong>For Final Payment:</strong> Cash, Venmo, Zelle<br />
          <strong>For Gratuity:</strong> Cash, Venmo, Zelle (paid directly to chef)
          <br /><br />
          All fees are included in the price per person except for chef gratuity, possible travel fee, and optional upgrades.
        </>
      )
    }
  ],
  
  "📅 Booking & Reservations": [
    {
      header: "How do I book a hibachi party?",
      body: (
        <>
          <strong>Easy Booking Options:</strong>
          <ol>
            <li>Click "Book Now" at the top of our website</li>
            <li>Click "Order Now" on the menu page</li>
            <li>Contact our customer service for assistance</li>
          </ol>
          You can also request a free estimate by contacting our customer service team.
        </>
      )
    },
    {
      header: "What's the deposit amount and when is it required?",
      body: (
        <>
          <strong>Deposit Details:</strong>
          <ul>
            <li>Amount: $100 (same for all order sizes)</li>
            <li>When: Required at booking to secure your date</li>
            <li>Deduction: The $100 is deducted from your final bill after the party</li>
          </ul>
          <strong>Why we require a deposit:</strong>
          <ol>
            <li><strong>Reservation Confirmation:</strong> Ensures your preferred date and time are reserved</li>
            <li><strong>Preparation Costs:</strong> Helps cover upfront costs for ingredients and setup</li>
            <li><strong>Commitment Assurance:</strong> Minimizes last-minute cancellations</li>
            <li><strong>Custom Services:</strong> Confirms upgrades or dietary accommodations</li>
          </ol>
        </>
      )
    },
    {
      header: "What if I don't meet the 10-person minimum?",
      body: (
        <>
          Our parties generally start with at least 10 adults or a minimum spend of $550. 
          <br />If you have fewer guests, you can:
          <ul>
            <li>Pay the $550 minimum</li>
            <li>Add premium upgrades to reach the total</li>
            <li>Contact our customer service for a customized plan</li>
          </ul>
        </>
      )
    },
    {
      header: "What time will the chef arrive?",
      body: (
        <>
          The chef will arrive <strong>15-30 minutes before</strong> your reservation time to set up. Setup is quick and easy, typically taking 10-15 minutes.
        </>
      )
    },
    {
      header: "Can I get a receipt or invoice?",
      body: (
        <>
          Yes, absolutely! Contact our customer service team for receipts or invoices. We can include:
          <ul>
            <li>Deposit payment</li>
            <li>Remaining balance</li>
            <li>Gratuity (if requested)</li>
            <li>All itemized charges</li>
          </ul>
        </>
      )
    },
    {
      header: "I haven't received a confirmation email after paying?",
      body: (
        <>
          <strong>If you paid via our website:</strong> You should receive a confirmation email from cs@myhibachichef.com
          <br /><strong>If you used a payment link:</strong> No email is sent, but our customer service team checks payments daily and will reach out to confirm your booking.
          <br /><br />
          If you haven't heard from us within 24 hours, please contact customer service.
        </>
      )
    },
    {
      header: "How do I use a coupon or discount code?",
      body: (
        <>
          <strong>Coupon Guidelines:</strong>
          <ul>
            <li>Must be confirmed with customer service at least 1 day before your event</li>
            <li>Only one coupon per event</li>
            <li>Cannot be applied to online deposit payments</li>
            <li>No coupons accepted for Saturday events</li>
          </ul>
          Contact customer service to validate your coupon code.
        </>
      )
    }
  ],
  
  "🏠 Party Setup & Location": [
    {
      header: "What should I prepare for my hibachi party?",
      body: (
        <>
          <strong>Space Requirements:</strong>
          <ul>
            <li>Clear area for our grill: 68.3" L x 27.5" W x 41.3" H</li>
            <li>Level surface (outdoor patio, deck, or covered area preferred)</li>
            <li>Access to electrical outlet (for grill ignition)</li>
          </ul>
          <strong>You provide:</strong>
          <ul>
            <li>Tables and chairs</li>
            <li>Silverware and chopsticks</li>
            <li>Large dinner plates and salad plates</li>
            <li>Drink cups</li>
            <li>Beverages (we bring unlimited sake!)</li>
            <li>Napkins</li>
          </ul>
        </>
      )
    },
    {
      header: "Do you offer table and chair setup?",
      body: (
        <>
          <span className="text-danger fw-bold">Sorry, we do <u>NOT</u> offer setup service for parties.</span> Please use a local table and chair rental company.
          <br /><br />
          <strong>Recommended rental companies:</strong>
          <ul>
            <li>celebrationsofmarin.com (Bay Area)</li>
          </ul>
          You can find more rental companies by searching online or in the footer section of our website.
        </>
      )
    },
    {
      header: "How should I arrange the seating?",
      body: (
        <>
          <strong>Recommended Setup:</strong>
          <ul>
            <li><strong>For 10 people:</strong> Two 8' rectangular tables in L-shape</li>
            <li><strong>For 12-15 people:</strong> Three 6' rectangular tables in U-shape</li>
            <li><strong>Chef position:</strong> Set up so the chef is in front where everyone can see the cooking show</li>
          </ul>
          This arrangement ensures all guests have a great view of the hibachi performance!
        </>
      )
    },
    {
      header: "Can you cook indoors or in a garage?",
      body: (
        <>
          <strong>Preferred:</strong> Outdoor cooking (backyard, patio, terrace, balcony)
          <br /><strong>Indoor cooking:</strong> Possible with proper conditions:
          <ul>
            <li>High ceilings (at least 10 feet)</li>
            <li>Excellent ventilation</li>
            <li>Advance notification required</li>
            <li>Open garage doors or windows</li>
          </ul>
          Please notify us during booking if you need indoor cooking.
        </>
      )
    },
    {
      header: "Are hibachi parties kid and family friendly?",
      body: (
        <>
          <strong>Absolutely!</strong> Our hibachi parties are perfect for families. Our experienced chefs can:
          <ul>
            <li>Tailor the experience to be more kid-friendly</li>
            <li>Include fun tricks and entertainment for children</li>
            <li>Adjust spice levels for young palates</li>
            <li>Create an educational and entertaining cooking show</li>
          </ul>
          Just let us know you have children when booking, and we'll make sure they have a blast!
        </>
      )
    }
  ],
  
  "🔥 Safety & Policies": [
    {
      header: "Is propane cooking safe in residential areas?",
      body: (
        <>
          <strong>Yes, it's completely safe!</strong> We follow strict safety protocols:
          <ul>
            <li>Use certified propane tanks (AmeriGas)</li>
            <li>Professional-grade Blackstone griddles</li>
            <li>Thorough leak checks before each use</li>
            <li>Maintain safe distances from structures</li>
            <li>Ensure proper ventilation</li>
            <li>Bring portable fire extinguisher to every event</li>
          </ul>
        </>
      )
    },
    {
      header: "What fire safety measures do you take?",
      body: (
        <>
          <strong>Our Safety Standards:</strong>
          <ul>
            <li>All chefs have 5-10 years of experience</li>
            <li>Comprehensive fire safety training for all staff</li>
            <li>Portable fire extinguisher at every event</li>
            <li>Pre-cooking equipment safety checks</li>
            <li>Post-cooking equipment inspections</li>
            <li>Professional-grade, safety-certified equipment only</li>
          </ul>
        </>
      )
    },
    {
      header: "What's your cancellation and weather policy?",
      body: (
        <>
          <strong>Cancellation Policy:</strong>
          <ul>
            <li><strong>48+ hours notice:</strong> Full refund guaranteed</li>
            <li><strong>Less than 48 hours:</strong> Deposit forfeited</li>
            <li><strong>Rescheduling:</strong> Free with 48+ hours notice</li>
            <li><strong>Late rescheduling:</strong> $200 fee applies</li>
          </ul>
          <strong>Weather Policy:</strong>
          <ul>
            <li>If it rains, you must provide a covered cooking area</li>
            <li>Notify us of weather concerns 24+ hours in advance</li>
            <li>We can cook under gazebos, covered patios, or garages</li>
          </ul>
        </>
      )
    },
    {
      header: "Is it safe to pay deposits online?",
      body: (
        <>
          <strong>Absolutely secure!</strong> We use trusted payment platforms:
          <ul>
            <li>Encrypted payment processing</li>
            <li>Secure Venmo and Zelle transactions</li>
            <li>48-hour full refund policy</li>
            <li>Customer service available 11 AM - 10 PM daily</li>
            <li>Established business with excellent reputation</li>
          </ul>
        </>
      )
    }
  ]
};

export default faqData;
