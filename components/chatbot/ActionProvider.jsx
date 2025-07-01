import { setMemory, addHistory } from '../../store';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, dispatch, memory) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.dispatch = dispatch;
    this.memory = memory;
  }

  handleMenu = () => {
    const message = this.createChatBotMessage(
      <>
        <img src="/src/assets/hero_pic.png" alt="Hibachi Menu" style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ backgroundColor: '#d4edda', padding: '8px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.9em' }}>
          🌟 <strong>Quality Ingredients • Reasonable Prices • Excellence is Our Priority</strong> 🌟
        </div>
        Our premium menu includes farm-fresh Chicken, USDA Choice NY Strip Steak, fresh Gulf Shrimp, wild-caught Salmon, and organic Tofu. Every meal comes with quality hibachi fried rice, fresh mixed vegetables, garden salad, and our signature house-made sauces. 
        <br />Premium upgrades: Authentic Yakisoba Noodles, fresh Sea Scallops, premium Filet Mignon (+$5), Maine Lobster Tail, 3rd Protein (+$10).
        <br /><br />
        <button 
          onClick={() => window.location.href = '/menu'}
          style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#FFD700',
            color: '#000',
            border: '2px solid #000',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#000';
            e.target.style.color = '#FFD700';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#FFD700';
            e.target.style.color = '#000';
          }}
        >
          📋 View Full Menu
        </button>
      </>
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      lastIntent: "menu"
    }));
    this.dispatch(setMemory({ lastIntent: "menu", lastTopic: "menu" }));
    this.dispatch(addHistory({ intent: "menu", timestamp: Date.now() }));
  };

  handlePricing = () => {
    let contextMsg = "";
    if (this.memory?.lastTopic === "menu") {
      contextMsg = "For the premium quality menu you just asked about: ";
    }
    const message = this.createChatBotMessage(
      `${contextMsg}🏆 Exceptional Value Pricing: $55 per adult, $30 per child (ages 6–12), FREE for 5 and under. $550 minimum per party. Premium quality ingredients at reasonable prices - because excellence shouldn't break the bank! Upgrades and travel fees may apply. See the Menu page for complete value details.`
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      lastIntent: "pricing"
    }));
    this.dispatch(setMemory({ lastIntent: "pricing", lastTopic: "pricing" }));
    this.dispatch(addHistory({ intent: "pricing", timestamp: Date.now() }));
  };

  handleBooking = () => {
    // Navigate to booking page
    window.location.href = '/BookUs';
    
    const message = this.createChatBotMessage(
      "Redirecting you to our booking page where you can select your date, time, and preferences! 📅"
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "booking" }));
  };

  handleDiet = () => {
    const message = this.createChatBotMessage(
      "Yes, we offer vegetarian, vegan, gluten-free, dairy-free, halal, and kosher options. Please let us know your dietary needs when booking."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "diet" }));
  };

  handleDuration = () => {
    const message = this.createChatBotMessage(
      "A typical hibachi event lasts about 2 hours depending on your party size, including setup, cooking show, and dining."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "duration" }));
  };

  handleSetup = () => {
    const message = this.createChatBotMessage(
      "You should set up utensils, dinner plates, salad plates, drinks, tables, and chairs. We bring the chef, food, entertainment, and fun! We do NOT provide party setup or furniture."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "setup" }));
  };

  handleLocation = () => {
    const message = this.createChatBotMessage(
      "We're based in Fremont, California 94539. We serve Northern California, Bay Area, Greater Sacramento and surrounding regions. Travel is FREE for the first 30 miles from our Fremont location, then $2 per mile after that."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "location" }));
  };

  handleEvents = () => {
    const message = this.createChatBotMessage(
      "🎉 We cater for all special occasions including: birthdays, bachelor/bachelorette parties, family reunions, weddings, proposals, corporate events, anniversaries, holiday parties, graduations, and more. Kids are always welcome! Every event becomes unforgettable with our hibachi experience."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "events" }));
  };

  handleTipping = () => {
    const message = this.createChatBotMessage(
      "Tips are not included in the base price. We recommend tipping your chef at the end of the event. You can pay cash or ask for other options."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "tipping" }));
  };

  handleWeather = () => {
    const message = this.createChatBotMessage(
      "🌧️ For rainy weather: YOU must provide a covered cooking area (gazebo, covered patio, garage with ventilation). Please notify us 24+ hours in advance if weather concerns arise. We don't bring portable exhaust fans - proper ventilation is required for indoor cooking."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "weather" }));
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      <>
        {"I'd be happy to help! Here are some popular questions I can answer:"}
        <br /><br />
        <strong>💰 Pricing:</strong> $55/adult, $30/child (6-12), FREE for 5 & under. $550 minimum.<br />
        <strong>🍽️ Menu:</strong> Choose 2 proteins: Chicken, Steak, Shrimp, Salmon, or Tofu + sides<br />
        <strong>⏰ Duration:</strong> 2 hours depending on party size<br />
        <strong>👥 Capacity:</strong> Up to 150 people with multiple chefs<br />
        <strong>🎉 Events:</strong> Birthdays, weddings, corporate events, reunions, and more!<br />
        <strong>🌱 Dietary:</strong> Vegetarian, vegan, gluten-free options available<br /><br />
        
        <button 
          onClick={() => window.location.href = '/faqs'}
          style={{ 
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          📚 View All FAQs
        </button>
        
        {"For detailed questions, contact us:"}
        <br />
        <strong>📧 Email:</strong> <a href="mailto:cs@myhibachichef.com" target="_blank" rel="noopener noreferrer">cs@myhibachichef.com</a><br />
        <strong>📱 Text:</strong> <a href="sms:+19167408768" target="_blank" rel="noopener noreferrer">+1 (916) 740-8768</a><br />
        <strong>📸 Instagram:</strong> <a href="https://www.instagram.com/my_hibachi_chef/" target="_blank" rel="noopener noreferrer">@my_hibachi_chef</a>
      </>
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "default" }));
  };

  handlePopularQuestions = () => {
    const message = this.createChatBotMessage(
      <>
        <strong>🔥 Most Popular Questions & Quick Answers:</strong>
        <br /><br />
        <strong>1. 💰 How much does it cost?</strong><br />
        Adults: $55 | Kids (6-12): $30 | Under 5: FREE | $550 minimum
        <br /><br />
        <strong>2. 🍽️ What's included in the menu?</strong><br />
        Choose 2 proteins + hibachi rice + vegetables + salad + sauces + unlimited sake
        <br /><br />
        <strong>3. ⏰ How long does it take?</strong><br />
        2 hours total depending on party size (setup + cooking show + dining)
        <br /><br />
        <strong>4. 👥 How many people can you serve?</strong><br />
        Up to 150 people with multiple chefs
        <br /><br />
        <strong>5. 🎉 What events do you cater?</strong><br />
        Birthdays, weddings, corporate events, bachelor/bachelorette parties, reunions
        <br /><br />
        <strong>6. 🌱 Dietary restrictions?</strong><br />
        Yes! Vegetarian, vegan, gluten-free, halal, kosher options available
        <br /><br />
        
        <button 
          onClick={() => window.location.href = '/faqs'}
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          📋 See All FAQ Details
        </button>
      </>
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "popular" }));
  };

  handleHello = () => {
    const message = this.createChatBotMessage(
      "How can I help you today?",
      {
        widget: "quickReplies"
      }
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message], lastIntent: "hello" }));
  };

  // Multi-step dialog logic
  startDialog = (dialog, firstStep) => {
    // Always reset dialog state before starting a new dialog
    this.dispatch(setMemory({
      currentDialog: dialog,
      dialogStep: firstStep,
      dialogData: {}
    }));
    this.askDialogStep(dialog, firstStep);
  };

  askDialogStep = (dialog, step) => {
    let prompt = "";
    // Booking dialog
    if (dialog === "booking") {
      if (step === "date") prompt = "What date would you like to book?";
      if (step === "guests") prompt = "How many guests will attend?";
      if (step === "name") prompt = "What is your name?";
    }
    // Dietary dialog
    if (dialog === "dietary") {
      if (step === "allergy") prompt = "Do you or your guests have any allergies or dietary restrictions?";
      if (step === "preference") prompt = "Any other dietary preferences (vegan, halal, etc)?";
    }
    // Feedback dialog
    if (dialog === "feedback") {
      if (step === "rating") prompt = "How would you rate your experience (1-5)?";
      if (step === "comment") prompt = "Any comments or suggestions?";
    }
    // Contact dialog
    if (dialog === "contact") {
      if (step === "name") prompt = "What's your name?";
      if (step === "email") prompt = "What's your email address?";
      if (step === "message") prompt = "What's your message for us?";
    }
    // Event dialog
    if (dialog === "event") {
      if (step === "type") prompt = "What type of event are you planning?";
      if (step === "date") prompt = "What date is your event?";
      if (step === "guests") prompt = "How many guests will attend?";
      if (step === "requests") prompt = "Any special requests?";
    }
    const message = this.createChatBotMessage(prompt);
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    this.dispatch(setMemory({ dialogStep: step }));
  };

  saveDialogStep = (dialog, step, value) => {
    // Example: Validate email for contact dialog
    if (dialog === "contact" && step === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        const message = this.createChatBotMessage("Please enter a valid email address.");
        this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
        return;
      }
    }
    // Save the answer for this step
    this.dispatch(setMemory({
      dialogData: { ...this.memory.dialogData, [step]: value }
    }));
  };

  nextDialogStep = (dialog, currentStep) => {
    // Define the step order for each dialog
    const dialogFlows = {
      booking: ["date", "guests", "name"],
      dietary: ["allergy", "preference"],
      feedback: ["rating", "comment"],
      contact: ["name", "email", "message"],
      event: ["type", "date", "guests", "requests"],
      // Add more dialogs here
    };
    const steps = dialogFlows[dialog];
    const idx = steps.indexOf(currentStep);
    if (idx >= 0 && idx < steps.length - 1) {
      const nextStep = steps[idx + 1];
      this.askDialogStep(dialog, nextStep);
    } else {
      this.finishDialog(dialog);
    }
  };

  finishDialog = (dialog) => {
    let summary = "";
    if (dialog === "booking") {
      const { date, guests, name } = this.memory.dialogData;
      summary = `Thank you${name ? ", " + name : ""}! Your booking for ${guests || "___"} guests on ${date || "___"} is noted. We'll contact you soon to confirm.`;
    }
    if (dialog === "dietary") {
      const { allergy, preference } = this.memory.dialogData;
      summary = `Thank you! We'll note: ${allergy || "no allergies"}${preference ? ", " + preference : ""}.`;
    }
    if (dialog === "feedback") {
      const { rating, comment } = this.memory.dialogData;
      summary = `Thank you for your feedback! Rating: ${rating || "N/A"}. ${comment ? "Comment: " + comment : ""}`;
    }
    if (dialog === "contact") {
      const { name, email, message } = this.memory.dialogData;
      summary = `Thank you${name ? ", " + name : ""}! We received your message: "${message || ""}". We'll reply to ${email || "your email"} soon.`;
    }
    if (dialog === "event") {
      const { type, date, guests, requests } = this.memory.dialogData;
      summary = `Event: ${type || "N/A"}, Date: ${date || "N/A"}, Guests: ${guests || "N/A"}${requests ? ", Requests: " + requests : ""}. We'll be in touch!`;
    }
    const message = this.createChatBotMessage(summary);
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    this.dispatch(setMemory({ currentDialog: null, dialogStep: null, dialogData: {} }));
  };
}

export default ActionProvider;
