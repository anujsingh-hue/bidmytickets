import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'BidMyTicket | Every Ticket Deserves a Second Chance',
  description: 'Explore a premium ticket auction concept. Six categories, interactive previews, no signup or payment. Demo only.',
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
