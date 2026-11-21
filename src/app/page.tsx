'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, BusFront, ChevronDown, CirclePlay,
  Clapperboard, Clock3, Gavel, Heart, MapPin, Menu, Music2, Plane,
  ShieldCheck, Sparkles, Ticket, TrainFront, Trophy, X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Category = 'Trains' | 'Flights' | 'Buses' | 'Movies' | 'Concerts' | 'Sports';
type TicketSample = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  date: string;
  original: number;
  bid: number;
  bids: number;
  ending: string;
  code: string;
  tone: string;
  tag: string;
  demoEnabled: boolean;
};
const categories: Category[] = ['Trains', 'Flights', 'Buses', 'Movies', 'Concerts', 'Sports'];
const icons: Record<Category, LucideIcon> = {
  Trains: TrainFront, Flights: Plane, Buses: BusFront,
  Movies: Clapperboard, Concerts: Music2, Sports: Trophy
};
const tickets: TicketSample[] = [
  { id: 'concert', category: 'Concerts', title: 'Afterglow Music Festival', subtitle: 'Mumbai · The Arena', date: 'SAT, 13 FEB 2027', original: 3499, bid: 2799, bids: 12, ending: '02h 34m', code: 'AFTERGLOW / 27', tone: 'violet', tag: 'HOT PICK', demoEnabled: true },
  { id: 'bus', category: 'Buses', title: 'Bhopal to Indore Sleeper', subtitle: 'Bhopal → Indore', date: 'FRI, 22 JAN 2027', original: 1299, bid: 1039, bids: 8, ending: '06h 18m', code: 'THE NIGHT RIDE', tone: 'amber', tag: 'POPULAR', demoEnabled: true },
  { id: 'sports', category: 'Sports', title: 'The City Football Final', subtitle: 'Delhi · City Stadium', date: 'SUN, 21 FEB 2027', original: 2499, bid: 1999, bids: 16, ending: '01h 48m', code: 'FINAL WHISTLE', tone: 'blue', tag: 'TRENDING', demoEnabled: true },
  { id: 'movie', category: 'Movies', title: 'Midnight Premiere · Luxe', subtitle: 'Pune · Luxe Cinema', date: 'SAT, 30 JAN 2027', original: 899, bid: 719, bids: 0, ending: 'PREVIEW', code: 'LIGHTS. CAMERA.', tone: 'rose', tag: 'CONCEPT', demoEnabled: false },
  { id: 'train', category: 'Trains', title: 'The Capital Express', subtitle: 'Bhopal → New Delhi', date: 'MON, 8 FEB 2027', original: 1850, bid: 1480, bids: 0, ending: 'PREVIEW', code: 'JOURNEY / 01', tone: 'sage', tag: 'CONCEPT', demoEnabled: false },
  { id: 'flight', category: 'Flights', title: 'Delhi to Bengaluru', subtitle: 'New Delhi → Bengaluru', date: 'THU, 11 FEB 2027', original: 6499, bid: 5199, bids: 0, ending: 'PREVIEW', code: 'UP IN THE AIR', tone: 'teal', tag: 'CONCEPT', demoEnabled: false }
];
const money = (n: number) => '₹' + n.toLocaleString('en-IN');

function TicketIcon({ category, size = 24 }: { category: Category; size?: number }) {
  const Icon = icons[category]; return <Icon size={size} strokeWidth={1.65} />;
}

function TicketCard({ ticket, onPreview }: { ticket: TicketSample; onPreview: (ticket: TicketSample) => void }) {
  return (
    <article className="ticket-card">
      <div className={'ticket-cover tone-' + ticket.tone}>
        <div className="cover-topline"><span>BM<span className="cover-star">✦</span>T ORIGINALS</span><span className="cover-status">{ticket.tag}</span></div>
        <div className="cover-graphic"><TicketIcon category={ticket.category} size={69} /></div>
        <div className="cover-bottomline"><span>{ticket.code}</span><span>NO. 0{categories.indexOf(ticket.category)+1}</span></div>
      </div>
      <div className="ticket-content">
        <div className="ticket-kind"><TicketIcon category={ticket.category} size={15} /> {ticket.category}<span className="ticket-date">{ticket.date}</span></div>
        <h3>{ticket.title}</h3>
        <p className="ticket-location"><MapPin size={14} />{ticket.subtitle}</p>
        <div className="ticket-rule" />
        <div className="ticket-price-row">
          <div><span className="overline">ILLUSTRATIVE BID</span><strong>{money(ticket.bid)}</strong></div>
          <div className="price-right"><span className="overline">ORIGINAL PRICE</span><s>{money(ticket.original)}</s></div>
        </div>
        <div className="ticket-bottom">
          <div className="ticket-small"><Clock3 size={14}/>{ticket.demoEnabled ? ticket.ending + ' left' : 'Preview only'}</div>
          <button className="card-action" onClick={() => onPreview(ticket)} aria-label={'Preview '+ticket.title}>View preview <ArrowUpRight size={16}/></button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [selected, setSelected] = useState<TicketSample | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sampleBids, setSampleBids] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const visible = useMemo(() => category === 'All' ? tickets : tickets.filter(t => t.category === category), [category]);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', close);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = previous; };
  }, [selected]);

  const currentBid = (ticket: TicketSample) => Math.min(ticket.original, ticket.bid + (sampleBids[ticket.id] ?? 0) * 50);
  const closeMenu = () => setMenuOpen(false);
  const openTicket = (ticket: TicketSample) => setSelected(ticket);
  const tryBid = (ticket: TicketSample) => {
    if (!ticket.demoEnabled) return;
    setSampleBids(previous => ({ ...previous, [ticket.id]: (previous[ticket.id] ?? 0) + 1 }));
  };
  const toggleHeart = (id: string) => setLiked(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id]);

  return (
    <div className="site">
      <div className="announcement"><span className="announce-sparkle">✦</span> THIS IS A CONCEPT EXPERIENCE <span className="announce-separator">/</span> NO SIGN-UP. NO REAL TICKETS. JUST THE IDEA.</div>
      <header className="site-header">
        <div className="shell nav-shell">
          <a href="#top" className="brand" onClick={closeMenu} aria-label="BidMyTicket home"><span className="brand-icon"><Ticket size={23} strokeWidth={1.9}/></span><span>BID<span className="brand-gold">MY</span>TICKET<span className="brand-period">.</span></span></a>
          <nav className={'nav-links '+(menuOpen ? 'open' : '')} aria-label="Main navigation">
            <a href="#explore" onClick={closeMenu}>Explore tickets</a>
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#why" onClick={closeMenu}>The idea</a>
            <a className="mobile-nav-cta" href="#explore" onClick={closeMenu}>Explore concept <ArrowUpRight size={15}/></a>
          </nav>
          <div className="nav-right"><span className="top-demo-label"><span className="status-dot"/> INTERACTIVE DEMO</span><a className="nav-cta" href="#explore">Explore concept <ArrowUpRight size={17}/></a></div>
          <button className="menu-toggle" type="button" onClick={()=>setMenuOpen(x=>!x)} aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-sheen" aria-hidden="true" />
          <div className="shell hero-layout">
            <div className="hero-copy">
              <div className="section-kicker"><span className="kicker-line"/> REIMAGINING THE TICKET EXPERIENCE</div>
              <h1>Every ticket<br/>deserves a<br/><em>second chance.</em></h1>
              <p className="hero-description">Plans change. Great experiences shouldn’t go to waste. Discover a more exciting way to explore unused tickets, powered by the thrill of an auction.</p>
              <div className="hero-buttons"><a className="button button-gold" href="#explore">Explore the demo <ArrowUpRight size={19}/></a><a className="button button-quiet" href="#how"><CirclePlay size={20}/> How it works</a></div>
              <div className="hero-proof"><div className="proof-avatars"><span>A</span><span>B</span><span>M</span></div><p><strong>Made to be explored.</strong><br/>No account. No payment. Just possibilities.</p></div>
            </div>
            <div className="hero-art" aria-label="Decorative preview of a sample ticket auction">
              <div className="halo halo-one"/><div className="halo halo-two"/><div className="hero-tiny-star tiny-one">✦</div><div className="hero-tiny-star tiny-two">✧</div>
              <div className="float-chip float-chip-top"><span className="live-pulse"/> <span>AUCTION CONCEPT</span><span className="float-chip-tiny">01 / 06</span></div>
              <div className="ticket-stack-back"/>
              <div className="hero-ticket">
                <div className="hero-ticket-top"><span className="tiny-brand"><Ticket size={18}/> BIDMYTICKET</span><span>BOARDING PASS · DEMO</span></div>
                <div className="hero-route"><div><strong>BHO</strong><small>BHOPAL</small></div><div className="route-connector"><Plane size={26}/><span/></div><div><strong>BOM</strong><small>MUMBAI</small></div></div>
                <div className="hero-ticket-info"><div><span>EXPERIENCE</span><b>THE NEXT JOURNEY</b></div><div><span>CLASS</span><b>GOLD</b></div></div>
                <div className="perforation"><span/><span className="dash-line"/><span/></div>
                <div className="hero-ticket-footer"><div><span>STARTING BID</span><strong>₹2,400</strong></div><div className="barcode" aria-hidden="true"/><div className="gold-stamp">BMT<br/>✦</div></div>
              </div>
              <div className="float-chip float-chip-bottom"><div className="mini-rise"><ArrowUpRight size={21}/></div><div><strong>What if tickets had a second life?</strong><small>A fresh way to think about resale.</small></div></div>
            </div>
          </div>
          <div className="hero-side-note">SCROLL TO EXPLORE <ArrowDownRight size={14}/></div>
        </section>

        <div className="category-ribbon" aria-label="Ticket categories"><div className="ribbon-track">{[...categories,...categories].map((cat,i)=><span key={i}>✦ <b>{cat.toUpperCase()}</b></span>)}</div></div>

        <section id="explore" className="market-section section-space">
          <div className="shell">
            <div className="section-heading"><div><div className="section-kicker"><span className="kicker-line"/> THE MARKETPLACE</div><h2>Find your <em>next moment.</em></h2><p>Flights, films, front-row energy. Take a peek at the possibilities.</p></div><span className="section-counter">01 <span>/</span> 03</span></div>
            <div className="market-toolbar"><div className="category-filter" role="group" aria-label="Filter ticket category"><button className={category==='All'?'active':''} onClick={()=>setCategory('All')}>All tickets</button>{categories.map(cat=><button key={cat} className={category===cat?'active':''} onClick={()=>setCategory(cat)}><TicketIcon category={cat} size={15}/>{cat}</button>)}</div><span className="results-count">{visible.length.toString().padStart(2,'0')} COLLECTION ITEMS</span></div>
            <div className="listing-grid">{visible.map(ticket=><TicketCard key={ticket.id} ticket={ticket} onPreview={openTicket}/>)}</div>
            <p className="market-note"><ShieldCheck size={16}/> All listings and prices are fictional examples. Some categories may prohibit resale or transfer in the real world.</p>
          </div>
        </section>

        <section id="how" className="how-section section-space">
          <div className="shell"><div className="section-heading"><div><div className="section-kicker"><span className="kicker-line"/> THE EXPERIENCE</div><h2>Simple by design.<br/><em>Exciting by nature.</em></h2></div><span className="section-counter">02 <span>/</span> 03</span></div>
            <div className="steps-grid">
              <div className="step-card"><div className="step-top"><span>01</span><Ticket size={28}/></div><div className="step-main"><h3>A ticket becomes available</h3><p>Imagine someone’s plans changing. Their eligible ticket could find a new purpose instead of going unused.</p></div><span className="step-foot">THE OPPORTUNITY <ArrowUpRight size={17}/></span></div>
              <div className="step-card"><div className="step-top"><span>02</span><Gavel size={28}/></div><div className="step-main"><h3>People join the auction</h3><p>Interested buyers place increasing bids. The countdown adds energy, while the pricing stays clear.</p></div><span className="step-foot">THE EXCITEMENT <ArrowUpRight size={17}/></span></div>
              <div className="step-card"><div className="step-top"><span>03</span><Sparkles size={28}/></div><div className="step-main"><h3>The highest bid wins</h3><p>The top eligible bidder gets the opportunity, subject to permitted transfer rules in any real product.</p></div><span className="step-foot">THE HAPPY ENDING <ArrowUpRight size={17}/></span></div>
            </div>
          </div>
        </section>

        <section id="why" className="vision-section">
          <div className="shell vision-grid"><div className="vision-copy"><div className="section-kicker dark-kicker"><span className="kicker-line"/> WHY BIDMYTICKET?</div><h2>Less waste.<br/>More <em>wonder.</em></h2><p>An unused ticket isn’t the end of the story. It’s a chance for someone else’s story to begin.</p><a className="button button-black" href="#explore">Explore the concept <ArrowUpRight size={18}/></a></div>
            <div className="vision-card"><div className="vision-caption"><Sparkles size={19}/> AN ILLUSTRATIVE EXAMPLE</div><div className="vision-stat"><span>Original ticket</span><s>₹2,000</s></div><div className="vision-stat"><span>Sample starting bid (80%)</span><strong>₹1,600</strong></div><div className="vision-line"/><div className="vision-win"><span>What could a winning bid look like?</span><strong>₹1,850 <ArrowUpRight size={21}/></strong></div><p>Conceptual figures only. Not a financial promise or real resale offer.</p></div>
          </div>
        </section>

        <section className="faq-section section-space" id="faq"><div className="shell faq-grid"><div><div className="section-kicker"><span className="kicker-line"/> GOOD TO KNOW</div><h2>Curious?<br/><em>We thought so.</em></h2><p className="faq-intro">A few quick answers about what you’re looking at.</p></div><div className="faq-list"><details><summary>Can I actually buy or sell a ticket here? <ChevronDown size={20}/></summary><p>Not yet. This is a visual concept website with fictional listings and an optional interactive auction preview. No transactions happen here.</p></details><details><summary>Do I need an account to explore? <ChevronDown size={20}/></summary><p>No. There are no logins, registration forms, or personal ticket submissions on this demo site.</p></details><details><summary>How does the auction preview work? <ChevronDown size={20}/></summary><p>Choose a ticket marked interactive demo and try increasing the sample bid. The amount changes only on your screen and resets on refresh.</p></details><details><summary>Can every ticket be transferred? <ChevronDown size={20}/></summary><p>No. Providers set their own transfer and resale rules. Train and flight tickets are often non-transferable. Any future real marketplace would need to enforce these restrictions.</p></details></div></div></section>

        <section className="final-banner"><div className="shell final-content"><div className="final-star">✦</div><div className="section-kicker final-kicker">THIS IS JUST THE BEGINNING</div><h2>Good stories deserve<br/><em>an encore.</em></h2><p>Explore the idea. Imagine the possibilities. One ticket, a whole new story.</p><a href="#explore" className="button button-gold">See the demo tickets <ArrowUpRight size={19}/></a></div></section>
      </main>
      <footer className="footer"><div className="shell footer-top"><a className="brand footer-brand" href="#top"><span className="brand-icon"><Ticket size={21}/></span><span>BID<span className="brand-gold">MY</span>TICKET<span className="brand-period">.</span></span></a><div className="footer-links"><a href="#explore">Explore</a><a href="#how">How it works</a><a href="#why">Our idea</a><a href="#faq">FAQ</a></div></div><div className="shell footer-bottom"><span>© 2026 BIDMYTICKET. BUILT TO REIMAGINE THE POSSIBLE.</span><span>AN INTERACTIVE DESIGN CONCEPT · NOT A BOOKING PLATFORM</span></div></footer>

      {selected && <div className="modal-backdrop" onMouseDown={(e)=>{if(e.target===e.currentTarget)setSelected(null);}}><section role="dialog" aria-modal="true" aria-labelledby="preview-title" className="preview-modal"><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close preview"><X size={21}/></button><span className="modal-kicker"><span className="status-dot"/> TICKET CONCEPT / NO REAL TRANSACTION</span><div className="modal-top"><div className={'modal-symbol tone-'+selected.tone}><TicketIcon category={selected.category} size={42}/></div><div><span className="modal-category">{selected.category} · {selected.date}</span><h2 id="preview-title">{selected.title}</h2><p>{selected.subtitle}</p></div></div><div className="modal-price-panel"><div><span>Sample highest bid</span><strong>{money(currentBid(selected))}</strong></div><span className="modal-price-comparison">Original {money(selected.original)}</span></div><div className="modal-meta"><div><span><Gavel size={15}/> Sample bids</span><strong>{selected.bids+(sampleBids[selected.id]??0)}</strong></div><div><span><Clock3 size={15}/> Concept auction</span><strong>{selected.demoEnabled ? (seconds%2===0?'ACTIVE DEMO':'TRY A BID') : 'PREVIEW ONLY'}</strong></div></div>{selected.demoEnabled?<><button className="button button-gold modal-bid" onClick={()=>tryBid(selected)} disabled={currentBid(selected)+50>selected.original}>Try a sample bid <ArrowUpRight size={18}/> <span>+ ₹50</span></button><button className={'save-preview '+(liked.includes(selected.id)?'saved':'')} onClick={()=>toggleHeart(selected.id)}><Heart size={17} fill={liked.includes(selected.id)?'currentColor':'none'}/>{liked.includes(selected.id)?'Saved to this demo session':'Save to this demo session'}</button></>:<div className="modal-restricted"><ShieldCheck size={20}/> This category is shown for illustration only. Real-world transfer rules may restrict resale.</div>}<p className="modal-disclaimer">This is a design simulation only. No account, payment, sale, reservation, or ticket transfer takes place. Nothing is saved to a database.</p></section></div>}
    </div>
  );
}
