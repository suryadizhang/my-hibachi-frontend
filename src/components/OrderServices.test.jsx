import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import OrderServices from './OrderServices';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

test('renders booking form', () => {
    render(<OrderServices />);
    expect(screen.getByText(/Order & Book a Service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
});

test('shows success message after booking', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 0, '6:00 PM': 0, '9:00 PM': 0 } });
    axios.post.mockResolvedValueOnce({ data: { message: 'Booking submitted!' } });

    render(<OrderServices />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Contact Preference/i), { target: { value: 'text' } });
    fireEvent.change(screen.getByLabelText(/Time Slot/i), { target: { value: '12:00 PM' } });

    // Select the 20th (or later) as the booking date
    const dateInput = screen.getAllByRole('textbox')[0];
    fireEvent.focus(dateInput);
    fireEvent.keyDown(dateInput, { key: 'ArrowDown', code: 'ArrowDown' });
    const days = await screen.findAllByRole('option', { name: /20/ });
    const enabledDay = days.find(d => d.getAttribute('aria-disabled') !== 'true');
    fireEvent.click(enabledDay);

    fireEvent.click(screen.getByText(/Submit Booking/i));
    const modalConfirmBtn = await screen.findByRole('button', { name: /^Confirm$/i });
    fireEvent.click(modalConfirmBtn);

    await waitFor(() => {
        expect(screen.getByText(/Booking submitted!/i)).toBeInTheDocument();
    });
});

test('shows error if booking less than 2 days in advance', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 0, '6:00 PM': 0, '9:00 PM': 0 } });

    render(<OrderServices />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '456 Main St' } });
    fireEvent.change(screen.getByLabelText(/Contact Preference/i), { target: { value: 'call' } });
    fireEvent.change(screen.getByLabelText(/Time Slot/i), { target: { value: '3:00 PM' } });

    // Set a date less than 2 days in advance (should keep submit disabled)
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: '06/19/2025' } });

    expect(screen.getByText(/Submit Booking/i)).toBeDisabled();
});

test('shows error message on booking failure', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 0, '6:00 PM': 0, '9:00 PM': 0 } });
    axios.post.mockRejectedValueOnce({ response: { data: { detail: 'Booking failed.' } } });

    render(<OrderServices />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Eve' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '5555555555' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'eve@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '789 Main St' } });
    fireEvent.change(screen.getByLabelText(/Contact Preference/i), { target: { value: 'email' } });
    fireEvent.change(screen.getByLabelText(/Time Slot/i), { target: { value: '6:00 PM' } });

    // Select the 20th as the booking date
    const dateInput = screen.getAllByRole('textbox')[0];
    fireEvent.focus(dateInput);
    fireEvent.keyDown(dateInput, { key: 'ArrowDown', code: 'ArrowDown' });
    const allDay20s = await screen.findAllByRole('option', { name: /20/ });
    const enabledDay20 = allDay20s.find(d => d.getAttribute('aria-disabled') !== 'true');
    fireEvent.click(enabledDay20);

    fireEvent.click(screen.getByText(/Submit Booking/i));
    const confirmBtns = await screen.findAllByText(/Confirm/i);
    fireEvent.click(confirmBtns.find(btn => btn.tagName === 'BUTTON'));

    await waitFor(() => {
        expect(screen.getByText(/Booking failed/i)).toBeInTheDocument();
    });
});

test('disables fully booked time slots', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 2, '3:00 PM': 0, '6:00 PM': 1, '9:00 PM': 2 } });

    render(<OrderServices />);
    const select = await screen.findByLabelText(/Time Slot/i);
    expect(select).toBeInTheDocument();
    expect(select.querySelector('option[value="12:00 PM"]')).toBeDisabled();
    expect(select.querySelector('option[value="9:00 PM"]')).toBeDisabled();
    expect(select.querySelector('option[value="3:00 PM"]')).not.toBeDisabled();
    expect(select.querySelector('option[value="6:00 PM"]')).not.toBeDisabled();
});

test('shows waitlist button when all slots are fully booked', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 2, '3:00 PM': 2, '6:00 PM': 2, '9:00 PM': 2 } });

    render(<OrderServices />);
    await waitFor(() => {
        expect(screen.getByText(/Join Waitlist/i)).toBeInTheDocument();
        expect(screen.getByText(/All time slots are fully booked/i)).toBeInTheDocument();
    });
});

test('shows next available date when all slots are fully booked', async () => {
    axios.get
        .mockResolvedValueOnce({ data: { '12:00 PM': 2, '3:00 PM': 2, '6:00 PM': 2, '9:00 PM': 2 } }) // initial
        .mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 0, '6:00 PM': 0, '9:00 PM': 0 } }); // next day

    render(<OrderServices />);
    await waitFor(() => {
        expect(screen.getByText(/Next available date:/i)).toBeInTheDocument();
    });
});

test('modal closes on cancel', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 0, '6:00 PM': 0, '9:00 PM': 0 } });

    render(<OrderServices />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1111111111' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Test Address' } });
    fireEvent.change(screen.getByLabelText(/Contact Preference/i), { target: { value: 'call' } });
    fireEvent.change(screen.getByLabelText(/Time Slot/i), { target: { value: '3:00 PM' } });

    // Select the 20th as the booking date
    const dateInput = screen.getAllByRole('textbox')[0];
    fireEvent.focus(dateInput);
    fireEvent.keyDown(dateInput, { key: 'ArrowDown', code: 'ArrowDown' });
    const allDay20s = await screen.findAllByRole('option', { name: /20/ });
    const enabledDay20 = allDay20s.find(d => d.getAttribute('aria-disabled') !== 'true');
    fireEvent.click(enabledDay20);

    fireEvent.click(screen.getByText(/Submit Booking/i));
    fireEvent.click(screen.getAllByText(/Cancel/i)[0]);
    expect(screen.queryByText(/Confirm Booking/i)).not.toBeInTheDocument();
});

test('shows error message if API returns array of errors', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 0, '6:00 PM': 0, '9:00 PM': 0 } });
    axios.post.mockRejectedValueOnce({
        response: { data: { detail: [{ msg: 'Invalid phone' }, { msg: 'Invalid email' }] } }
    });

    render(<OrderServices />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Test Address' } });
    fireEvent.change(screen.getByLabelText(/Contact Preference/i), { target: { value: 'call' } });
    fireEvent.change(screen.getByLabelText(/Time Slot/i), { target: { value: '3:00 PM' } });

    // Select the 20th as the booking date
    const dateInput = screen.getAllByRole('textbox')[0];
    fireEvent.focus(dateInput);
    fireEvent.keyDown(dateInput, { key: 'ArrowDown', code: 'ArrowDown' });
    const allDay20s = await screen.findAllByRole('option', { name: /20/ });
    const enabledDay20 = allDay20s.find(d => d.getAttribute('aria-disabled') !== 'true');
    fireEvent.click(enabledDay20);

    fireEvent.click(screen.getByText(/Submit Booking/i));
    const confirmBtns = await screen.findAllByText(/Confirm/i);
    fireEvent.click(confirmBtns.find(btn => btn.tagName === 'BUTTON'));

    await waitFor(() => {
        expect(screen.getByText(/Invalid phone, Invalid email/i)).toBeInTheDocument();
    });
});

test('shows correct slot status indicators', async () => {
    axios.get.mockResolvedValueOnce({ data: { '12:00 PM': 0, '3:00 PM': 1, '6:00 PM': 2, '9:00 PM': 0 } });

    render(<OrderServices />);
    expect(await screen.findByText((content, node) =>
        node.textContent === '12:00 PM:Available'
    )).toBeInTheDocument();
    expect(screen.getByText((content, node) =>
        node.textContent === '3:00 PM:1 left'
    )).toBeInTheDocument();
    expect(screen.getByText((content, node) =>
        node.textContent === '6:00 PM:Fully booked'
    )).toBeInTheDocument();
    expect(screen.getByText((content, node) =>
        node.textContent === '9:00 PM:Available'
    )).toBeInTheDocument();
});

test('shows success message after booking', async () => {
  render(<OrderServices />);
  
  // Wrap interactions causing state changes in act
  await act(async () => {
    const dateInput = screen.getByRole('textbox');
    fireEvent.change(dateInput, { target: { value: '06/20/2025' } });
    
    const submitBtn = screen.getByText(/Submit Booking/i);
    fireEvent.click(submitBtn);
    
    const confirmBtn = screen.getByText(/Confirm/i);
    fireEvent.click(confirmBtn);
  });

  // Wait for the success message
  await waitFor(() => {
    expect(screen.getByText(/Booking submitted!/i)).toBeInTheDocument();
  });
});