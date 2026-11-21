'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, BusFront, CheckCircle2, ChevronDown, CirclePlay,
  Clapperboard, Clock3, Gavel, Heart, MapPin, Menu, Music2, Plane,
  RotateCcw, ShieldCheck, Sparkles, Ticket, TrainFront, Trophy, X
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
          <button className="card-action" onClick={() => onPreview(ticket)} aria-label={ticket.demoEnabled ? 'Enter bidding arena for '+ticket.title : 'Preview '+ticket.title}>{ticket.demoEnabled?'Enter arena':'View concept'} <ArrowUpRight size={16}/></button>
        </div>
      </div>
    </article>
  );
}


const BID_STEP = 50;

function BiddingArena({ ticket, onClose }: { ticket: TicketSample; onClose: () => void }) {
  const [placedBids, setPlacedBids] = useState<number[]>([]);
  const [offer, setOffer] = useState(String(ticket.bid + BID_STEP));
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const duration = ticket.ending.match(/(\d+)h\s+(\d+)m/);
    return duration ? (Number(duration[1]) * 60 + Number(duration[2])) * 60 : 0;
  });
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = placedBids.length ? placedBids[placedBids.length - 1] : ticket.bid;
  const minBid = current + BID_STEP;
  const atLimit = minBid > ticket.original;
  const ended = secondsLeft <= 0 && ticket.demoEnabled;
  const count = ticket.bids + placedBids.length;
  const suggested = [minBid, minBid + 50, minBid + 150].filter(amount => amount <= ticket.original);
  const offerNumber = Number(offer);
  const validOffer = /^\d+$/.test(offer.trim()) && Number.isSafeInteger(offerNumber) &&
    offerNumber >= minBid && offerNumber <= ticket.original;
  const timerText = String(Math.floor(secondsLeft / 3600)).padStart(2, '0') + ':' +
    String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0') + ':' +
    String(secondsLeft % 60).padStart(2, '0');

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )).filter(element => element.getClientRects().length > 0);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (!ticket.demoEnabled) return;
    const interval = window.setInterval(() => setSecondsLeft(time => Math.max(0, time - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [ticket.demoEnabled]);

  function placeBid() {
    if (!ticket.demoEnabled || ended || atLimit) return;
    if (!validOffer) {
      setFeedback({ kind: 'error', text: 'Enter a whole-rupee amount between ' + money(minBid) + ' and ' + money(ticket.original) + '.' });
      return;
    }
    setPlacedBids(previous => [...previous, offerNumber]);
    setFeedback({ kind: 'success', text: 'Your ' + money(offerNumber) + ' demo bid is now leading this simulated auction.' });
    setOffer(String(offerNumber + BID_STEP));
  }

  function resetDemo() {
    setPlacedBids([]);
    setOffer(String(ticket.bid + BID_STEP));
    setFeedback(null);
    setSaved(false);
  }

  const timeline = [
    ...placedBids.map((amount, index) => ({ amount, label: 'You · demo visitor', when: index === placedBids.length - 1 ? 'JUST NOW' : 'EARLIER THIS SESSION', yours: true })).reverse(),
    ...[0, 1, 2].map((index) => ({
      amount: ticket.bid - index * 70,
      label: ['Demo bidder C', 'Demo bidder B', 'Demo bidder A'][index],
      when: ['2 MIN AGO', '5 MIN AGO', '8 MIN AGO'][index],
      yours: false
    }))
  ];

  return (
    <div className="modal-backdrop arena-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="arena" role="dialog" aria-modal="true" aria-labelledby="arena-title" aria-describedby="arena-disclaimer">
        <div className="arena-topbar">
          <div className="arena-heading-small"><span className="arena-monogram">B<span>✦</span>T</span><span>THE BIDMYTICKET EXPERIENCE <small> / AUCTION ARENA 01</small></span></div>
          <button type="button" ref={closeRef} className="arena-close" onClick={onClose} aria-label="Close bidding arena"><X size={20}/></button>
        </div>
        <div className="arena-layout">
          <div className="arena-left">
            <div className={'arena-art tone-' + ticket.tone}>
              <div className="arena-art-top"><span>✦ BMT ORIGINALS</span><span className="arena-art-tag">{ticket.demoEnabled ? 'SIMULATION ONLY' : 'CONCEPT PREVIEW'}</span></div>
              <div className="arena-art-symbol"><TicketIcon category={ticket.category} size={89}/></div>
              <div className="arena-art-bottom"><span>{ticket.code}</span><span>VOL. 001 / {ticket.category.toUpperCase()}</span></div>
            </div>
            <div className="arena-about">
              <div className="arena-eyebrow">FEATURED EXPERIENCE <span>·</span> {ticket.category.toUpperCase()}</div>
              <h2 id="arena-title">{ticket.title}</h2>
              <p><MapPin size={14}/>{ticket.subtitle} <span>·</span> {ticket.date}</p>
            </div>
            <div className="arena-stats">
              <div><span>ORIGINAL PRICE</span><strong>{money(ticket.original)}</strong></div>
              <div><span>SUGGESTED START</span><strong>{money(Math.round(ticket.original * 0.8))}</strong></div>
              <div><span>DEMO BIDS</span><strong>{count.toString().padStart(2,'0')}</strong></div>
            </div>
            <div className="arena-note"><ShieldCheck size={17}/><span>Fictional listings. This experience does not verify tickets, collect information or process payments.</span></div>
          </div>
          <div className="arena-right">
            <div className="arena-status"><span><span className="live-pulse"/> {ticket.demoEnabled ? 'INTERACTIVE AUCTION DEMO' : 'DISPLAY-ONLY CONCEPT'}</span><span>NO SIGN-UP NEEDED</span></div>
            <div className="arena-current">
              <div className="arena-overline">CURRENT HIGHEST DEMO BID</div>
              <div className="arena-current-row"><strong key={current} className="arena-current-number">{money(current)}</strong><div className="arena-price-up"><ArrowUpRight size={16}/> EXAMPLE</div></div>
              <div className="arena-price-sub">Compared with original price <s>{money(ticket.original)}</s></div>
            </div>
            <div className="arena-timebar">
              <div><span className="arena-time-label"><Clock3 size={16}/> SIMULATED TIME REMAINING</span><strong data-testid="arena-timer">{ticket.demoEnabled ? timerText : 'NOT AVAILABLE'}</strong></div>
              <div className="arena-progress"><span style={{ width: ticket.demoEnabled ? Math.max(0, Math.min(100, secondsLeft / (3 * 3600) * 100)) + '%' : '0%' }}/></div>
            </div>
            {ticket.demoEnabled ? <>
              <div className="arena-bid-form">
                <div className="arena-block-title"><span>01 / PLACE YOUR DEMO BID</span><span className="arena-step">+ {money(BID_STEP)} MIN. INCREMENT</span></div>
                <div className="arena-suggested" role="group" aria-label="Suggested sample bid amounts">
                  {suggested.map(amount => <button type="button" key={amount} className={'arena-chip ' + (offer === String(amount) ? 'chosen' : '')} onClick={() => { setOffer(String(amount)); setFeedback(null); }}>{money(amount)}</button>)}
                </div>
                <label className="arena-input-label" htmlFor="bid-amount">Or enter your own amount</label>
                <div className="arena-input-wrap"><span>₹</span><input id="bid-amount" name="bid-amount" type="number" inputMode="numeric" min={minBid} max={ticket.original} step="1" value={offer} onChange={event => { setOffer(event.target.value); setFeedback(null); }} placeholder="Enter amount" disabled={atLimit || ended}/><span>INR</span></div>
                <div className="arena-range"><span>Minimum next bid: {money(minBid)}</span><span>Demo cap: {money(ticket.original)}</span></div>
                <button className="arena-submit" type="button" onClick={placeBid} disabled={atLimit || ended}>
                  <Gavel size={19}/>{atLimit ? 'Demo price ceiling reached' : ended ? 'Simulation finished' : 'Place demo bid'}<ArrowUpRight size={18}/>
                </button>
                {feedback && <div className={'arena-feedback ' + feedback.kind} role="status">{feedback.kind === 'success' ? <CheckCircle2 size={18}/> : <X size={18}/>}<span>{feedback.text}</span></div>}
                {atLimit && !feedback && <div className="arena-feedback success" role="status"><CheckCircle2 size={18}/>The next bid would exceed this demo’s original ticket price.</div>}
              </div>
              <div className="arena-bid-footer">
                <button className={'arena-save ' + (saved ? 'is-saved' : '')} type="button" onClick={() => setSaved(value => !value)}><Heart size={15} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved for this session' : 'Save for this session'}</button>
                <button className="arena-reset" type="button" onClick={resetDemo}><RotateCcw size={14}/>Reset simulation</button>
              </div>
              <div className="arena-history">
                <div className="arena-block-title"><span>02 / SAMPLE BID HISTORY</span><span>{count} TOTAL DEMO BIDS</span></div>
                <ol>{timeline.map((item, index) => <li key={item.yours ? 'your-' + index : 'seed-' + index} className={item.yours ? 'own-bid' : ''}>
                  <span className="arena-avatar">{item.yours ? 'YOU' : 'D' + (3 - index + placedBids.length)}</span>
                  <span className="arena-history-person"><strong>{item.label}</strong><small>{item.when}</small></span>
                  <strong className="arena-history-amount">{money(item.amount)}</strong>
                </li>)}</ol>
              </div>
            </> : <div className="arena-restricted"><ShieldCheck size={22}/><div><strong>This is a visual-only ticket category.</strong><p>Real transfers may be limited by the railway, airline, cinema or organizer. Bidding controls are intentionally unavailable in this concept.</p></div></div>}
            <p className="arena-disclaimer" id="arena-disclaimer">DESIGN SIMULATION ONLY. ALL LISTINGS AND BID ACTIVITY ARE FICTIONAL. NOTHING IS SAVED TO A SERVER, AND NO REAL PURCHASE OR TRANSFER OCCURS.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [selected, setSelected] = useState<TicketSample | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const visible = useMemo(() => category === 'All' ? tickets : tickets.filter(t => t.category === category), [category]);

  const closeMenu = () => setMenuOpen(false);
  const openTicket = (ticket: TicketSample) => setSelected(ticket);

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
            <div className="section-heading"><div><div className="section-kicker"><span className="kicker-line"/> THE MARKETPLACE</div><h2>Find your <em>next moment.</em></h2><p>Flights, films, front-row energy. Take a peek at the possibilities. Open an interactive card to enter the Bidding Arena.</p></div><span className="section-counter">01 <span>/</span> 03</span></div>
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

        <section className="faq-section section-space" id="faq"><div className="shell faq-grid"><div><div className="section-kicker"><span className="kicker-line"/> GOOD TO KNOW</div><h2>Curious?<br/><em>We thought so.</em></h2><p className="faq-intro">A few quick answers about what you’re looking at.</p></div><div className="faq-list"><details><summary>Can I actually buy or sell a ticket here? <ChevronDown size={20}/></summary><p>Not yet. This is a visual concept website with fictional listings and an optional interactive auction preview. No transactions happen here.</p></details><details><summary>Do I need an account to explore? <ChevronDown size={20}/></summary><p>No. There are no logins, registration forms, or personal ticket submissions on this demo site.</p></details><details><summary>How does the auction preview work? <ChevronDown size={20}/></summary><p>Open the Bidding Arena, choose a suggested amount or enter a custom demo bid, and watch the fictional bid timeline update. The sample data resets on refresh.</p></details><details><summary>Can every ticket be transferred? <ChevronDown size={20}/></summary><p>No. Providers set their own transfer and resale rules. Train and flight tickets are often non-transferable. Any future real marketplace would need to enforce these restrictions.</p></details></div></div></section>

        <section className="final-banner"><div className="shell final-content"><div className="final-star">✦</div><div className="section-kicker final-kicker">THIS IS JUST THE BEGINNING</div><h2>Good stories deserve<br/><em>an encore.</em></h2><p>Explore the idea. Imagine the possibilities. One ticket, a whole new story.</p><a href="#explore" className="button button-gold">See the demo tickets <ArrowUpRight size={19}/></a></div></section>
      </main>
      <footer className="footer"><div className="shell footer-top"><a className="brand footer-brand" href="#top"><span className="brand-icon"><Ticket size={21}/></span><span>BID<span className="brand-gold">MY</span>TICKET<span className="brand-period">.</span></span></a><div className="footer-links"><a href="#explore">Explore</a><a href="#how">How it works</a><a href="#why">Our idea</a><a href="#faq">FAQ</a></div></div><div className="shell footer-bottom"><span>© 2026 BIDMYTICKET. BUILT TO REIMAGINE THE POSSIBLE.</span><span>AN INTERACTIVE DESIGN CONCEPT · NOT A BOOKING PLATFORM</span></div></footer>

      {selected && <BiddingArena key={selected.id} ticket={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
