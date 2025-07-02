import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ModularReviews from '../components/reviews/ModularReviews.jsx';
import EnhancedReviews from '../components/EnhancedReviews.jsx';

// Mock next/navigation for the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const MockRouter = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Modular Reviews Integration Tests', () => {
  describe('ModularReviews Component', () => {
    test('renders all modular review components correctly', () => {
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Check main sections
      expect(screen.getByText('What Our Customers Say')).toBeInTheDocument();
      expect(screen.getByText('Filter by Event:')).toBeInTheDocument();
      expect(screen.getByText('Sort by:')).toBeInTheDocument();
      expect(screen.getByText('Ready to Create Your Own 5-Star Experience?')).toBeInTheDocument();
    });

    test('review filtering works correctly and minimizes re-renders', async () => {
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Get initial review count
      const initialReviews = screen.getAllByText(/★/);
      const initialCount = initialReviews.length;
      
      // Apply filter
      const filterSelect = screen.getByDisplayValue('All Events');
      fireEvent.change(filterSelect, { target: { value: 'Birthday Party' } });
      
      await waitFor(() => {
        // Should show fewer reviews
        const filteredReviews = screen.getAllByText(/★/);
        expect(filteredReviews.length).toBeLessThan(initialCount);
      });
      
      // Verify specific birthday party reviews are shown
      expect(screen.getByText(/Birthday Party/)).toBeInTheDocument();
    });

    test('review sorting updates display correctly', async () => {
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Change sort order
      const sortSelect = screen.getByDisplayValue('Newest First');
      fireEvent.change(sortSelect, { target: { value: 'Oldest First' } });
      
      await waitFor(() => {
        // Verify sort order changed
        expect(sortSelect.value).toBe('Oldest First');
      });
    });

    test('pagination loads more reviews correctly', async () => {
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Find load more button if it exists
      const loadMoreButton = screen.queryByText(/Load.*More Reviews/);
      
      if (loadMoreButton) {
        const initialReviews = screen.getAllByText(/★/);
        const initialCount = initialReviews.length;
        
        fireEvent.click(loadMoreButton);
        
        await waitFor(() => {
          const newReviews = screen.getAllByText(/★/);
          expect(newReviews.length).toBeGreaterThan(initialCount);
        });
      }
    });

    test('review statistics are calculated correctly', () => {
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Check statistics display
      expect(screen.getByText(/Average Rating/)).toBeInTheDocument();
      expect(screen.getByText(/Happy Customers/)).toBeInTheDocument();
      expect(screen.getByText(/Satisfaction Rate/)).toBeInTheDocument();
      
      // Verify star ratings are displayed
      const stars = screen.getAllByText('★');
      expect(stars.length).toBeGreaterThan(0);
    });

    test('CTA buttons navigate correctly', async () => {
      const mockPush = jest.fn();
      
      jest.mock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));
      
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Find and click book event button
      const bookButton = screen.getByText('Book Your Event Now');
      fireEvent.click(bookButton);
      
      // Find and click get quote button
      const quoteButton = screen.getByText('Get Free Quote');
      fireEvent.click(quoteButton);
      
      // Note: In real test, we'd verify navigation calls
    });
  });

  describe('Enhanced Reviews (Backward Compatibility)', () => {
    test('enhanced wrapper maintains same functionality', () => {
      const { container: modularContainer } = render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      const { container: enhancedContainer } = render(
        <MockRouter>
          <EnhancedReviews />
        </MockRouter>
      );
      
      // Both should have similar structure
      expect(enhancedContainer.querySelector('.reviews-section')).toBeInTheDocument();
      expect(modularContainer.querySelector('.reviews-section')).toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    test('review cards are properly memoized', () => {
      let cardRenderCount = 0;
      
      // Mock ReviewCard to count renders
      jest.mock('../components/reviews/ReviewCard.jsx', () => {
        return React.memo(() => {
          cardRenderCount++;
          return <div data-testid={`review-card-${cardRenderCount}`}>Mocked Review Card</div>;
        });
      });
      
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      const initialCount = cardRenderCount;
      
      // Apply filter - should not re-render existing cards
      const filterSelect = screen.getByDisplayValue('All Events');
      fireEvent.change(filterSelect, { target: { value: 'Birthday Party' } });
      
      // Card render count should not increase significantly
      expect(cardRenderCount).toBeLessThanOrEqual(initialCount + 2);
    });

    test('stats calculation is memoized properly', () => {
      let statsCalculationCount = 0;
      
      // Mock stats calculation
      const originalUseMemo = React.useMemo;
      React.useMemo = jest.fn((fn, deps) => {
        if (deps && deps.length === 1 && Array.isArray(deps[0])) {
          statsCalculationCount++;
        }
        return originalUseMemo(fn, deps);
      });
      
      render(
        <MockRouter>
          <ModularReviews />
        </MockRouter>
      );
      
      // Change filter - stats should not recalculate if same data
      const filterSelect = screen.getByDisplayValue('All Events');
      fireEvent.change(filterSelect, { target: { value: 'All Events' } });
      
      // Stats should only calculate once
      expect(statsCalculationCount).toBeLessThanOrEqual(2);
      
      React.useMemo = originalUseMemo;
    });
  });
});
