import React, { useState, useEffect, useRef } from 'react';
import { WEBSITE_DATA, QA_PATTERNS, FALLBACK_RESPONSES, CONVERSATION_STARTERS, QUICK_RESPONSES } from './chatbot/knowledgeBase';

import './EnhancedChatBot.css';

const EnhancedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [_userPreferences, _setUserPreferences] = useState({});
  const messagesEndRef = useRef(null);

  // Initialize conversation
  useEffect(() => {
    const welcomeMessage = {
      id: 'welcome',
      type: 'bot',
      text: "👋 Welcome to My Hibachi Chef! I'm your personal assistant here to help with everything about our premium hibachi dining experience. What would you like to know?",
      timestamp: new Date(),
      options: CONVERSATION_STARTERS.slice(0, 4)
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Advanced AI-like response system with context awareness
  const generateResponse = (userMessage, context = {}) => {
    const message = userMessage.toLowerCase().trim();
    
    // Greeting handling
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you)/)) {
      const greetingResponses = [
        "Hello! 👋 I'm excited to help you plan your perfect hibachi experience!",
        "Hi there! 🍽️ Ready to learn about our amazing hibachi service?",
        "Hey! 🎉 I'm here to make your hibachi party planning easy and fun!"
      ];
      return {
        text: greetingResponses[Math.floor(Math.random() * greetingResponses.length)],
        options: CONVERSATION_STARTERS.slice(0, 4)
      };
    }

    // Quick response patterns
    if (message.includes('popular') && message.includes('combo')) {
      return { text: QUICK_RESPONSES.popular_combos, options: ['Menu Details', 'Pricing', 'Book Now'] };
    }
    if (message.includes('checklist') || (message.includes('what') && message.includes('need'))) {
      return { text: QUICK_RESPONSES.booking_checklist, options: ['Book Now', 'Setup Requirements', 'Contact Support'] };
    }

    // Enhanced pattern matching with scoring
    let bestMatch = null;
    let highestScore = 0;
    let matchedKeywords = [];

    QA_PATTERNS.forEach(pattern => {
      let score = 0;
      let keywords = [];
      
      pattern.keywords.forEach(keyword => {
        if (message.includes(keyword.toLowerCase())) {
          score += pattern.priority;
          keywords.push(keyword);
        }
      });
      
      // Bonus points for multiple keyword matches
      if (keywords.length > 1) {
        score += keywords.length * 0.5;
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = pattern.category;
        matchedKeywords = keywords;
      }
    });

    // Generate contextual response
    if (bestMatch && highestScore > 0) {
      return generateCategoryResponse(bestMatch, message, matchedKeywords, context);
    }

    // Enhanced fallback with suggestions
    return {
      text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
      contact: true,
      options: ['Contact Support', 'Popular Questions']
    };
  };

  const generateCategoryResponse = (category, message, keywords) => {
    switch (category) {
      case 'menu':
        if (message.includes('popular') || message.includes('recommend')) {
          const popularProteins = WEBSITE_DATA.menu.proteins.filter(p => p.popular);
          return {
            text: `🌟 **Most Popular Proteins:**\n${popularProteins.map(p => `• **${p.name}**: ${p.description}`).join('\n')}\n\n🍚 **Every meal includes:** ${WEBSITE_DATA.menu.sides.slice(0, 3).join(', ')}, plus our signature sauces!\n\n${QUICK_RESPONSES.popular_combos}`,
            options: ['Pricing Info', 'Dietary Options', 'Book Now', 'View All Proteins']
          };
        }
        return {
          text: `🍽️ **Our Premium Hibachi Menu:**\n\n**🥩 Protein Options:**\n${WEBSITE_DATA.menu.proteins.map(p => `• **${p.name}**: ${p.description}`).join('\n')}\n\n**🍚 Included with every meal:**\n${WEBSITE_DATA.menu.sides.map(s => `• ${s}`).join('\n')}\n\n**⭐ Premium Upgrades:**\n${WEBSITE_DATA.menu.upgrades.map(u => `• **${u.name}** (${u.price}): ${u.description || 'Premium enhancement'}`).join('\n')}\n\n**🍜 Additional Options:**\n${WEBSITE_DATA.menu.additional_options.map(a => `• **${a.name}** (${a.price}): ${a.description}`).join('\n')}\n\n🔗 [View Full Menu](/menu)`,
          options: ['Popular Combos', 'Pricing Info', 'Dietary Options', 'Book Now']
        };
        
      case 'pricing':
        return {
          text: `💰 **Complete Pricing Guide:**\n\n**Per Person Rates:**\n• 👥 Adults: ${WEBSITE_DATA.services.pricing.adult}\n• 🧒 Children (6-12): ${WEBSITE_DATA.services.pricing.child}\n• 👶 Under 5: ${WEBSITE_DATA.services.pricing.under5}\n\n**💳 Party Minimums & Fees:**\n• 🎉 Minimum: ${WEBSITE_DATA.services.pricing.minimum}\n• 💎 Deposit: ${WEBSITE_DATA.services.pricing.deposits}\n• 🚗 Travel fee: ${WEBSITE_DATA.services.pricing.travel_fee}\n\n**🆙 Popular Upgrades:**\n• Filet Mignon: +$5 per person\n• 3rd Protein: +$10 per person\n• Premium proteins: Scallops, Lobster (ask for pricing)\n\n💡 *Tip: Most parties of 15-20 people cost around $800-1,200 total*`,
          options: ['Book Now', 'Menu Details', 'Group Size Info', 'Service Areas']
        };
        
      case 'booking':
        return {
          text: `📅 **Easy Booking Process:**\n\n**🚀 Quick Steps:**\n1️⃣ Visit our [Booking Page](/BookUs)\n2️⃣ Select your preferred date & time\n3️⃣ Choose your menu options\n4️⃣ Add party details & special requests\n5️⃣ Submit booking form\n6️⃣ Pay ${WEBSITE_DATA.booking.deposit} within 6 hours\n\n**📋 What We Need:**\n${WEBSITE_DATA.booking.requirements.map(req => `• ${req}`).join('\n')}\n\n**⏰ Important:** ${WEBSITE_DATA.booking.advance_notice}\n\n**✅ Confirmation:** ${WEBSITE_DATA.booking.confirmation}`,
          options: ['Start Booking', 'Check Availability', 'Menu & Pricing', 'Setup Requirements']
        };
        
      case 'dietary':
        return {
          text: `🥗 **Comprehensive Dietary Accommodations:**\n\n**We happily accommodate:**\n${WEBSITE_DATA.dietary.accommodations.map(acc => `✅ ${acc}`).join('\n')}\n\n**🕐 Important:** ${WEBSITE_DATA.dietary.notice_required}\n\n**👨‍🍳 Our chefs are trained in:**\n• Cross-contamination prevention\n• Separate cooking utensils\n• Ingredient substitutions\n• Special preparation techniques\n\n💡 *We take dietary needs seriously - your safety and enjoyment come first!*`,
          options: ['Book Now', 'Menu Details', 'Contact Support', 'Special Requests']
        };
        
      case 'location': {
        const isSpecificLocation = keywords.some(k => ['fremont', 'northern california', 'bay area', 'sacramento', 'greater sacramento'].includes(k.toLowerCase()));
        if (isSpecificLocation) {
          return {
            text: `📍 **Great news! We serve your area:**\n\n**� Service Regions:**\n${WEBSITE_DATA.service_area.regions_served.map(area => `• ${area}`).join('\n')}\n\n**🚗 Travel Policy:**\n• ${WEBSITE_DATA.service_area.travel_policy}\n• ${WEBSITE_DATA.service_area.travel_fee}\n• ${WEBSITE_DATA.service_area.coverage_radius}\n\n*We love bringing hibachi to new places - let us know your specific location!*`,
            options: ['Book Now', 'Check My Address', 'Pricing Info', 'Event Details']
          };
        }
        return {
          text: `📍 **Our Service Coverage:**\n\n**� We Serve:**\n${WEBSITE_DATA.service_area.regions_served.map(area => `• ${area}`).join('\n')}\n\n**🚗 Travel Policy:**\n• Based in ${WEBSITE_DATA.service_area.base_location}\n• ${WEBSITE_DATA.service_area.travel_policy}\n• ${WEBSITE_DATA.service_area.travel_fee}\n• ${WEBSITE_DATA.service_area.coverage_radius}\n\n**❓ Not sure if we serve your area?** Just ask! We're always expanding our reach.`,
          options: ['Check My Location', 'Book Now', 'Pricing Info', 'Contact Support']
        };
      }
        
      case 'event_details':
        if (message.includes('setup') || message.includes('prepare') || message.includes('bring')) {
          return {
            text: `🏠 **Event Setup Made Easy:**\n\n**✅ You Provide:**\n${WEBSITE_DATA.event_details.setup_required.map(item => `• ${item}`).join('\n')}\n\n**🎉 We Bring & Handle:**\n${WEBSITE_DATA.event_details.provided.map(item => `• ${item}`).join('\n')}\n\n**📏 Space Requirements:**\n• ${WEBSITE_DATA.event_details.space_requirements}\n• Access to power outlet\n• Level surface for cooking\n\n**⏱️ Timeline:**\n• Chef arrives 20 minutes early\n• ${WEBSITE_DATA.event_details.duration}\n• Complete cleanup included`,
            options: ['Book Now', 'Group Size Info', 'Menu & Pricing', 'Weather Policy']
          };
        }
        return {
          text: `🎉 **Complete Event Experience:**\n\n**⏰ Duration:** ${WEBSITE_DATA.event_details.duration}\n\n**👥 Group Sizes:**\n• Minimum: ${WEBSITE_DATA.event_details.group_sizes.minimum}\n• Sweet Spot: ${WEBSITE_DATA.event_details.group_sizes.optimal}\n• Maximum: ${WEBSITE_DATA.event_details.group_sizes.maximum}\n\n**🎭 What Makes Us Special:**\n${WEBSITE_DATA.services.features.map(feature => `• ${feature}`).join('\n')}\n\n**🎪 Perfect For:**\n${WEBSITE_DATA.services.types.slice(0, 6).map(type => `• ${type}`).join('\n')}`,
          options: ['Setup Requirements', 'Book Now', 'Pricing', 'Popular Occasions']
        };

      case 'policies':
        if (message.includes('weather') || message.includes('rain')) {
          return {
            text: `🌦️ **Weather? No Problem!**\n\n**☔ Rain or Shine:**\n• ${WEBSITE_DATA.policies.weather}\n• We bring portable exhaust fans\n• Flexible indoor/outdoor setup\n\n**🏠 Indoor Cooking:**\n• Kitchen or garage with ventilation\n• Covered patio or porch\n• We make it work safely!\n\n**📞 Day-of Changes:**\n• ${WEBSITE_DATA.policies.rescheduling}\n• We're flexible and understanding\n• Your safety comes first`,
            options: ['Book Now', 'Contact Support', 'Setup Requirements', 'Cancellation Policy']
          };
        }
        return {
          text: `📋 **Our Policies & Guarantees:**\n\n**🔄 Flexibility:**\n• Cancellation: ${WEBSITE_DATA.policies.cancellation}\n• Rescheduling: ${WEBSITE_DATA.policies.rescheduling}\n• Weather: ${WEBSITE_DATA.policies.weather}\n\n**💳 Payment:**\n• ${WEBSITE_DATA.policies.payment}\n• Tipping: ${WEBSITE_DATA.policies.tipping}\n\n**🛡️ Peace of Mind:**\n• ${WEBSITE_DATA.policies.insurance}\n• Professional, certified chefs\n• Premium quality service`,
          options: ['Book Now', 'Contact Support', 'Payment Options', 'Chef Info']
        };

      case 'entertainment':
        return {
          text: `🎪 **The Ultimate Hibachi Show!**\n\n**👨‍🍳 Our Certified Chefs Provide:**\n• Spectacular knife tricks and skills\n• Onion volcano and shrimp flip\n• Interactive cooking entertainment\n• Personalized attention for birthday celebrants\n• Photo opportunities throughout the meal\n• Engaging storytelling and jokes\n\n**🎭 What Makes It Special:**\n• Professional training in hibachi entertainment\n• Family-friendly performance\n• Customized for your occasion\n• Creates lasting memories\n\n**📸 Perfect for social media moments!**`,
          options: ['Book Now', 'Chef Qualifications', 'Menu & Pricing', 'Special Occasions']
        };

      case 'group_size':
        return {
          text: `👥 **Group Size Guide:**\n\n**📊 Our Recommendations:**\n• **Minimum:** ${WEBSITE_DATA.event_details.group_sizes.minimum}\n• **Optimal Experience:** ${WEBSITE_DATA.event_details.group_sizes.optimal}\n• **Maximum:** ${WEBSITE_DATA.event_details.group_sizes.maximum}\n\n**💡 Why Size Matters:**\n• Smaller groups = more personal attention\n• 15-25 people = perfect balance of fun & intimacy\n• Larger groups = party atmosphere with multiple chefs\n\n**💰 Cost Examples:**\n• 10 people: $550 (minimum)\n• 15 people: $825\n• 20 people: $1,100\n• 25 people: $1,375`,
          options: ['Book Now', 'Pricing Calculator', 'Event Planning', 'Multiple Chefs']
        };

      case 'occasions': {
        const occasion = keywords.find(k => ['birthday', 'wedding', 'anniversary', 'graduation', 'corporate'].includes(k.toLowerCase()));
        if (occasion) {
          return {
            text: `🎉 **Perfect for ${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Celebrations!**\n\n**🎁 Special Touches We Add:**\n• Personalized attention for guest of honor\n• Birthday song and special presentation\n• Photo opportunities throughout the meal\n• Customized menu for dietary preferences\n• Professional entertainment that wows guests\n\n**🌟 Why Choose Us:**\n• Memorable experience your guests will talk about\n• No cleanup or cooking stress for you\n• Professional service you can trust\n• All-inclusive pricing\n\n**📅 Book early for popular dates!**`,
            options: ['Book Now', 'Menu & Pricing', 'Setup Requirements', 'Special Requests']
          };
        }
        return {
          text: `🎊 **Special Occasions We Love:**\n\n${WEBSITE_DATA.services.types.map(type => `🎉 ${type}`).join('\n')}\n\n**✨ What Makes Each Special:**\n• Customized menu and presentation\n• Professional entertainment\n• Memorable experience for all ages\n• Stress-free hosting for you\n• Perfect for creating lasting memories\n\n**🎈 Tell us about your celebration and we'll make it extra special!**`,
          options: ['Book Now', 'Birthday Parties', 'Corporate Events', 'Wedding Celebrations']
        };
      }

      default:
        return {
          text: "I'd be happy to help! What specific information are you looking for?",
          options: ['Menu & Pricing', 'Book Now', 'Dietary Options', 'Service Areas']
        };
    }
  };

  const handleSendMessage = async (text, isOption = false) => {
    if (!text.trim() && !isOption) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, { input: text, timestamp: new Date() }]);
    
    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text, { history: conversationHistory });
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        timestamp: new Date(),
        options: response.options,
        contact: response.contact
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay for natural feel
  };

  const handleOptionClick = (option) => {
    handleSendMessage(option, true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="enhanced-chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img src="/assets/My Hibachi logo.png" alt="Hibachi Chef" className="chatbot-avatar" />
              <div className="chatbot-title">
                <h4>My Hibachi Chef Assistant</h4>
                <span className="chatbot-status">Online • Ready to help!</span>
              </div>
            </div>
            <div className="chatbot-controls">
              <button 
                className="chatbot-minimize-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? '⬆️' : '⬇️'}
              </button>
              <button 
                className="chatbot-close-btn"
                onClick={closeChat}
                title="Close chat"
              >
                ❌
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="chatbot-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.type}`}>
                    {msg.type === 'bot' && (
                      <img src="/assets/My Hibachi logo.png" alt="Bot" className="message-avatar" />
                    )}
                    <div className="message-content">
                      <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                      {msg.options && (
                        <div className="message-options">
                          {msg.options.map((option, index) => (
                            <button
                              key={index}
                              className="option-button"
                              onClick={() => handleOptionClick(option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.contact && (
                        <div className="contact-info">
                          <button 
                            className="contact-button"
                            onClick={() => openLink('/contact')}
                          >
                            📞 Contact Support
                          </button>
                          <button 
                            className="contact-button"
                            onClick={() => openLink(`mailto:${WEBSITE_DATA.contact.email}`)}
                          >
                            ✉️ Email Us
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="message-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message bot">
                    <img src="/assets/My Hibachi logo.png" alt="Bot" className="message-avatar" />
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chatbot-input-area">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about hibachi dining..."
                  className="chatbot-input"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  className="chatbot-send-btn"
                  disabled={!inputValue.trim() || isTyping}
                >
                  🚀
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat Button */}
      <button
        className={`chatbot-fab ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        title="Chat with our Hibachi Assistant"
      >
        <img src="/assets/My Hibachi logo.png" alt="Chat" className="chatbot-fab-icon" />
        {!isOpen && (
          <div className="chatbot-fab-pulse"></div>
        )}
      </button>
      
      {/* Floating tooltip */}
      {!isOpen && (
        <div className="chatbot-tooltip">
          Ask me anything! 🍽️
        </div>
      )}
    </div>
  );
};

export default EnhancedChatBot;
