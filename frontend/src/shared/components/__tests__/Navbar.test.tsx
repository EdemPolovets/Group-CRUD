import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders the navbar with correct title', () => {
    render(<Navbar />);
    expect(screen.getByText(/Todo App/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    
    // Check for main navigation links
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<Navbar />);
    
    // Check for main container classes
    expect(screen.getByRole('navigation')).toHaveClass('bg-white', 'shadow-md');
    
    // Check for link container classes
    expect(screen.getByRole('list')).toHaveClass('flex', 'space-x-4');
  });
}); 