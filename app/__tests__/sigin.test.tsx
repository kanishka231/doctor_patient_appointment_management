import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../auth/signin/page';
import { signIn } from 'next-auth/react';
import { act } from 'react';

// Mock the necessary dependencies
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('SignIn Component - Comprehensive Test Suite', () => {
  // UI and Rendering Tests
  describe('UI Rendering', () => {
    it('switches between sign in and register modes', () => {
      render(<SignIn />);
      
      // Initially in sign in mode
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      
      // Switch to register mode
      const switchButton = screen.getByRole('button', { name: /don't have an account\? register/i });
      fireEvent.click(switchButton);
      
      // Now in register mode
      expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it('toggles password visibility', () => {
      render(<SignIn />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', { name: '' }); // Eye/EyeOff button
      
      // Initially password is hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  // Form Submission Tests
  describe('Form Submission', () => {
    it('handles successful sign in', async () => {
      // Mock successful sign in
      (signIn as jest.Mock).mockResolvedValue({ error: null });

      render(<SignIn />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      
      // Submit form
      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
      });

      // Verify sign in was called
      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        type: 'login',
      }));
    });

    it('handles registration', async () => {
      // Mock successful registration
      (signIn as jest.Mock).mockResolvedValue({ error: null });

      render(<SignIn />);
      
      // Switch to register mode
      fireEvent.click(screen.getByRole('button', { name: /don't have an account\? register/i }));
      
      // Fill out registration form
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'newuser@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword123' } });
      
      // Submit form
      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /register/i }));
      });

      // Verify sign in was called with registration params
      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'newuser@example.com',
        password: 'newpassword123',
        name: 'John Doe',
        type: 'register',
      }));
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('displays user not found error', async () => {
      // Mock user not found error
      (signIn as jest.Mock).mockResolvedValue({ 
        error: 'User not found' 
      });

      render(<SignIn />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'nonexistent@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      
      // Submit form
      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
      });

      // Check error message
      expect(screen.getByText(/User not found\. Please register\./i)).toBeInTheDocument();
    });

    it('displays invalid credentials error', async () => {
      // Mock invalid credentials error
      (signIn as jest.Mock).mockResolvedValue({ 
        error: 'Invalid credentials' 
      });

      render(<SignIn />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
      
      // Submit form
      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
      });

      // Check error message
      expect(screen.getByText(/Invalid credentials\. Please try again\./i)).toBeInTheDocument();
    });
  });

  // Role Selection Tests
  describe('Role Selection', () => {
    it('allows selecting different roles', () => {
      render(<SignIn />);
      
      const roleSelect = screen.getByLabelText(/role/i);
      
      // Check initial role
      expect(roleSelect).toHaveValue('Doctor');
      
      // Change role
      fireEvent.change(roleSelect, { target: { value: 'Admin' } });
      expect(roleSelect).toHaveValue('Admin');
    });
  });
});