import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./components/Navbar";
import About from "./components/About";
import OrderServices from "./components/OrderServices";
import Menu from "./components/Menu";
import Reviews from "./components/Reviews";
import FAQs from "./components/faqs/FAQs";
import Contact from "./components/Contact";
import ChatBot from "./components/ChatBot";
import CreditCardPayment from "./components/CreditCardPayment";
import PartyGuestProteinForm from "./components/PartyGuestProteinForm";
import AdminLogin from './components/AdminLogin';
import AdminPanel from "./components/AdminPanel";
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/services" element={<OrderServices />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<CreditCardPayment />} />
          <Route path="/party" element={<PartyGuestProteinForm />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
      <ChatBot />
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

export default App;
