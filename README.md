# My Hibachi - Frontend

A modern React application for My Hibachi's premium hibachi catering service, built with Vite and React.

## 🚀 Features

- **Modern React UI**: Built with React 18 and Vite for optimal performance
- **Responsive Design**: Mobile-first approach with Bootstrap integration
- **Interactive Chatbot**: AI-powered customer service assistant
- **Booking System**: Seamless reservation and booking flow
- **SEO Optimized**: Server-side rendering ready with meta tags and structured data
- **Performance Focused**: Optimized images, lazy loading, and code splitting

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Routing**: React Router DOM
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **SEO**: React Helmet Async
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/my-hibachi-frontend.git
   cd my-hibachi-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_TITLE=My Hibachi
   VITE_APP_DESCRIPTION=Premium Hibachi Catering Service
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── chatbot/         # Chatbot functionality
│   ├── faqs/            # FAQ components
│   ├── forms/           # Form components
│   └── ...
├── services/            # API services
├── assets/              # Static assets (images, icons)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── config/              # Configuration files
├── constants/           # App constants
└── styles/              # Global styles
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repository

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_APP_TITLE` | Application title | `My Hibachi` |
| `VITE_APP_DESCRIPTION` | App description | `Premium Hibachi Catering Service` |

## 📱 Features Overview

### 🏠 Landing Page
- Hero section with call-to-action
- Service highlights
- Customer testimonials
- Interactive booking flow

### 🤖 Chatbot
- AI-powered customer assistance
- Menu inquiries
- Booking support
- FAQ responses

### 📋 Booking System
- Multi-step booking form
- Date/time selection
- Menu customization
- Payment integration ready

### ❓ FAQ Section
- Categorized questions
- Search functionality
- Dynamic content updates

## 🔧 Development Guidelines

### Code Style
- Use ES6+ features
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript for type safety (optional)

### Component Structure
```jsx
// Component template
import React from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### State Management
- Use useState for local state
- Use useContext for global state
- Implement custom hooks for reusable logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: dev@myhibachi.com
- Issues: [GitHub Issues](https://github.com/your-username/my-hibachi-frontend/issues)

## 🗺️ Roadmap

- [ ] TypeScript migration
- [ ] PWA implementation
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Enhanced accessibility features

---

Built with ❤️ for My Hibachi by the development team.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
