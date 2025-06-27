import { Badge } from 'react-bootstrap';

const faqData = {
  "🍱 Menu & Upgrades": [
    {
      header: "What is on the menu?",
      body: (
        <>
          <strong>🥩 Protein Options (Choose 2):</strong><br />
          • <strong>Chicken</strong>: Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze<br />
          • <strong>Premium Angus Sirloin Steak</strong>: Premium USDA choice beef cooked to your preferred temperature<br />
          • <strong>Shrimp</strong>: Fresh jumbo shrimp with garlic butter and hibachi spices<br />
          • <strong>Salmon</strong>: Wild-caught Atlantic salmon with teriyaki glaze and sesame seeds<br />
          • <strong>Tofu</strong>: Organic marinated tofu grilled with vegetables - perfect vegetarian option<br /><br />
          
          <strong>🍚 Included with every meal:</strong><br />
          • Hibachi fried rice with egg and vegetables<br />
          • Mixed seasonal vegetables (zucchini, onions, mushrooms)<br />
          • Fresh garden salad with ginger dressing<br />
          • Signature yum yum sauce<br />
          • Traditional ginger dressing<br />
          • Homemade teriyaki sauce<br /><br />
          
          <strong>⭐ Premium Upgrades:</strong>
          <ul>
            <li><strong>Yakisoba Noodles</strong> (Japanese style lo mein): <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Scallops</strong>: Fresh sea scallops grilled to perfection: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Filet Mignon</strong>: Premium tender beef filet: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li><strong>Lobster Tail</strong>: Fresh lobster tail with garlic butter: <Badge bg="warning" text="dark">+$10</Badge></li>
            <li><strong>3rd Protein</strong>: Add a third protein to your meal: <Badge bg="warning" text="dark">+$10</Badge></li>
          </ul>
        </>
      )
    },
    {
      header: "Do you offer vegetarian options?",
      body: (
        <>
          Yes, we offer vegetarian and vegan options. These include tofu, stir-fried noodles (upgrade), and the vegetables included in the main menu.
        </>
      )
    },
    {
      header: "What does the total cost include?",
      body: (
        <>
          <ol>
            <li>
              <strong>Base Cost:</strong> $55 per adult, $30 per child, with a $550 minimum. (The base price includes each guest’s choice of two complimentary proteins, plenty of fried rice, vegetables, salad, sauces, and unlimited sake.)
            </li>
            <li>
              <strong>Menu Upgrades:</strong> Filet Mignon (+$5), Lobster Tail (+$10), Scallops (+$5), Yakisoba Noodles - Japanese style lo mein (+$5), 3rd Protein (+$10)
            </li>
            <li>
              <strong>Travel Fee:</strong> The first 30 miles are free; after that, it’s $2 per mile.
            </li>
          </ol>
          <span className="text-danger">
            *Tips are not included. We suggest giving a total tip of 20-35% of the total cost, paid directly to the chef.
          </span>
        </>
      )
    },
    {
      header: "Do you offer upgrades?",
      body: (
        <>
          Yes! All guests get 2 protein choices and all the sides, but we also offer upgrades: Filet Mignon (+$5), Lobster Tail (+$10), Scallops (+$5), Stir-fried Noodles (+$5), 3rd Protein (+$10)
        </>
      )
    },
    {
      header: "Can I have more details on kids prices?",
      body: (
        <>
          The kids price is for ages <strong>6-12 years old</strong>. 13 and older is adult price.<br />
          <span style={{ color: 'red', fontWeight: 'bold' }}>Age 5 and under eats free!</span><br />
          Only age 5 and under get 1 protein and half portion of rice.
        </>
      )
    },
    {
      header: "Can you accommodate dietary restrictions?",
      body: (
        <>
          Yes, we can accommodate most dietary restrictions upon request, including vegan, vegetarian, gluten-free, dairy-free, halal, and kosher. Please let your reservation manager know your needs before the party.
        </>
      )
    },
    {
      header: "What about food allergies and allergens?",
      body: (
        <>
          <strong>🚫 We DON'T use:</strong><br />
          • Peanuts<br />
          • Sesame products<br />
          • Dairy products (we use dairy-free liquid butter)<br /><br />
          
          <strong>⚠️ Possible allergens in our food:</strong><br />
          • Eggs (in fried rice)<br />
          • Mushrooms (in mixed vegetables)<br />
          • Gluten (soy sauce, teriyaki sauce)<br />
          • Seafood (shrimp, salmon, scallops, lobster)<br /><br />
          
          <strong>Important:</strong> Please inform us of any food allergies when booking. We can accommodate most dietary restrictions and use separate cooking utensils when needed.
        </>
      )
    },
    {
      header: "Do you cook indoors?",
      body: (
        <>
          Our experience is best outside in backyards, terraces, or balconies. We can cook indoors if notified ahead of time and there are high ceilings and plenty of ventilation.
        </>
      )
    },
    {
      header: "What if I need a third protein or more?",
      body: (
        <>
          Each guest selects two proteins from: <strong>Chicken, NY Strip Steak, Shrimp, Salmon, or Tofu</strong>.<br />
          <strong>Menu Upgrades (extra charge):</strong>
          <ul>
            <li>Stir-fried Noodles: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Scallops: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Filet Mignon: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Lobster Tail: <Badge bg="warning" text="dark">+$10</Badge></li>
            <li>3rd Protein (any): <Badge bg="warning" text="dark">+$10</Badge></li>
          </ul>
          <span className="text-muted">
            See the Menu section for all available upgrades and details.
          </span>
        </>
      )
    },
    {
      header: "What’s the deposit for when booking on your site?",
      body: (
        <>
          We require a $100 deposit payment at booking,  After your party, the chef will deduct $100 from your final bill.
        </>
      )
    },
    {
      header: "Do you offer table and chair setup?",
      body: (
        <>
          <span className="text-danger fw-bold">Sorry, we do <u>NOT</u> offer setup service for the parties.</span> Please use a local table and chair rental company.<br />
          Here’s a list of highly-rated rental companies (not affiliated with us):<br />
          <ul>
            <li>celebrationsofmarin.com (Bay Area)</li>
          </ul>
          You can find their websites in the footer section of our website or by searching their names on Google.
        </>
      )
    },
    {
      header: "How do I setup tables & chairs?",
      body: (
        <>
          We recommend setting up so the chef is up front where everyone can see. Two 8’ rectangular tables in L shape can seat about 10 people. Three 6’ rectangular tables in U shape can seat 12-15 people.
        </>
      )
    },
    {
      header: "How do I use a coupon?",
      body: (
        <>
          If you have a coupon code, you must confirm it with customer service at least the day before your event. Only one coupon can be used per event and cannot be applied to online deposit payments. (Saturday  No coupon accepted.)
        </>
      )
    },
    {
      header: "What time will the chef arrive?",
      body: (
        <>
          The chef will try to arrive 15-30 minutes prior to the reservation time. Setup is quick and easy.
        </>
      )
    },
    {
      header: "Do I need to tip the chef?",
      body: (
        <>
          Gratuity goes directly to the chef and is greatly appreciated! We suggest a tip of 20-35% of the total cost.
        </>
      )
    },
    {
      header: "Can you tell more about fees?",
      body: (
        <>
          All fees are included in the price per person except for chef gratuity, possible travel fee, and optional upgrades. We accept zelle, venmo and cash after the party. 
        </>
      )
    },
    {
      header: "What if someone does not eat meat?",
      body: (
        <>
          We can provide tofu for vegetarian and vegan needs. The price per person does not change. We will supplement with extra veggies.
        </>
      )
    },
    {
      header: "What should I prepare for my party?",
      body: (
        <>
          Please arrange a clear area for our grill (68.3&quot; L x 27.5&quot; W x 41.3&quot; H) and set up your tables, chairs, silverware, large plates, salad plates, drink cups, and any beverages you want besides sake (which we bring!).
        </>
      )
    },
    {
      header: "Are these parties kid friendly?",
      body: (
        <>
          Yes! Our parties are fun for the whole family. Our chefs can tailor the experience to be even more kid and family friendly. Just let us know after booking.
        </>
      )
    },
    {
      header: "Can the balance payment be made in cash? Can I pay in advance?",
      body: (
        <>
          Yes, the remaining balance can be paid in cash after the party. You can also pay in advance via via zelle or venmo.
        </>
      )
    },
    {
      header: "What about travel fee reimbursement for remote areas?",
      body: (
        <>
          We serve many counties in California. If your location is far, we offer travel fee reimbursement, which varies based on the number of guests. Contact our customer service for more details.
        </>
      )
    },
    {
      header: "How should I send the protein choices list?",
      body: (
        <>
          Each guest can choose 2 proteins. The easiest way is to send an Excel sheet with columns for name, first protein, and second protein. Alternatively, you can send a text format like: guest1-protein1/protein2.
        </>
      )
    },
    {
      header: "Can the party be held in a garage or indoors?",
      body: (
        <>
          We usually host hibachi parties outdoors, but indoor events are possible with proper ventilation if necessary.
        </>
      )
    },
    {
      header: "What if the number of guests is less than 10?",
      body: (
        <>
          Our parties generally start with at least 10 adults or a minimum spend of $550. If you don’t meet this standard, you can select proteins to reach the total. Contact our customer service for a customized plan.
        </>
      )
    },
    {
      header: "Can I get a receipt or invoice for the deposit and the remaining balance?",
      body: (
        <>
          Yes, absolutely! If you need a receipt or invoice, please contact our customer service team. We can include all payments, such as the deposit, remaining balance, and gratuity, in the receipt or invoice for your convenience.
        </>
      )
    },
    {
      header: "I’m worried about the safety of paying the deposit. What should I do?",
      body: (
        <>
          We use trusted payment platforms like venmo and zelle, ensuring all transactions are encrypted and fully protected. Our cancellation policy offers a full refund if you cancel at least 48 hours before the event. Our customer service team is available from 11:00 AM to 10:00 PM every day.
        </>
      )
    },
    {
      header: "Is the deposit amount the same for all orders?",
      body: (
        <>
          Yes, regardless of your order size, we only require a $100 deposit. 
        </>
      )
    },
    {
      header: "Why is a deposit required?",
      body: (
        <>
          <ol>
            <li><strong>Reservation Confirmation:</strong> The deposit ensures your preferred date and time are reserved for you.</li>
            <li><strong>Preparation Costs:</strong> The deposit helps us cover upfront costs for ingredients and setup.</li>
            <li><strong>Commitment Assurance:</strong> The deposit helps minimize last-minute cancellations.</li>
            <li><strong>Easy Balance Management:</strong> The deposit is deducted from your total cost.</li>
            <li><strong>Custom Services:</strong> The deposit helps us confirm upgrades or dietary accommodations.</li>
          </ol>
          By paying the deposit, you help us provide the best possible experience for your event. Thank you!
        </>
      )
    },
    {
      header: "Is it safe to use propane for cooking in residential areas?",
      body: (
        <>
          Yes, it is safe to use propane for cooking when proper precautions are followed. Our propane tanks are certified and used in accordance with all safety guidelines.
        </>
      )
    },
    {
      header: "What precautions are in place to prevent fire hazards?",
      body: (
        <>
          Our chefs follow strict safety protocols, including leak checks, safe distances, proper ventilation, and bringing a portable fire extinguisher to every event.
        </>
      )
    },
    {
      header: "How does My Hibachi ensure its cooking equipment is safe to use?",
      body: (
        <>
          We use Blackstone griddles and AmeriGas propane tanks, which are well-known for safety and reliability. Our chefs perform thorough safety checks before and after each use.
        </>
      )
    },
    {
      header: "What steps does My Hibachi take to ensure fire safety during cooking?",
      body: (
        <>
          All of our chefs have 5-10 years of experience and undergo comprehensive fire safety training. Every chef brings a portable fire extinguisher to ensure maximum safety.
        </>
      )
    },
    {
      header: "When is the deadline to confirm the party menu (protein list)?",
      body: (
        <>
          The deadline is 3 days before the party. If not received, we’ll default to chicken and steak, our most popular choices.
        </>
      )
    },
    {
      header: "What's your cancellation & weather policy?",
      body: (
        <>
          We offer a 48-hour full refund guarantee. Cancel at least 48 hours before your event for a full refund. Rescheduling is free with 48-hour notice; after that, a $200 rescheduling fee applies.<br />
          <strong>Weather Policy:</strong> If it rains, the customer must provide a covered area for the chef to cook under. Please notify us of any changes at least 24 hours in advance.
        </>
      )
    }
  ],
  "🛒 Booking & Payments": [
    {
      header: "How do I book?",
      body: (
        <>
         Click Book now on top of page or click order now on menu page.
        </>
      )
    },
    {
      header: "Can I get an estimate?",
      body: (
        <>
          Yes!  you can contact our customer service for free estimate
        </>
      )
    },
    {
      header: "How much does your service cost?",
      body: (
        <>
          Our service has a base price of $55 per adult, $30 per child, with a $550 minimum spend.
        </>
      )
    },
    {
      header: "Can I provide my own proteins?",
      body: (
        <>
          Due to insurance and safety issue, we do not cook any outside protein or food at this time.
        </>
      )
    },
    {
      header: "What if the number of guests is less than 10?",
      body: (
        <>
          Our parties generally start with at least 10 adults or a minimum spend of $550. If you don’t meet this standard, you can select proteins to reach the total. Contact our customer service for a customized plan.
        </>
      )
    },
    {
      header: "Can I get a receipt or invoice for the deposit and the remaining balance?",
      body: (
        <>
          Yes, absolutely! If you need a receipt or invoice, please contact our customer service team. We can include all payments, such as the deposit, remaining balance, and gratuity, in the receipt or invoice for your convenience.
        </>
      )
    },
    {
      header: "I haven’t received a confirmation email after paying the deposit?",
      body: (
        <>
          If you paid via our website, you should receive a confirmation email from contact@myhibachi.com. If you used a payment link provided by our team, there will be no email, but don’t worry—our customer service team checks payments daily and will reach out to confirm.
        </>
      )
    },
    {
      header: "What about travel fee reimbursement for remote areas?",
      body: (
        <>
          We serve many counties in California. If your location is far, we offer travel fee reimbursement, which varies based on the number of guests. Contact our customer service for more details.
        </>
      )
    },
    {
      header: "How do I pay the tip? When should it be paid?",
      body: (
        <>
          Tips are typically paid directly to the chef at the end of the party, either in cash, venmo or zelle.
        </>
      )
    },
    {
      header: "What’s the deposit for when booking on your site?",
      body: (
        <>
          We require a $100 deposit payment at booking,  After your party, the chef will deduct $100 from your final bill.
        </>
      )
    },
    {
      header: "Do you offer table and chair setup?",
      body: (
        <>
          <span className="text-danger fw-bold">Sorry, we do <u>NOT</u> offer setup service for the parties.</span> Please use a local table and chair rental company.<br />
          Here’s a list of highly-rated rental companies (not affiliated with us):<br />
          <ul>
            <li>celebrationsofmarin.com (Bay Area)</li>
          </ul>
          You can find their websites in the footer section of our website or by searching their names on Google.
        </>
      )
    },
    {
      header: "What if I need a third protein or more?",
      body: (
        <>
          Each guest selects two proteins from: <strong>Chicken, NY Strip Steak, Shrimp, Salmon, or Tofu</strong>.<br />
          <strong>Menu Upgrades (extra charge):</strong>
          <ul>
            <li>Stir-fried Noodles: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Scallops: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Filet Mignon: <Badge bg="warning" text="dark">+$5</Badge></li>
            <li>Lobster Tail: <Badge bg="warning" text="dark">+$10</Badge></li>
            <li>3rd Protein (any): <Badge bg="warning" text="dark">+$10</Badge></li>
          </ul>
          <span className="text-muted">
            See the Menu section for all available upgrades and details.
          </span>
        </>
      )
    },
    {
      header: "How do I use a coupon?",
      body: (
        <>
          If you have a coupon code, you must confirm it with customer service at least the day before your event. Only one coupon can be used per event and cannot be applied to online deposit payments. (Saturday  No coupon accepted.)
        </>
      )
    },
    {
      header: "What time will the chef arrive?",
      body: (
        <>
          The chef will try to arrive 15-30 minutes prior to the reservation time. Setup is quick and easy.
        </>
      )
    },
    {
      header: "Do I need to tip the chef?",
      body: (
        <>
          Gratuity goes directly to the chef and is greatly appreciated! We suggest a tip of 20-35% of the total cost.
        </>
      )
    },
    {
      header: "Can you tell more about fees?",
      body: (
        <>
          All fees are included in the price per person except for chef gratuity, possible travel fee, and optional upgrades. We accept zelle, venmo and cash after the party. 
        </>
      )
    },
    {
      header: "What if someone does not eat meat?",
      body: (
        <>
          We can provide tofu for vegetarian and vegan needs. The price per person does not change. We will supplement with extra veggies.
        </>
      )
    },
    {
      header: "What should I prepare for my party?",
      body: (
        <>
          Please arrange a clear area for our grill (68.3&quot; L x 27.5&quot; W x 41.3&quot; H) and set up your tables, chairs, silverware, large plates, salad plates, drink cups, and any beverages you want besides sake (which we bring!).
        </>
      )
    },
    {
      header: "Are these parties kid friendly?",
      body: (
        <>
          Yes! Our parties are fun for the whole family. Our chefs can tailor the experience to be even more kid and family friendly. Just let us know after booking.
        </>
      )
    },
    {
      header: "Can the balance payment be made in cash? Can I pay in advance?",
      body: (
        <>
          Yes, the remaining balance can be paid in cash after the party. You can also pay in advance via via zelle or venmo.
        </>
      )
    },
    {
      header: "What about travel fee reimbursement for remote areas?",
      body: (
        <>
          We serve many counties in California. If your location is far, we offer travel fee reimbursement, which varies based on the number of guests. Contact our customer service for more details.
        </>
      )
    },
    {
      header: "How should I send the protein choices list?",
      body: (
        <>
          Each guest can choose 2 proteins. The easiest way is to send an Excel sheet with columns for name, first protein, and second protein. Alternatively, you can send a text format like: guest1-protein1/protein2.
        </>
      )
    },
    {
      header: "Can the party be held in a garage or indoors?",
      body: (
        <>
          We usually host hibachi parties outdoors, but indoor events are possible with proper ventilation if necessary.
        </>
      )
    },
    {
      header: "What if the number of guests is less than 10?",
      body: (
        <>
          Our parties generally start with at least 10 adults or a minimum spend of $550. If you don’t meet this standard, you can select proteins to reach the total. Contact our customer service for a customized plan.
        </>
      )
    },
    {
      header: "Can I get a receipt or invoice for the deposit and the remaining balance?",
      body: (
        <>
          Yes, absolutely! If you need a receipt or invoice, please contact our customer service team. We can include all payments, such as the deposit, remaining balance, and gratuity, in the receipt or invoice for your convenience.
        </>
      )
    },
    {
      header: "I haven’t received a confirmation email after paying the deposit?",
      body: (
        <>
          If you paid via our website, you should receive a confirmation email from contact@myhibachi.com. If you used a payment link provided by our team, there will be no email, but don’t worry—our customer service team checks payments daily and will reach out to confirm.
        </>
      )
    },
    {
      header: "What about travel fee reimbursement for remote areas?",
      body: (
        <>
          We serve many counties in California. If your location is far, we offer travel fee reimbursement, which varies based on the number of guests. Contact our customer service for more details.
        </>
      )
    },
    {
      header: "How do I pay the tip? When should it be paid?",
      body: (
        <>
          Tips are typically paid directly to the chef at the end of the party, either in cash, venmo or zelle.
        </>
      )
    },
    {
      header: "What’s the deposit for when booking on your site?",
      body: (
        <>
          We require a $100 deposit payment at booking,  After your party, the chef will deduct $100 from your final bill.
        </>
      )
    },
    {
      header: "Do you offer table and chair setup?",
      body: (
        <>
          <span className="text-danger fw-bold">Sorry, we do <u>NOT</u> offer setup service for the parties.</span> Please use a local table and chair rental company.<br />
          Here’s a list of highly-rated rental companies (not affiliated with us):<br />
          <ul>
            <li>celebrationsofmarin.com (Bay Area)</li>
          </ul>
          You can find their websites in the footer section of our website or by searching their names on Google.
        </>
      )
    }
  ]
};

export default faqData;