import { useState, useEffect, useRef, useCallback, RefObject } from "react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface Destination {
  id: number;
  name: string;
  region: string;
  country?: string;
  rating: number;
  reviews: number;
  price: number;
  days: number;
  badge?: string;
  badgeColor?: string;
  category: string;
  image: string;
}

interface Experience {
  id: number;
  name: string;
  description: string;
  count: string;
  iconColor: string;
  iconPath: string;
}

interface JournalPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  image: string;
}

interface Testimonial {
  id: number;
  author: string;
  location: string;
  trip: string;
  initials: string;
  avatarColor: string;
  textColor: string;
  quote: string;
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const DESTINATIONS: Destination[] = [
  { id:1, name:"Bali, Indonesia", region:"Southeast Asia", country:"Indonesia", rating:4.9, reviews:1240, price:1890, days:10, badge:"Editor's Pick", badgeColor:"#C4633A", category:"asia", image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" },
  { id:2, name:"Marrakech, Morocco", region:"North Africa", country:"Morocco", rating:4.8, reviews:982, price:1490, days:7, category:"africa", image:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80" },
  { id:3, name:"Serengeti, Tanzania", region:"East Africa", country:"Tanzania", rating:4.9, reviews:654, price:3200, days:12, badge:"New", badgeColor:"#2C4A3E", category:"africa", image:"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80" },
  { id:4, name:"Machu Picchu, Peru", region:"South America", country:"Peru", rating:4.7, reviews:2100, price:2450, days:9, category:"americas", image:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80" },
  { id:5, name:"Santorini, Greece", region:"Southern Europe", country:"Greece", rating:4.9, reviews:3420, price:2100, days:8, category:"europe", image:"https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80" },
  { id:6, name:"Kyoto, Japan", region:"East Asia", country:"Japan", rating:4.9, reviews:2870, price:2780, days:11, badge:"Trending", badgeColor:"#8B3A1E", category:"asia", image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80" },
  { id:7, name:"Amalfi Coast, Italy", region:"Southern Europe", country:"Italy", rating:4.8, reviews:1880, price:2350, days:9, category:"europe", image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80" },
  { id:8, name:"Patagonia, Argentina", region:"South America", country:"Argentina", rating:4.8, reviews:740, price:3100, days:14, badge:"Adventure", badgeColor:"#1C3A2A", category:"americas", image:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
  { id:9, name:"Maldives", region:"South Asia", country:"Maldives", rating:5.0, reviews:1560, price:4200, days:7, badge:"Luxury", badgeColor:"#2A3A5C", category:"asia", image:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
];

const EXPERIENCES: Experience[] = [
  { id:1, name:"Luxury Escapes", description:"Handpicked private villas, ultra-luxury lodges and boutique hotels in the world's most coveted locations.", count:"48 curated journeys", iconColor:"#D4A84B", iconPath:"M18 3L21.5 13H32L23.5 19.5L27 29.5L18 23L9 29.5L12.5 19.5L4 13H14.5L18 3Z" },
  { id:2, name:"Adventure Trails", description:"From Himalayan treks to Patagonian hikes — for those who find themselves on the edge of the extraordinary.", count:"73 adventure routes", iconColor:"#C4633A", iconPath:"M6 30L18 6L30 30 M9 24H27" },
  { id:3, name:"Cultural Immersion", description:"Live with locals, learn ancient crafts, taste authentic cuisine. Travel as transformation, not tourism.", count:"91 cultural programs", iconColor:"#5DCAA5", iconPath:"M18 3C9.7 3 3 9.7 3 18C3 26.3 9.7 33 18 33C26.3 33 33 26.3 33 18C33 9.7 26.3 3 18 3Z M18 3C18 3 14 9.7 14 18C14 26.3 18 33 18 33C18 33 22 26.3 22 18C22 9.7 18 3 18 3Z M3 18H33" },
  { id:4, name:"Wellness Retreats", description:"Reconnect with yourself in serene sanctuaries — from Balinese spas to silent mountain meditation centers.", count:"35 retreat experiences", iconColor:"#5ca0c4", iconPath:"M4 10H32V30H4V10Z M12 10V7C12 5.9 12.9 5 14 5H22C23.1 5 24 5.9 24 7V10 M4 18H32" },
  { id:5, name:"Family Journeys", description:"Carefully designed itineraries for families seeking wonder together — safe, enriching and unforgettable.", count:"52 family packages", iconColor:"#9B6FD0", iconPath:"M6 24C6 24 10 16 18 16C26 16 30 24 30 24 M10 28H26" },
  { id:6, name:"Eco-Tourism", description:"Low-impact travel with high-impact meaning. Carbon-neutral journeys that protect the places you love.", count:"29 eco experiences", iconColor:"#4E9A6A", iconPath:"M18 6C10.3 6 4 12.3 4 20C4 27.7 10.3 34 18 34C25.7 34 32 27.7 32 20C32 12.3 25.7 6 18 6Z M18 6C18 6 14 12 14 20C14 28 18 34 18 34C18 34 22 28 22 20C22 12 18 6 18 6Z M4 20H32" },
];

const TESTIMONIALS: Testimonial[] = [
  { id:1, author:"Sophie Martin", location:"Paris, France", trip:"Bali, 10 days", initials:"SM", avatarColor:"rgba(196,99,58,0.2)", textColor:"#C4633A", quote:"Our Bali trip was beyond anything we imagined. Every detail was perfect — from the rice-terrace sunrise to the private cooking class." },
  { id:2, author:"James Okafor", location:"Lagos, Nigeria", trip:"Serengeti, 12 days", initials:"JO", avatarColor:"rgba(44,74,62,0.3)", textColor:"#5DCAA5", quote:"The Serengeti safari changed my perspective on life. Witnessing the Great Migration was the most humbling experience of my existence." },
  { id:3, author:"Ana Lima", location:"São Paulo, Brazil", trip:"Machu Picchu, 9 days", initials:"AL", avatarColor:"rgba(83,74,183,0.2)", textColor:"#AFA9EC", quote:"Wanderlust handled everything flawlessly. We just showed up and were swept away. Machu Picchu at dawn — I still get goosebumps." },
];

const JOURNAL_POSTS: JournalPost[] = [
  { id:1, title:"10 Hidden Temples of Bali You Need to Visit", excerpt:"Beyond the Instagram crowds, Bali hides ancient shrines draped in moss, reachable only by foot through rice-paddy paths.", author:"Elena Sousa", date:"Apr 12, 2026", readTime:"6 min read", tag:"Asia", image:"https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=600&q=80" },
  { id:2, title:"A First-Timer's Guide to the Serengeti Migration", excerpt:"The Great Migration is one of Earth's last great wildlife spectacles. Here's when to go, where to stay, and what to expect.", author:"Marcus Webb", date:"Mar 28, 2026", readTime:"8 min read", tag:"Africa", image:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80" },
  { id:3, title:"Slow Travel: Why We All Need to Unlearn Rushing", excerpt:"The art of lingering — how spending three weeks in one Italian village changed my entire philosophy of travel.", author:"Claire Fontaine", date:"Mar 15, 2026", readTime:"5 min read", tag:"Lifestyle", image:"https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=600&q=80" },
  { id:4, title:"Kyoto in Spring: A Cherry Blossom Guide", excerpt:"The sakura season lasts only two weeks. Plan perfectly with our neighborhood-by-neighborhood blooming timeline.", author:"Yuki Tanaka", date:"Feb 20, 2026", readTime:"7 min read", tag:"Asia", image:"https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=80" },
  { id:5, title:"Pack Like a Pro: The 28-Liter Carry-On Method", excerpt:"After 200+ trips, our lead guide distills everything you need — and nothing you don't — into a single carry-on bag.", author:"Sam Rivera", date:"Feb 5, 2026", readTime:"4 min read", tag:"Tips", image:"https://images.unsplash.com/photo-1553531384-397c80973a0b?w=600&q=80" },
  { id:6, title:"The Maldives Beyond the Overwater Bungalow", excerpt:"Reef restoration dives, local island hopping and traditional Maldivian cuisine — the side of paradise few travellers see.", author:"Priya Nair", date:"Jan 30, 2026", readTime:"6 min read", tag:"Luxury", image:"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80" },
];

const TABS = ["all", "asia", "europe", "americas", "africa"];

const NAV_LINKS = [
  { label: "Destinations", id: "destinations" },
  { label: "Experiences",  id: "experiences"  },
  { label: "About",        id: "about"         },
  { label: "Journal",      id: "journal"       },
];

const SECTION_IDS = ["hero", "destinations", "experiences", "about", "journal", "contact"];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function scrollTo(id: string): void {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────

function useMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useActiveSection(): string {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const map: Record<string, boolean> = {};
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { map[e.target.id] = e.isIntersecting; });
      const found = SECTION_IDS.find((id) => map[id]);
      if (found) setActive(found);
    }, { threshold: 0.25 });
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

function useFadeIn(): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return <span style={{ color: "#D4A84B" }}>{"★".repeat(Math.floor(rating))}</span>;
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18"
      fill={filled ? "#C4633A" : "none"}
      stroke={filled ? "#C4633A" : "rgba(245,239,224,0.6)"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

// ── DEST CARD ─────────────────────────────────────────────────────────────────

interface DestCardProps {
  dest: Destination;
  large: boolean;
  index: number;
  wishlist: Set<number>;
  onWishlist: (id: number) => void;
}

function DestCard({ dest, large, index, wishlist, onWishlist }: DestCardProps) {
  const [ref, visible] = useFadeIn();
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 3, cursor: "pointer",
        gridRow: large ? "1 / 3" : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ${index * 0.07}s, transform 0.5s ${index * 0.07}s, box-shadow 0.3s`,
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      <img src={dest.image} alt={dest.name} loading="lazy" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        transform: hovered ? "scale(1.07)" : "scale(1)",
        transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,12,8,0.9) 0%,rgba(15,12,8,0.1) 55%,transparent 100%)" }} />

      <button
        onClick={(e) => { e.stopPropagation(); onWishlist(dest.id); }}
        style={{ position: "absolute", top: "0.9rem", left: "0.9rem", background: "rgba(15,12,8,0.5)", border: "none", cursor: "pointer", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 3 }}
      >
        <Heart filled={wishlist.has(dest.id)} />
      </button>

      {dest.badge && (
        <div style={{ position: "absolute", top: "0.9rem", right: "0.9rem", background: dest.badgeColor, color: "#F5EFE0", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.3rem 0.65rem", borderRadius: 2, zIndex: 2 }}>
          {dest.badge}
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: large ? "1.8rem" : "1.2rem", zIndex: 2 }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.3rem" }}>{dest.region}</p>
        <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#F5EFE0", fontSize: large ? "2rem" : "1.2rem", lineHeight: 1.15, marginBottom: "0.5rem" }}>{dest.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.75rem", color: "#E8D9BC" }}>
          <Stars rating={dest.rating} />
          <span>{dest.rating} · {dest.reviews.toLocaleString()}</span>
          <span style={{ marginLeft: "auto", fontWeight: 500, color: "#F5EFE0", fontSize: large ? "1rem" : "0.85rem" }}>
            From ${dest.price.toLocaleString()}
          </span>
        </div>
      </div>
      <div style={{ height: large ? 580 : 240 }} />
    </div>
  );
}

// ── EXPERIENCE CARD ───────────────────────────────────────────────────────────

function ExpCard({ exp, index }: { exp: Experience; index: number }) {
  const [ref, visible] = useFadeIn();
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "1.8rem",
        border: `1px solid ${hovered ? "rgba(212,168,75,0.35)" : "rgba(245,239,224,0.08)"}`,
        borderRadius: 3, cursor: "pointer",
        background: hovered ? "rgba(212,168,75,0.04)" : "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.4s ${index * 0.07}s`,
      }}
    >
      <div style={{ width: 36, height: 36, marginBottom: "1.2rem" }}>
        <svg viewBox="0 0 36 36" fill="none" style={{ width: 36, height: 36 }}>
          {exp.iconPath.split(" M").map((seg: string, i: number) => (
            <path key={i} d={i === 0 ? seg : "M" + seg} stroke={exp.iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </svg>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#F5EFE0", marginBottom: "0.5rem" }}>{exp.name}</h3>
      <p style={{ fontSize: "0.86rem", color: "#9A9188", lineHeight: 1.65, marginBottom: "1.2rem" }}>{exp.description}</p>
      <p style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4A84B" }}>{exp.count}</p>
    </div>
  );
}

// ── JOURNAL CARD ──────────────────────────────────────────────────────────────

function JournalCard({ post, index }: { post: JournalPost; index: number }) {
  const [ref, visible] = useFadeIn();
  const [hovered, setHovered] = useState(false);
  const initials = post.author.split(" ").map((n: string) => n[0]).join("");

  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#201D18", borderRadius: 3, overflow: "hidden", cursor: "pointer",
        border: `1px solid ${hovered ? "rgba(212,168,75,0.25)" : "rgba(245,239,224,0.07)"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ${index * 0.07}s, transform 0.5s ${index * 0.07}s, border-color 0.3s`,
      }}
    >
      <div style={{ height: 200, overflow: "hidden" }}>
        <img src={post.image} alt={post.title} loading="lazy" style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.5s ease",
        }} />
      </div>
      <div style={{ padding: "1.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}>
          <span style={{ background: "rgba(212,168,75,0.12)", color: "#D4A84B", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.2rem 0.55rem", borderRadius: 2 }}>{post.tag}</span>
          <span style={{ fontSize: "0.72rem", color: "#9A9188" }}>{post.readTime}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", color: "#F5EFE0", lineHeight: 1.35, marginBottom: "0.6rem" }}>{post.title}</h3>
        <p style={{ fontSize: "0.82rem", color: "#9A9188", lineHeight: 1.6, marginBottom: "1rem" }}>{post.excerpt}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(196,99,58,0.2)", color: "#C4633A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", flexShrink: 0 }}>{initials}</div>
            <span style={{ fontSize: "0.78rem", color: "#E8D9BC" }}>{post.author}</span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "#9A9188" }}>{post.date}</span>
        </div>
      </div>
    </div>
  );
}

// ── TESTIMONIAL CARD ──────────────────────────────────────────────────────────

function QuoteCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      background: "rgba(245,239,224,0.04)", borderRadius: 3,
      border: "1px solid rgba(245,239,224,0.09)", padding: "1.8rem",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ${index * 0.1}s, transform 0.5s ${index * 0.1}s`,
    }}>
      <div style={{ color: "#D4A84B", marginBottom: "0.8rem" }}>★★★★★</div>
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontStyle: "italic", color: "#F5EFE0", lineHeight: 1.7, marginBottom: "1.2rem" }}>"{testimonial.quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: testimonial.avatarColor, color: testimonial.textColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 500 }}>{testimonial.initials}</div>
        <div>
          <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "#F5EFE0" }}>{testimonial.author}</p>
          <p style={{ fontSize: "0.72rem", color: "rgba(245,239,224,0.45)" }}>{testimonial.location} · {testimonial.trip}</p>
        </div>
      </div>
    </div>
  );
}

// ── WISHLIST MODAL ────────────────────────────────────────────────────────────

function WishlistModal({ ids, onClose }: { ids: Set<number>; onClose: () => void }) {
  const saved = DESTINATIONS.filter((d) => ids.has(d.id));
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,12,8,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#201D18", borderRadius: 4, padding: "2rem", width: "min(500px,90vw)", maxHeight: "80vh", overflowY: "auto", border: "1px solid rgba(245,239,224,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#F5EFE0" }}>My Wishlist ({saved.length})</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9A9188", cursor: "pointer", fontSize: "1.6rem", lineHeight: 1 }}>×</button>
        </div>
        {saved.length === 0 ? (
          <p style={{ color: "#9A9188", fontSize: "0.9rem" }}>No saved destinations yet. Tap the ♡ on any card.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {saved.map((d) => (
              <div key={d.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img src={d.image} alt={d.name} style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 3, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", color: "#F5EFE0" }}>{d.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "#9A9188" }}>{d.days} days · From ${d.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [showWishlist, setShowWishlist] = useState(false);
  const [journalCount, setJournalCount] = useState(3);

  const isMobile = useMobile();
  const scrollY = useScrollY();
  const activeSection = useActiveSection();

  const toggleWish = useCallback((id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const filtered = tab === "all" ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === tab);
  const scrolled = scrollY > 60;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#1A1814", color: "#F5EFE0", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {showWishlist && <WishlistModal ids={wishlist} onClose={() => setShowWishlist(false)} />}

      {/* ── MOBILE FULLSCREEN MENU ── */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#1A1814", zIndex: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.4rem", right: "1.4rem", background: "none", border: "none", color: "#9A9188", fontSize: "2rem", cursor: "pointer", lineHeight: 1 }}>×</button>
          {NAV_LINKS.map((link) => (
            <button key={link.id}
              onClick={() => { scrollTo(link.id); setMenuOpen(false); }}
              style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", color: activeSection === link.id ? "#D4A84B" : "#F5EFE0", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            >{link.label}</button>
          ))}
          <button onClick={() => { scrollTo("contact"); setMenuOpen(false); }} style={{ marginTop: "0.5rem", background: "#C4633A", color: "#F5EFE0", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.9rem 2rem", borderRadius: 2 }}>
            Plan a Trip
          </button>
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "1rem 1.2rem" : "1.1rem 3rem",
        background: scrolled ? "rgba(22,20,16,0.97)" : "linear-gradient(to bottom,rgba(22,20,16,0.8),transparent)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(245,239,224,0.07)" : "none",
        transition: "background 0.3s, border-color 0.3s",
        gap: "1rem",
      }}>
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? "1.2rem" : "1.35rem", color: "#F5EFE0", background: "none", border: "none", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
          Wanderlust
        </button>

        {/* Desktop nav links */}
        {!isMobile && (
          <ul style={{ display: "flex", gap: "1.8rem", listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button onClick={() => scrollTo(link.id)} style={{
                    color: isActive ? "#D4A84B" : "#C8BAA8",
                    fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    paddingBottom: "3px",
                    borderBottom: isActive ? "1px solid #D4A84B" : "1px solid transparent",
                    transition: "color 0.25s, border-color 0.25s",
                  }}>{link.label}</button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right side actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {/* Wishlist button */}
          <button onClick={() => setShowWishlist(true)} style={{
            background: wishlist.size > 0 ? "rgba(196,99,58,0.15)" : "rgba(245,239,224,0.07)",
            border: `1px solid ${wishlist.size > 0 ? "rgba(196,99,58,0.4)" : "rgba(245,239,224,0.12)"}`,
            color: wishlist.size > 0 ? "#C4633A" : "#C8BAA8",
            cursor: "pointer", padding: "0.45rem 0.7rem", borderRadius: 2,
            display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem",
          }}>
            <Heart filled={wishlist.size > 0} />
            {wishlist.size > 0 && <span>{wishlist.size}</span>}
          </button>

          {/* Plan a Trip — desktop only */}
          {!isMobile && (
            <button onClick={() => scrollTo("contact")} style={{
              background: "#C4633A", color: "#F5EFE0", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "0.55rem 1.1rem", borderRadius: 2, whiteSpace: "nowrap",
            }}>Plan a Trip</button>
          )}

          {/* Hamburger — mobile only, pure inline styles, no CSS classes */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: "rgba(245,239,224,0.08)",
                border: "1px solid rgba(245,239,224,0.14)",
                borderRadius: 2, cursor: "pointer",
                padding: "0.45rem 0.55rem",
                display: "flex", flexDirection: "column",
                gap: "4px", alignItems: "center", justifyContent: "center",
              }}
              aria-label="Toggle menu"
            >
              <span style={{ display: "block", width: 20, height: 2, background: "#F5EFE0", borderRadius: 1 }} />
              <span style={{ display: "block", width: 20, height: 2, background: "#F5EFE0", borderRadius: 1 }} />
              <span style={{ display: "block", width: 20, height: 2, background: "#F5EFE0", borderRadius: 1 }} />
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: "relative", height: "100vh", minHeight: 600, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80" alt="Hero landscape"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,5,0.55)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,8,5,0.88) 0%,rgba(10,8,5,0.3) 45%,transparent 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "0 clamp(1.5rem,5vw,5rem) clamp(4rem,8vw,7rem)", maxWidth: 800 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ display: "block", width: 32, height: 1, background: "#D4A84B" }} />
            Curated Journeys Since 1998
          </p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,5vw,4.8rem)", lineHeight: 1.05, fontWeight: 700, color: "#F5EFE0", marginBottom: "1.4rem" }}>
            Travel is the only thing you buy that makes you{" "}
            <em style={{ fontStyle: "italic", color: "#D4A84B" }}>richer</em>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,2vw,1.05rem)", fontWeight: 300, color: "#E8D9BC", maxWidth: 440, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            We craft extraordinary journeys to the world's most captivating places — from hidden archipelagos to ancient mountain trails.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("destinations")} style={{ background: "#C4633A", color: "#F5EFE0", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.95rem 2.2rem", borderRadius: 2 }}>Explore Destinations</button>
            <button onClick={() => scrollTo("journal")} style={{ background: "transparent", color: "#F5EFE0", border: "1px solid rgba(245,239,224,0.4)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.95rem 2.2rem", borderRadius: 2 }}>Read Our Journal</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "clamp(2rem,4vw,4rem)", right: "clamp(1.5rem,5vw,4rem)", zIndex: 2, display: "flex", gap: "clamp(1rem,2vw,1.8rem)" }}>
          {(["184", "42k", "98%"] as const).map((n, i) => {
            const labels = ["Destinations", "Travellers", "Satisfaction"];
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1rem,1.8vw,1.4rem)", color: "#D4A84B" }}>{n}</div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A9188" }}>{labels[i]}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div style={{ background: "#F5EFE0", padding: "1.6rem clamp(1rem,4vw,4rem)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", border: "1px solid #E8D9BC", borderRadius: 2, overflow: "hidden", maxWidth: 920, margin: "0 auto", boxShadow: "0 4px 20px rgba(26,24,20,0.12)" }}>
          {[
            { label: "Where to",   placeholder: "Destination or country", isSelect: false },
            { label: "Departure",  placeholder: "Choose date",            isSelect: false },
            { label: "Experience", placeholder: "",                        isSelect: true  },
          ].map((f, i) => (
            <div key={i} style={{ padding: "0.85rem 1.1rem", background: "#FDFAF4", borderRight: "1px solid #E8D9BC", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
              <label style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A9188", fontWeight: 500 }}>{f.label}</label>
              {f.isSelect ? (
                <select style={{ border: "none", outline: "none", background: "transparent", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#1A1814", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", cursor: "pointer" }}>
                  {["All types", "Adventure", "Cultural", "Luxury", "Eco-Tourism"].map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type="text" placeholder={f.placeholder} style={{ border: "none", outline: "none", background: "transparent", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#1A1814" }} />
              )}
            </div>
          ))}
          <button style={{ background: "#C4633A", color: "#F5EFE0", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 1.4rem", minHeight: 54 }}>Search</button>
        </div>
      </div>

      {/* ── DESTINATIONS ── */}
      <section id="destinations" style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,4rem)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.5rem" }}>Top Picks</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#F5EFE0", lineHeight: 1.2 }}>
              Places that will take your breath <em style={{ fontStyle: "italic", color: "#D4A84B" }}>away</em>
            </h2>
          </div>
          <span style={{ fontSize: "0.78rem", color: "#9A9188" }}>{filtered.length} destinations</span>
        </div>

        <div className="hide-scroll" style={{ display: "flex", borderBottom: "1px solid rgba(245,239,224,0.1)", overflowX: "auto", marginBottom: "2rem" }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: tab === t ? "#D4A84B" : "#9A9188",
              padding: "0.7rem 1.3rem", whiteSpace: "nowrap",
              borderBottom: `2px solid ${tab === t ? "#D4A84B" : "transparent"}`,
              marginBottom: -1, transition: "color 0.2s, border-color 0.2s",
            }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {filtered.map((d, i) => (
            <DestCard key={d.id} dest={d} large={i === 0 && tab === "all"} index={i} wishlist={wishlist} onWishlist={toggleWish} />
          ))}
        </div>
      </section>

      {/* ── EXPERIENCES ── */}
      <section id="experiences" style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,4rem)", background: "#201D18" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.5rem" }}>How We Travel</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#F5EFE0", lineHeight: 1.2 }}>
            Curated <em style={{ fontStyle: "italic", color: "#D4A84B" }}>experiences</em> for every soul
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.2rem" }}>
          {EXPERIENCES.map((exp, i) => <ExpCard key={exp.id} exp={exp} index={i} />)}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,4rem)", background: "#15120E" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.6rem" }}>Our Story</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", color: "#F5EFE0", lineHeight: 1.2, marginBottom: "1.2rem" }}>
              We believe travel is<br /><em style={{ fontStyle: "italic", color: "#D4A84B" }}>a way of being</em>
            </h2>
            <p style={{ fontSize: "0.92rem", color: "#9A9188", lineHeight: 1.75, marginBottom: "1rem" }}>
              Founded in 1998 by two restless travelers who believed the world's most extraordinary places deserved more than a two-week bus tour, Wanderlust was built on a simple conviction: travel should transform you.
            </p>
            <p style={{ fontSize: "0.92rem", color: "#9A9188", lineHeight: 1.75, marginBottom: "2rem" }}>
              Over 26 years, our team of 120 guides, fixers, and local experts across 60 countries have designed journeys for over 42,000 travellers — each one as unique as the person taking it.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
              {[["26", "Years"], ["60", "Countries"], ["120", "Expert Guides"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", color: "#D4A84B" }}>{n}</div>
                  <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A9188" }}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={() => scrollTo("contact")} style={{ background: "#C4633A", color: "#F5EFE0", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.9rem 2rem", borderRadius: 2 }}>
              Travel With Us
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="About Wanderlust"
              style={{ width: "100%", borderRadius: 3, aspectRatio: "4/5", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: "-1.5rem", left: "-1.5rem", background: "#C4633A", borderRadius: 2, padding: "1.2rem 1.6rem" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: "#F5EFE0" }}>98%</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,239,224,0.7)" }}>Customer satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,4rem)", background: "#2C4A3E" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.5rem" }}>Traveller Stories</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#F5EFE0", lineHeight: 1.2 }}>
            Words from those who've been there
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.2rem" }}>
          {TESTIMONIALS.map((t, i) => <QuoteCard key={t.id} testimonial={t} index={i} />)}
        </div>
      </section>

      {/* ── JOURNAL ── */}
      <section id="journal" style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,4rem)" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.5rem" }}>Travel Journal</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#F5EFE0", lineHeight: 1.2 }}>
            Stories, tips &amp; <em style={{ fontStyle: "italic", color: "#D4A84B" }}>inspiration</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.4rem" }}>
          {JOURNAL_POSTS.slice(0, journalCount).map((post, i) => <JournalCard key={post.id} post={post} index={i} />)}
        </div>
        {journalCount < JOURNAL_POSTS.length && (
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button onClick={() => setJournalCount((v) => Math.min(v + 3, JOURNAL_POSTS.length))} style={{
              background: "transparent", color: "#F5EFE0",
              border: "1px solid rgba(245,239,224,0.25)", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "0.9rem 2.4rem", borderRadius: 2,
            }}>Load More Articles</button>
          </div>
        )}
      </section>

      {/* ── NEWSLETTER ── */}
      <div style={{ background: "#C4633A", padding: "clamp(3rem,6vw,5rem) clamp(1rem,4vw,4rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#F5EFE0", marginBottom: "0.6rem" }}>
            Get travel inspiration in your inbox
          </h2>
          <p style={{ fontSize: "0.92rem", color: "rgba(245,239,224,0.75)", maxWidth: 380, lineHeight: 1.6 }}>
            Join 40,000+ travellers receiving curated destination guides, seasonal offers and hidden gems every week.
          </p>
        </div>
        {subscribed ? (
          <div style={{ background: "rgba(245,239,224,0.15)", borderRadius: 2, padding: "1rem 2rem", color: "#F5EFE0", fontSize: "0.9rem", flexShrink: 0 }}>✓ You're on the list!</div>
        ) : (
          <div style={{ display: "flex", flexShrink: 0, flexWrap: "wrap" }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#1A1814", background: "#FDFAF4", border: "none", outline: "none", padding: "0.9rem 1.3rem", width: "clamp(200px,30vw,280px)", borderRadius: "2px 0 0 2px" }} />
            <button onClick={() => { if (email.includes("@")) { setSubscribed(true); setEmail(""); } }} style={{
              background: "#1A1814", color: "#F5EFE0", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "0 1.4rem", borderRadius: "0 2px 2px 0", whiteSpace: "nowrap", minHeight: 46,
            }}>Subscribe</button>
          </div>
        )}
      </div>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,4rem)", background: "#15120E" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4A84B", marginBottom: "0.6rem" }}>Plan a Trip</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", color: "#F5EFE0", lineHeight: 1.2, marginBottom: "0.8rem" }}>
            Let's design your <em style={{ fontStyle: "italic", color: "#D4A84B" }}>journey</em>
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#9A9188", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Tell us your dream destination, budget, and travel style. Our curators will craft a personalised itinerary within 48 hours.
          </p>
          <div style={{ display: "grid", gap: "1rem", textAlign: "left" }}>
            {[
              { label: "Full Name",         placeholder: "Your name",                       type: "text"  },
              { label: "Email",             placeholder: "your@email.com",                  type: "email" },
              { label: "Dream Destination", placeholder: "e.g. Japan, Maldives, Patagonia", type: "text"  },
            ].map((f, i) => (
              <div key={i}>
                <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A9188", display: "block", marginBottom: "0.4rem" }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} style={{ width: "100%", background: "rgba(245,239,224,0.05)", border: "1px solid rgba(245,239,224,0.12)", borderRadius: 2, padding: "0.85rem 1rem", color: "#F5EFE0", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", outline: "none" }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A9188", display: "block", marginBottom: "0.4rem" }}>Message</label>
              <textarea placeholder="Tell us about your travel dreams, dates, group size..." rows={4} style={{ width: "100%", background: "rgba(245,239,224,0.05)", border: "1px solid rgba(245,239,224,0.12)", borderRadius: 2, padding: "0.85rem 1rem", color: "#F5EFE0", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", outline: "none", resize: "vertical" }} />
            </div>
            <button style={{ background: "#C4633A", color: "#F5EFE0", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "1rem", borderRadius: 2, width: "100%", marginTop: "0.5rem" }}>
              Send My Dream Trip Brief
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0D0B07", padding: "clamp(2.5rem,4vw,4rem) clamp(1rem,4vw,4rem) 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", color: "#F5EFE0" }}>Wanderlust</span>
            <p style={{ fontSize: "0.85rem", color: "#9A9188", lineHeight: 1.7, marginTop: "0.8rem", maxWidth: 260 }}>
              Crafting meaningful journeys since 1998. We believe travel is the greatest investment you can make in yourself.
            </p>
          </div>
          {[
            { title: "Destinations", links: ["Asia Pacific", "Europe", "The Americas", "Africa & Middle East", "Polar Expeditions"] },
            { title: "Company",      links: ["Our Story", "Our Guides", "Sustainability", "Press", "Careers"] },
            { title: "Support",      links: ["Contact Us", "FAQs", "Cancellation Policy", "Travel Insurance", "Gift Vouchers"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5EFE0", marginBottom: "1rem" }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {col.links.map((link) => (
                  <li key={link}><button style={{ fontSize: "0.85rem", color: "#9A9188", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0, textAlign: "left" }}>{link}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(245,239,224,0.07)", paddingTop: "1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.76rem", color: "#9A9188" }}>© 2024 Wanderlust Travel Co. All rights reserved.</p>
          <p style={{ fontSize: "0.76rem", color: "#9A9188" }}>Privacy · Terms · Cookies</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { overflow-x:hidden; }
        input::placeholder, textarea::placeholder { color:#6A6560; }
        textarea { display:block; }
        .hide-scroll { scrollbar-width:none; -ms-overflow-style:none; }
        .hide-scroll::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}
