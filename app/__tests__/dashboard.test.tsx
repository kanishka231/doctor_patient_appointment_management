import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardHeader from '@/components/DashboardHeader';

import Sidebar from '@/components/SideBar';
import SearchBar from '@/components/Searchbar';
import { signOut } from 'next-auth/react';


describe('DashboardHeader Component', () => {
  // Mock functions for props
  const mockOnSearch = jest.fn();
  const mockOnAddAppointment = jest.fn();

  // Reusable render function
  const renderComponent = () => {
    return render(
      <DashboardHeader 
        onSearch={mockOnSearch} 
        onAddAppointment={mockOnAddAppointment} 
      />
    );
  };

  // Rendering Tests
  describe('Rendering', () => {
    it('renders the header component', () => {
      renderComponent();
      
      // Check key elements are present
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('displays search bar', () => {
      renderComponent();
      
      // Assuming the SearchBar component has a placeholder or label
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('renders Add Appointment button', () => {
      renderComponent();
      
      const addButton = screen.getByRole('button', { name: /add appointment/i });
      expect(addButton).toBeInTheDocument();
    });

    it('renders notification and user icons', () => {
      renderComponent();
      
      // Check for icon presence (this might need adjustment based on exact icon rendering)
      const bellIcon = screen.getByTestId('bell-icon'); // You might need to add data-testid to the icon
      const userIcon = screen.getByTestId('user-icon'); // You might need to add data-testid to the icon
      
      expect(bellIcon).toBeInTheDocument();
      expect(userIcon).toBeInTheDocument();
    });
  });

  // Interaction Tests
  describe('Interactions', () => {
    it('calls onSearch when search term is entered', () => {
      renderComponent();
      
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });

    it('calls onAddAppointment when Add Appointment button is clicked', () => {
      renderComponent();
      
      const addButton = screen.getByRole('button', { name: /add appointment/i });
      fireEvent.click(addButton);
      
      expect(mockOnAddAppointment).toHaveBeenCalled();
    });
  });

  // Styling and Accessibility Tests
  describe('Styling and Accessibility', () => {
    it('has correct background color', () => {
      renderComponent();
      
      const header = screen.getByRole('banner');
      expect(header).toHaveStyle('background: #e0f6d8');
    });

    it('has appropriate aria labels', () => {
      renderComponent();
      
      const addButton = screen.getByRole('button', { name: /add appointment/i });
      expect(addButton).toHaveAttribute('aria-label', 'Add Appointment');
      
      // Add more specific aria-label checks as needed
    });
  });

  // Edge Case Tests
  describe('SearchBar Component', () => {
    // Mock function for onSearch prop
    const mockOnSearch = jest.fn();
  
    // Reusable render function
    const renderComponent = () => {
      return render(<SearchBar onSearch={mockOnSearch} />);
    };
  
    // Rendering Tests
    describe('Rendering', () => {
      it('renders the search input', () => {
        renderComponent();
        
        const searchInput = screen.getByPlaceholderText('Search appointments');
        expect(searchInput).toBeInTheDocument();
      });
  
      it('displays search icon', () => {
        renderComponent();
        
        const searchIcon = screen.getByTestId('search-icon'); // You might need to add data-testid to the SearchOutlined icon
        expect(searchIcon).toBeInTheDocument();
      });
  
      it('has correct placeholder text', () => {
        renderComponent();
        
        const searchInput = screen.getByPlaceholderText('Search appointments');
        expect(searchInput).toHaveAttribute('placeholder', 'Search appointments');
      });
    });
});

jest.mock('next-auth/react', () => ({
    signOut: jest.fn()
  }));
  
  describe('Sidebar Component', () => {
    // Reusable render function
    const renderComponent = (props = {}) => {
      const defaultProps = {
        activeItem: 'Dashboard',
        onItemSelect: jest.fn()
      };
      return render(<Sidebar {...defaultProps} {...props} />);
    };
  
    // Rendering Tests
    describe('Rendering', () => {
      it('renders the Sidebar component', () => {
        renderComponent();
        
        // Check Medvise logo
        const logo = screen.getByText('MEDVISE');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveClass('text-green-600');
      });
  
      it('renders all navigation items', () => {
        renderComponent();
        
        const navItems = [
          'Dashboard',
          'Appointments',
          'Help & Support',
          'Logout'
        ];
  
        navItems.forEach(item => {
          const navItem = screen.getByText(item);
          expect(navItem).toBeInTheDocument();
        });
      });
  
      it('highlights active navigation item', () => {
        renderComponent({ activeItem: 'Appointments' });
        
        const appointmentsItem = screen.getByText('Appointments');
        expect(appointmentsItem).toHaveClass('bg-green-100');
        expect(appointmentsItem).toHaveClass('text-green-700');
      });
  
      it('renders in-progress section', () => {
        renderComponent();
        
        const inProgressTitle = screen.getByText('IN PROGRESS');
        const inProgressText = screen.getByText('Your appointments haven\'t started for today');
        
        expect(inProgressTitle).toBeInTheDocument();
        expect(inProgressText).toBeInTheDocument();
      });
    });
  
    // Interaction Tests
    describe('Interactions', () => {
      it('calls onItemSelect when nav item is clicked', () => {
        const mockOnItemSelect = jest.fn();
        renderComponent({ onItemSelect: mockOnItemSelect });
        
        const appointmentsItem = screen.getByText('Appointments');
        fireEvent.click(appointmentsItem);
        
        expect(mockOnItemSelect).toHaveBeenCalledWith('Appointments');
      });
  
      it('calls signOut when Logout is clicked', () => {
        renderComponent();
        
        const logoutItem = screen.getByText('Logout');
        fireEvent.click(logoutItem);
        
        expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/auth/signin" });
      });
    });
  
    // Styling and Accessibility Tests
    describe('Styling and Accessibility', () => {
      it('has correct styling for sidebar', () => {
        renderComponent();
        
        const sidebar = screen.getByText('MEDVISE').closest('div');
        expect(sidebar).toHaveClass('bg-white');
        expect(sidebar).toHaveClass('h-screen');
        expect(sidebar).toHaveClass('w-64');
      });
  
      it('has hover effects on nav items', () => {
        renderComponent();
        
        const helpItem = screen.getByText('Help & Support');
        expect(helpItem).toHaveClass('hover:bg-gray-100');
      });
  
      it('has correct emoji icons for nav items', () => {
        renderComponent();
        
        const navIcons = [
          { text: 'Dashboard', emoji: '🎙' },
          { text: 'Appointments', emoji: '📅' },
          { text: 'Help & Support', emoji: '❓' },
          { text: 'Logout', emoji: '↩️' }
        ];
  
        navIcons.forEach(item => {
          const navItem = screen.getByText(item.text);
          const emojiSpan = navItem.querySelector('span');
          expect(emojiSpan).toHaveTextContent(item.emoji);
        });
      });
    });
  
    // Edge Case Tests
    describe('Edge Cases', () => {
      it('uses default active item if not provided', () => {
        renderComponent({ activeItem: undefined });
        
        const dashboardItem = screen.getByText('Dashboard');
        expect(dashboardItem).toHaveClass('bg-green-100');
        expect(dashboardItem).toHaveClass('text-green-700');
      });
    });


})

})
