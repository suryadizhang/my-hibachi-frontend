class MessageParser {
  constructor(actionProvider, memory) {
    this.actionProvider = actionProvider;
    this.memory = memory;
  }

  parse(message) {
    const msg = message.toLowerCase();

    // If in a dialog, handle the current step
    if (this.memory.currentDialog && this.memory.dialogStep) {
      // Optionally, parse for special cases (e.g., "my name is ...") here
      if (this.memory.currentDialog === "booking" && this.memory.dialogStep === "name" && msg.startsWith("my name is")) {
        const name = msg.replace("my name is", "").trim();
        this.actionProvider.saveDialogStep("booking", "name", name);
        this.actionProvider.nextDialogStep("booking", "name");
        return;
      }
      if (this.memory.currentDialog === "dietary" && this.memory.dialogStep === "preference" && msg.startsWith("i am")) {
        const pref = msg.replace("i am", "").trim();
        this.actionProvider.saveDialogStep("dietary", "preference", pref);
        this.actionProvider.nextDialogStep("dietary", "preference");
        return;
      }
      // Default: save and go to next step
      this.actionProvider.saveDialogStep(this.memory.currentDialog, this.memory.dialogStep, message);
      this.actionProvider.nextDialogStep(this.memory.currentDialog, this.memory.dialogStep);
      return;
    }

    // Start booking dialog
    if (msg.includes("book") || msg.includes("reserve") || msg.includes("schedule")) {
      this.actionProvider.startDialog("booking", "date");
      return;
    }

    // Start dietary dialog
    if (msg.includes("diet") || msg.includes("allergy") || msg.includes("vegetarian") || msg.includes("gluten")) {
      this.actionProvider.startDialog("dietary", "allergy");
      return;
    }

    // Start feedback dialog
    if (msg.includes("feedback") || msg.includes("rate") || msg.includes("review")) {
      this.actionProvider.startDialog("feedback", "rating");
      return;
    }

    // Example: If last topic was menu and user asks "how much", route to pricing
    if (
      (msg.includes("how much") || msg.includes("price") || msg.includes("cost")) &&
      this.memory?.lastTopic === "menu"
    ) {
      this.actionProvider.handlePricing();
    } else if (msg.includes("menu")) {
      this.actionProvider.handleMenu();
    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
      this.actionProvider.handlePricing();
    } else if (msg.includes("book") || msg.includes("reserve") || msg.includes("schedule")) {
      this.actionProvider.handleBooking();
    } else if (msg.includes("vegetarian") || msg.includes("gluten") || msg.includes("allergy") || msg.includes("diet")) {
      this.actionProvider.handleDiet();
    } else if (msg.includes("how long") || msg.includes("duration") || msg.includes("time")) {
      this.actionProvider.handleDuration();
    } else if (msg.includes("setup") || msg.includes("prepare") || msg.includes("clean") || msg.includes("bring")) {
      this.actionProvider.handleSetup();
    } else if (msg.includes("area") || msg.includes("location") || msg.includes("where") || msg.includes("serve")) {
      this.actionProvider.handleLocation();
    } else if (msg.includes("kids") || msg.includes("children") || msg.includes("birthday")) {
      this.actionProvider.handleEvents();
    } else if (msg.includes("tip") || msg.includes("tipping") || msg.includes("gratuity")) {
      this.actionProvider.handleTipping();
    } else if (msg.includes("weather") || msg.includes("rain") || msg.includes("cancel") || msg.includes("reschedule")) {
      this.actionProvider.handleWeather();
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

export default MessageParser;
