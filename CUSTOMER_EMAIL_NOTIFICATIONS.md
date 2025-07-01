# Customer Email Notifications Summary

## 📧 Email Communications Overview

### 🏢 **Email Configuration**
- **From:** cs@myhibachichef.com
- **Reply-to:** info@myhibachichef.com
- **SMTP Provider:** IONOS
- **Format:** Both HTML and plain text

---

## 📋 **Email Templates Sent to Customers**

### 1. 🎯 **NEW BOOKING CONFIRMATION**

**Subject:** `Your Booking Confirmation for [DATE] at [TIME]`

**Content:**
```
Thank you for your booking!

Here are your details:
Name: [Customer Name]
Date: [Booking Date]
Time Slot: [Time Slot]
Address: [Full Address]

⚠️ To secure your booking, a $100.00 deposit is required within 6 hours.

We look forward to serving you!

Best regards,
My Hibachi Chef Team

For questions, contact us at info@myhibachichef.com
```

**HTML Version:** 
- Professional styling with My Hibachi Chef branding
- Red highlight for deposit requirement
- Responsive design for mobile/desktop

---

### 2. ✅ **DEPOSIT RECEIVED CONFIRMATION**

**Subject:** `Deposit Received - Your Booking is Confirmed for [DATE]`

**Content:**
```
Great news! We have received your deposit.

Your booking is now confirmed:
Name: [Customer Name]
Date: [Booking Date]
Time Slot: [Time Slot]
Address: [Full Address]

We look forward to serving you an amazing hibachi experience!

Best regards,
My Hibachi Chef Team

For questions, contact us at info@myhibachichef.com
```

---

### 3. ❌ **BOOKING CANCELLATION**

**Subject:** `Booking Cancellation Confirmation - [DATE] at [TIME]`

**Content:**
```
Your booking has been cancelled.

Cancelled Booking Details:
Name: [Customer Name]
Date: [Booking Date]
Time Slot: [Time Slot]
Address: [Full Address]

Reason for cancellation: [Admin Provided Reason or "Cancelled upon request"]

If you have any questions or would like to make a new booking, please contact us.

Best regards,
My Hibachi Chef Team

Contact us at info@myhibachichef.com
```

---

### 4. ⏰ **DEPOSIT REMINDER** (After 4 hours)

**Subject:** `Deposit Reminder for Your Booking on [DATE] at [TIME]`

**Content:**
```
This is a reminder that a $100.00 deposit is required to secure your booking.

Please complete your deposit as soon as possible to avoid cancellation.

Booking details:
Name: [Customer Name]
Date: [Booking Date]
Time Slot: [Time Slot]

Thank you!
```

---

### 5. 📝 **WAITLIST CONFIRMATION**

**Subject:** `Waitlist Confirmation for [DATE] at [TIME]`

**Content:**
```
Thank you for joining the waitlist!

Here are your details:
Name: [Customer Name]
Date: [Preferred Date]
Time Slot: [Preferred Time]

We will contact you if a slot becomes available.
```

---

### 6. 🎯 **WAITLIST POSITION NOTIFICATION**

**Subject:** `Waitlist Confirmation: You are #[POSITION] in line`

**Content:**
```
Thank you for joining the waitlist!

Here are your details:
Name: [Customer Name]
Date: [Preferred Date]
Time Slot: [Preferred Time]

You are currently number [POSITION] on the waitlist for this slot.
We will notify you if an opening becomes available.

Best regards,
My Hibachi Chef Team
```

---

### 7. 🎉 **WAITLIST SLOT OPENED**

**Subject:** `Good News! A Slot Has Opened Up for [DATE] at [TIME]`

**Content:**
```
Hello [Customer Name],

A slot has just opened up for your requested date and time:
Date: [Preferred Date]
Time Slot: [Preferred Time]

Please reply to this email or contact us as soon as possible if you would like to claim this slot.

Best regards,
My Hibachi Chef Team
```

---

## 🔄 **Email Flow Process**

### **Booking Journey:**
1. **Customer Books** → **Booking Confirmation** (with deposit requirement)
2. **After 4 hours** → **Deposit Reminder** (if no deposit)
3. **After 6 hours** → Admin notified (customer may be contacted)
4. **Deposit Received** → **Deposit Confirmation**
5. **If Cancelled** → **Cancellation Confirmation**

### **Waitlist Journey:**
1. **Customer Joins Waitlist** → **Waitlist Confirmation**
2. **Position Assigned** → **Position Notification**
3. **Slot Opens** → **Slot Available Notification**

---

## 👨‍💼 **Admin Notifications** 

The system also sends copies/notifications to `info@myhibachichef.com` for:

- ✉️ **New Booking Notifications** (immediate)
- 📋 **Booking Confirmation Copies** (when sent to customer)
- 💰 **Deposit Confirmation Notifications** (with admin reason)
- ❌ **Cancellation Notifications** (with reason)
- ⚠️ **Missing Deposit Alerts** (after 6 hours)

---

## 🎨 **Email Styling Features**

- **Professional Design:** Clean, responsive HTML templates
- **Brand Colors:** My Hibachi Chef red (#E94F37) for highlights
- **Mobile Friendly:** Responsive design for all devices
- **Clear CTAs:** Important information highlighted
- **Contact Info:** Always includes support contact information

---

## ⚙️ **Technical Features**

- **Dual Format:** Both HTML and plain text versions
- **Test Mode:** Emails can be disabled during testing
- **Error Handling:** Graceful fallback if email fails
- **SMTP Security:** TLS encryption for email transmission
- **Environment Variables:** Secure credential management

---

## 📞 **Customer Support**

All emails include contact information:
- **Email:** info@myhibachichef.com
- **Purpose:** Questions, support, new bookings
- **Response:** Professional customer service

---

*This email system ensures customers are fully informed throughout their booking journey while maintaining professional communication standards.*
