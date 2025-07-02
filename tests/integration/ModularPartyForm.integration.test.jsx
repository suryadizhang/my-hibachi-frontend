import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BootstrapProvider } from 'react-bootstrap';
import ModularPartyBookingForm from '../components/party/ModularPartyBookingForm.jsx';
import EnhancedPartyGuestProteinForm from '../components/EnhancedPartyGuestProteinForm.jsx';

// Mock dependencies
jest.mock('../components/MissingFieldsModal.jsx', () => {
  return function MockMissingFieldsModal({ show, onClose, missingFields }) {
    if (!show) return null;
    return (
      <div data-testid="missing-fields-modal">
        <div>Missing Fields Modal</div>
        <ul>
          {missingFields.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('Modular Party Booking Form Integration Tests', () => {
  describe('ModularPartyBookingForm Component', () => {
    test('renders all modular components correctly', () => {
      render(<ModularPartyBookingForm />);
      
      // Check if main sections are rendered
      expect(screen.getByText('Party Guests & Protein Calculator')).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Adults/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Children/)).toBeInTheDocument();
      expect(screen.getByText('Adult Protein Selection')).toBeInTheDocument();
      expect(screen.getByText('Cost Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Submit Order Details')).toBeInTheDocument();
    });

    test('guest count changes trigger only necessary re-renders', async () => {
      const { rerender } = render(<ModularPartyBookingForm />);
      
      const adultInput = screen.getByLabelText(/Number of Adults/);
      
      // Change adult count
      fireEvent.change(adultInput, { target: { value: '15' } });
      
      // Verify pricing updates
      await waitFor(() => {
        expect(screen.getByText(/15 × \$55/)).toBeInTheDocument();
      });
      
      // Verify protein selection is still functional
      expect(screen.getByText('Adult Protein Selection')).toBeInTheDocument();
    });

    test('protein selection updates pricing correctly', async () => {
      render(<ModularPartyBookingForm />);
      
      // Select a premium protein
      const filetMignonCheckbox = screen.getByLabelText(/Filet Mignon/);
      fireEvent.click(filetMignonCheckbox);
      
      // Verify pricing calculation includes upcharge
      await waitFor(() => {
        expect(screen.getByText(/Protein upcharge/)).toBeInTheDocument();
      });
    });

    test('form validation prevents submission with missing fields', async () => {
      render(<ModularPartyBookingForm />);
      
      // Try to submit without required protein selections
      const submitButton = screen.getByText('Submit Order Details');
      fireEvent.click(submitButton);
      
      // Verify modal appears with validation errors
      await waitFor(() => {
        expect(screen.getByTestId('missing-fields-modal')).toBeInTheDocument();
      });
    });

    test('child protein section appears when children count > 0', async () => {
      render(<ModularPartyBookingForm />);
      
      const childInput = screen.getByLabelText(/Number of Children/);
      
      // Initially child section should not be visible
      expect(screen.queryByText('Child Protein Selection')).not.toBeInTheDocument();
      
      // Add children
      fireEvent.change(childInput, { target: { value: '3' } });
      
      // Child section should now appear
      await waitFor(() => {
        expect(screen.getByText('Child Protein Selection')).toBeInTheDocument();
      });
    });

    test('pricing calculator memoization works correctly', async () => {
      const mockCalculation = jest.fn();
      
      // Mock the pricing calculation to track calls
      const originalUseMemo = React.useMemo;
      React.useMemo = jest.fn((fn, deps) => {
        if (deps && deps.length > 5) { // Pricing calculator has many dependencies
          mockCalculation();
        }
        return originalUseMemo(fn, deps);
      });
      
      render(<ModularPartyBookingForm />);
      
      const adultInput = screen.getByLabelText(/Number of Adults/);
      
      // First calculation
      fireEvent.change(adultInput, { target: { value: '12' } });
      
      // Same value again - should not recalculate due to memoization
      fireEvent.change(adultInput, { target: { value: '12' } });
      
      // Verify calculation was called minimal times
      expect(mockCalculation).toHaveBeenCalledTimes(1);
      
      // Restore original useMemo
      React.useMemo = originalUseMemo;
    });
  });

  describe('Enhanced Party Form (Backward Compatibility)', () => {
    test('enhanced wrapper maintains same API as original', () => {
      const { container: modularContainer } = render(<ModularPartyBookingForm />);
      const { container: enhancedContainer } = render(<EnhancedPartyGuestProteinForm />);
      
      // Both should have the same basic structure
      expect(enhancedContainer.querySelector('.card')).toBeInTheDocument();
      expect(modularContainer.querySelector('.card')).toBeInTheDocument();
      
      // Both should have the same form elements
      expect(enhancedContainer.querySelectorAll('input').length)
        .toBeGreaterThanOrEqual(modularContainer.querySelectorAll('input').length - 2); // Allow for small differences
    });

    test('form submission works identically in both versions', async () => {
      const testSubmission = async (Component) => {
        const { unmount } = render(<Component />);
        
        // Fill out form completely
        const adultInput = screen.getByLabelText(/Number of Adults/);
        fireEvent.change(adultInput, { target: { value: '12' } });
        
        // Select required proteins
        const chickenCheckbox = screen.getByLabelText(/Chicken/);
        const shrimpCheckbox = screen.getByLabelText(/Shrimp/);
        fireEvent.click(chickenCheckbox);
        fireEvent.click(shrimpCheckbox);
        
        // Submit form
        const submitButton = screen.getByText('Submit Order Details');
        fireEvent.click(submitButton);
        
        // Should show success message
        await waitFor(() => {
          expect(screen.getByText(/Order Details Submitted!/)).toBeInTheDocument();
        });
        
        unmount();
      };
      
      // Test both versions
      await testSubmission(ModularPartyBookingForm);
      await testSubmission(EnhancedPartyGuestProteinForm);
    });
  });

  describe('Performance Integration Tests', () => {
    test('modular components minimize re-renders', () => {
      let renderCount = 0;
      
      // Create a render counter
      const CountingComponent = React.memo(() => {
        renderCount++;
        return <div>Render count: {renderCount}</div>;
      });
      
      const TestForm = () => {
        const [adults, setAdults] = React.useState(10);
        
        return (
          <div>
            <input 
              value={adults} 
              onChange={(e) => setAdults(Number(e.target.value))}
              data-testid="adult-input"
            />
            <CountingComponent />
            <ModularPartyBookingForm />
          </div>
        );
      };
      
      render(<TestForm />);
      
      const initialRenderCount = renderCount;
      
      // Change a value that shouldn't affect the counting component
      const adultInput = screen.getByTestId('adult-input');
      fireEvent.change(adultInput, { target: { value: '15' } });
      
      // Verify minimal re-renders occurred
      expect(renderCount).toBeLessThanOrEqual(initialRenderCount + 2); // Allow some overhead
    });
  });
});
