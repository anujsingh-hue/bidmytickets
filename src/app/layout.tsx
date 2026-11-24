import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'BidMyTicket | Every Ticket Deserves a Second Chance',
  description: 'Discover event tickets, transparent bidding and policy-based fair resale. Presentation sandbox.',
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
