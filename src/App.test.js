import { render, screen } from '@testing-library/react';
import Appointments from './components/Appointments'

test('renders learn react link', () => {
  render(<Appointments />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
