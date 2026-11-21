# BidMyTicket 🎟️

**Your Ticket. Their Opportunity.**

A premium black-and-gold ticket auction **frontend demo** built using Next.js, React and TypeScript.

## Browser-only setup (GitHub Codespaces)

1. On the repository page, select **Code → Codespaces → Create codespace on main**.
2. In the terminal run \`npm install\`.
3. Run \`npm run dev\`.
4. Open the forwarded port **3000** in your browser.

To check the production build: \`npm run build\`. To lint: \`npm run lint\`.

## Features

- Premium, mobile-responsive black-and-gold homepage
- Six categories: trains, flights, buses, movies, concerts and sports
- Browse and filter sample listings
- Ticket details with countdown and demo bid history
- Simulated bid validation and browser-local bid persistence
- Watchlist and dashboard
- Ticket listing drafts, with suggested 80% starting price
- Demo account interface with no real sign-in

## Important limits

This is a **prototype**. Data is saved in the current browser's localStorage, not a real database. Demo bid state does not synchronize across users and is not secure for real money. There is no real authentication, payments, ticket verification or transfer.

All example tickets and bids are fictitious. Newly created listings are marked restricted, and example train/flight/movie tickets cannot receive even simulated bids. Before real operations, verify provider transfer permission, add server-verified bidding, document security, payment protection and regulatory review.

## Next steps

Supabase database and login → provider eligibility and admin verification → transactional auction engine → supported payments and authorized ticket transfers → deployment.
