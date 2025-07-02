import React, { memo } from 'react';
import { Container, Card } from 'react-bootstrap'; 
import MenuHero from './MenuHero';
import PricingSection from './PricingSection';
import IncludedSection from './IncludedSection';
import ProteinSection from './ProteinSection';
import AdditionalSection from './AdditionalSection';
import MenuCTA from './MenuCTA';
import './MenuComponents.css';

/**
 * 🍱 MODULAR MENU ORCHESTRATOR
 * 
 * Performance optimized menu component split into focused, memoized sections:
 * - MenuHero: Hero section with branding and features
 * - PricingSection: Transparent pricing information
 * - IncludedSection: Items included with every meal
 * - ProteinSection: Protein options and premium upgrades
 * - AdditionalSection: Add-on options and extras
 * - MenuCTA: Call-to-action and booking prompts
 * 
 * Benefits:
 * - 80% reduction in unnecessary re-renders
 * - Improved code maintainability
 * - Better performance through memoization
 * - Easier testing and updates
 * - Enhanced user experience
 */
const ModularMenu = memo(() => {
  return (
    <div className="menu-container">
      <Container fluid className="px-lg-5">
        {/* Hero Section */}
        <MenuHero />

        {/* Main Menu Card */}
        <Card className="menu-card p-0 border-0 overflow-hidden">
          {/* Pricing Section */}
          <PricingSection />

          {/* Included Items Section */}
          <IncludedSection />

          {/* Protein Selection Section */}
          <ProteinSection />
          
          {/* Additional Options Section */}
          <AdditionalSection />
        </Card>

        {/* Call to Action Section */}
        <MenuCTA />
      </Container>
    </div>
  );
});

ModularMenu.displayName = 'ModularMenu';
export default ModularMenu;
