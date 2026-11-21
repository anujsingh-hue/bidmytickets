import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'BidMyTicket | Your Ticket. Their Opportunity.', description: 'A premium demo ticket auction marketplace.' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang='en'><body>{children}</body></html>}
