import { useEffect, useRef, useState, useCallback } from "react";

const WA_NUMBER = "254115566775";
const CALL_NUMBER = "0769248566";
const PORTFOLIO_URL = "https://barrackwambura-ec7h.vercel.app/";
const WHATSAPP_GROUP = "https://chat.whatsapp.com/J153u1LlU1NBexFfGfiIaI";

function waBook() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Serenade Wash, I would like to book an appointment.")}`;
}
function waPackage(name: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello Serenade Wash, I am interested in the ${name}.`)}`;
}
function waContact() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Serenade Wash, I would like to inquire about your services.")}`;
}
function waHome() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Serenade Wash, I would like to book a home car wash service at my location.")}`;
}

const QR_WASH = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Serenade Wash, I would like to book an appointment.")}`)}&bgcolor=0d2240&color=00c2e0&margin=5`;

type BeforeAfterSliderConfig = {
  id: string;
  title: string;
  beforeSrc: string;
  afterSrc: string;
  alt: string;
};

const journeyImage = (fileName: string) =>
  `${import.meta.env.BASE_URL}images/${fileName}`;

const BEFORE_AFTER_SLIDERS: BeforeAfterSliderConfig[] = [
  {
    id: "interior-revival",
    title: "Interior Revival",
    beforeSrc: journeyImage("journey-interior.jpg"),
    afterSrc: journeyImage("journey-interior.jpg"),
    alt: "Car dashboard, seats, and floor before and after interior detailing",
  },
  {
    id: "exterior-perfection",
    title: "Exterior Perfection",
    beforeSrc: journeyImage("journey-exterior.webp"),
    afterSrc: journeyImage("journey-exterior.webp"),
    alt: "Car body before and after exterior detailing",
  },
  {
    id: "wheel-tire-detailing",
    title: "Wheel & Tire Detailing",
    beforeSrc: journeyImage("journey-wheel.jpg"),
    afterSrc: journeyImage("journey-wheel.jpg"),
    alt: "Car wheel and tire before and after detailing",
  },
];

const JOURNEY_CARDS: {
  tag: string;
  title: string;
  img?: string;
  alt: string;
  text: string;
  sliderId?: string;
}[] = [
  {
    tag: "For the dreamers", title: "For the Dreamers",
    img: "https://www.aquasoniccarwash.com/wp-content/uploads/2025/01/Electric-off-road-pick-up-truck-600x324.webp",
    alt: "A sleek electric pickup truck",
    text: "Here's to those who know that driving isn't just about getting there. It's about the memories you make along the way—the open skies, the untamed roads, and the freedom to explore.",
  },
  {
    tag: "Interior Revival", title: "Interior Revival",
    sliderId: "interior-revival",
    alt: "Car interior before and after cleaning",
    text: "Experience the transformation from dusty, stained interiors to a spotless luxury cabin environment.",
  },
  {
    tag: "Exterior Perfection", title: "Exterior Perfection",
    sliderId: "exterior-perfection",
    alt: "Car exterior before and after cleaning",
    text: "Watch your vehicle evolve from road-worn and muddy to glossy showroom brilliance.",
  },
  {
    tag: "Wheel & Tire Detailing", title: "Wheel & Tire Detailing",
    sliderId: "wheel-tire-detailing",
    alt: "Tire and rim before and after detailing",
    text: "Restore deep shine and premium finish to your rims and tires with professional detailing.",
  },
];

const DIFF_CARDS = [
  { ico: "⚗️", label: "Chemistry", title: "Next-Gen Chemistry", desc: "Proprietary formulas for a finish that lasts far longer than traditional soaps." },
  { ico: "🤖", label: "Technology", title: "Smart Technology", desc: "Our system delivers a precisely calibrated clean, every time." },
  { ico: "💧", label: "Water", title: "Eco-Conscious Water Use", desc: "We reclaim and recycle over 90% of our water. Keeping your car clean shouldn't cost the planet." },
  { ico: "⚡", label: "Speed", title: "Lightning-Fast Service", desc: "Freedom Pass members get priority access for zero wait-time." },
  { ico: "🌍", label: "Community", title: "Giving Back", desc: "Every wash contributes to our community fund. We partner with local initiatives to make a difference." },
];

const AQUA_RIBBON = ["#fortheloveofthecar", "uthiru", "nairobi", "westlands", "karen", "lavington", "kilimani", "runda", "gigiri", "parklands", "muthaiga", "kileleshwa", "utawala", "upperhill"];
const NAVY_RIBBON = ["smart technology", "smarter chemistry", "unbeatable shine", "uthiru's smartest car wash", "professional care", "interior & exterior", "freedom pass", "ultimate wash"];

const PACKAGES = [
  {
    featured: true, badge: "Most Popular", ico: "✨", label: "Ultimate Wash", name: "Ultimate Wash",
    sub: "Showroom Finish, Ultimate Care", price: "KSh 450",
    desc: "Complete premium wash package including interior cleaning, exterior cleaning, mats, tires, and rims. Full vehicle detailing available two times a day.",
    features: ["Interior wash", "Exterior wash", "Mats cleaning", "Tires & rims cleaning", "Full body wash", "Available two times a day"],
    waMsg: "Ultimate Wash package (KSh 450)",
  },
  {
    featured: false, badge: null, ico: "🔵", label: "Pro Wash", name: "Pro Wash",
    sub: "Deep Clean, Lasting Protection", price: "KSh 300",
    desc: "Professional daily wash package covering interior cleaning, exterior cleaning, mats, and tires once a day.",
    features: ["Interior wash", "Exterior wash", "Mats cleaning", "Tires cleaning", "One wash per day"],
    waMsg: "Pro Wash package (KSh 300)",
  },
  {
    featured: false, badge: null, ico: "💧", label: "Lite Wash", name: "Lite Wash",
    sub: "Quick Clean, No Compromise", price: "KSh 100",
    desc: "Affordable single-service wash option for customers who only need interior or exterior cleaning.",
    features: ["Interior wash only OR", "Exterior wash only", "Single service package", "Affordable quick cleaning"],
    waMsg: "Lite Wash package (KSh 100)",
  },
];

/* ─── BEFORE/AFTER SLIDER ─── */
function BeforeAfterSlider({ slider }: { slider: BeforeAfterSliderConfig }) {
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const positionRef = useRef(50);
  const pendingPositionRef = useRef(50);
  const positionFrameRef = useRef<number | null>(null);
  const hintFrameRef = useRef<number | null>(null);
  const hintPlayedRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const updatePosition = useCallback((value: number) => {
    const next = clamp(value);
    positionRef.current = next;
    pendingPositionRef.current = next;
    if (positionFrameRef.current !== null) return;
    positionFrameRef.current = requestAnimationFrame(() => {
      setPos(pendingPositionRef.current);
      positionFrameRef.current = null;
    });
  }, []);

  const updatePositionImmediately = useCallback((value: number) => {
    const next = clamp(value);
    positionRef.current = next;
    pendingPositionRef.current = next;
    if (positionFrameRef.current !== null) {
      cancelAnimationFrame(positionFrameRef.current);
      positionFrameRef.current = null;
    }
    setPos(next);
  }, []);

  const stopHint = useCallback(() => {
    if (hintFrameRef.current !== null) {
      cancelAnimationFrame(hintFrameRef.current);
      hintFrameRef.current = null;
    }
  }, []);

  const getPosition = (clientX: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return positionRef.current;
    return clamp(((clientX - bounds.left) / bounds.width) * 100);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopHint();
    draggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    setIsDragging(true);
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(getPosition(event.clientX));
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return;
    updatePosition(getPosition(event.clientX));
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    setIsDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = positionRef.current - 5;
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = positionRef.current + 5;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = 100;
    }
    if (next === null) return;
    event.preventDefault();
    stopHint();
    updatePositionImmediately(next);
  };

  useEffect(() => {
    const target = ref.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      if (hintPlayedRef.current || draggingRef.current) return;
      if (!entries.some((entry) => entry.isIntersecting)) return;
      hintPlayedRef.current = true;
      observer.unobserve(target);

      const stops = [43, 57, 50];
      let segment = 0;
      let segmentStart = 0;
      let segmentFrom = positionRef.current;

      const animateHint = (time: number) => {
        if (segmentStart === 0) segmentStart = time;
        const progress = Math.min(1, (time - segmentStart) / 260);
        const eased = progress * progress * (3 - 2 * progress);
        const next = segmentFrom + (stops[segment] - segmentFrom) * eased;
        positionRef.current = next;
        pendingPositionRef.current = next;
        setPos(next);

        if (progress < 1) {
          hintFrameRef.current = requestAnimationFrame(animateHint);
          return;
        }

        segmentFrom = stops[segment];
        segment += 1;
        if (segment < stops.length) {
          segmentStart = 0;
          hintFrameRef.current = requestAnimationFrame(animateHint);
        } else {
          hintFrameRef.current = null;
        }
      };

      hintFrameRef.current = requestAnimationFrame(animateHint);
    }, { threshold: 0.45 });

    observer.observe(target);
    return () => {
      observer.disconnect();
      stopHint();
      if (positionFrameRef.current !== null) {
        cancelAnimationFrame(positionFrameRef.current);
      }
    };
  }, [stopHint]);

  const beforeOpacity = Math.min(1, Math.max(0, pos / 18));
  const afterOpacity = Math.min(1, Math.max(0, (100 - pos) / 18));

  return (
    <div
      className={`ba-wrap${isDragging ? " is-dragging" : ""}`}
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={`${slider.title}: ${slider.alt}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)} percent before image shown`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <img
        className="ba-img ba-after-image"
        src={slider.afterSrc}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img
          className="ba-img ba-before-filter"
          src={slider.beforeSrc}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="ba-divider" style={{ left: `${pos}%` }}>
        <div className="ba-handle">⇔</div>
      </div>
      <span className="ba-label before" style={{ opacity: beforeOpacity }}>Before</span>
      <span className="ba-label after" style={{ opacity: afterOpacity }}>After</span>
    </div>
  );
}

/* ─── AI ASSISTANT ─── */
type Msg = { role: "bot" | "user"; text: string };

const QUICK = ["Book a wash", "See packages", "Freedom Pass", "Locations", "Home service"];

function aiReply(input: string): string {
  const t = input.toLowerCase();
  if (/hi|hello|hey|good/.test(t))
    return "Hello! Welcome to Serenade Wash 🚗✨ I'm here to help you with bookings, packages, and anything else. How can I assist you today?";
  if (/book|appoint|schedul|wash/.test(t))
    return `To book a wash, simply click the link below or message us on WhatsApp:\n\n👉 wa.me/${WA_NUMBER}\n\n"Hello Serenade Wash, I would like to book an appointment."`;
  if (/ultimate|450|premium/.test(t))
    return "Our **Ultimate Wash** (KSh 450) is our most complete package — interior, exterior, mats, tires & rims. Available twice daily. It's the showroom finish your car deserves!";
  if (/pro|300/.test(t))
    return "The **Pro Wash** (KSh 300) covers interior, exterior, mats & tires — once per day. Perfect for regular, professional upkeep.";
  if (/lite|100/.test(t))
    return "The **Lite Wash** (KSh 100) gives you a single service — interior OR exterior. Quick, clean, and affordable!";
  if (/package|price|cost|plan|option/.test(t))
    return "We have 3 packages:\n• Lite Wash — KSh 100 (single service)\n• Pro Wash — KSh 300 (daily clean)\n• Ultimate Wash — KSh 450 (full detail)\n\nWhich one interests you?";
  if (/freedom|member|join|subscri/.test(t))
    return "The **Freedom Pass** gives you Pro Wash access for a full week at just KSh 1,300. Daily interior + exterior + mats & tires. Join via our WhatsApp group!";
  if (/location|where|branch|find/.test(t))
    return "We have two branches:\n📍 Serenade Apartments, Uthiru, Nairobi\n📍 Utawala, Nairobi\n\nWe also offer **Home Service** — our team comes to you!";
  if (/home|mobile|come to|deliver/.test(t))
    return "Yes! We offer **Home Car Wash Service** — our team comes to your location to wash your vehicle. Book via WhatsApp and we'll arrange everything.";
  if (/hour|open|time|when/.test(t))
    return "We're open daily. For exact operating hours or same-day bookings, please message us on WhatsApp: 0115566775.";
  if (/contact|number|phone|reach/.test(t))
    return `You can reach us at:\n📞 Call: ${CALL_NUMBER}\n💬 WhatsApp: 0115566775\n✉️ Email: bowambura123@gmail.com`;
  return "I can help you with bookings, packages, pricing, locations, and memberships. What would you like to know? You can also message us directly on WhatsApp: 0115566775.";
}

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hello! I'm your Serenade Wash assistant. I can help you book a wash, explore our packages, or answer any questions. What can I do for you today? ✨" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => setTimeout(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, 60);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    scrollBottom();
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: aiReply(text) }]);
      scrollBottom();
    }, 950 + Math.random() * 400);
  }, []);

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen((o) => !o)} aria-label="AI Assistant">
        <div className="ai-fab-ring" />
        ✦
      </button>
      {open && (
        <div className="ai-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="ai-modal">
            <div className="ai-modal-hdr">
              <div className="ai-hdr-avatar">✦</div>
              <div className="ai-hdr-info">
                <div className="ai-hdr-name">Serenade AI</div>
                <div className="ai-hdr-status">● Online — here to help</div>
              </div>
              <button className="ai-modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="ai-messages" ref={msgsRef}>
              {msgs.map((m, i) => (
                <div key={i} className={`ai-msg ${m.role}`} style={{ whiteSpace: "pre-line" }}>{m.text}</div>
              ))}
              {typing && (
                <div className="ai-typing">
                  <span /><span /><span />
                </div>
              )}
            </div>
            <div className="ai-quick-replies">
              {QUICK.map((q) => (
                <button key={q} className="ai-qr" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
            <div className="ai-input-row">
              <input
                className="ai-input"
                placeholder="Ask me anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
              />
              <button className="ai-send" onClick={() => send(input)}>→</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── SINGLE PHONE SCREEN ─── */
function PhoneScreen() {
  return (
    <div className="phone-screen-single" style={{ position: "relative" }}>
      <div className="ps-glow" />
      <div className="ps1-logo">Serenade<span> Wash</span></div>
      <div className="ps1-banner">
        <div className="ps1-banner-tag">Premium Smart Wash</div>
        <div className="ps1-banner-title">Uthiru's Finest Car Care</div>
      </div>
      <div className="ps1-stats">
        <div className="ps1-stat">
          <div className="ps1-stat-val">2</div>
          <div className="ps1-stat-lbl">Branches</div>
        </div>
        <div className="ps1-stat">
          <div className="ps1-stat-val">3</div>
          <div className="ps1-stat-lbl">Packages</div>
        </div>
        <div className="ps1-stat">
          <div className="ps1-stat-val">100</div>
          <div className="ps1-stat-lbl">From KSh</div>
        </div>
      </div>
      <div className="ps1-qr">
        <img src={QR_WASH} alt="Book via WhatsApp" />
      </div>
      <div className="ps1-member">
        <div>
          <div className="ps1-member-lbl">Freedom Pass</div>
          <div className="ps1-member-val">KSh 1,300 / week</div>
        </div>
        <span style={{ color: "var(--aqua)", fontSize: ".7rem" }}>→</span>
      </div>
      <a href={waBook()} target="_blank" rel="noreferrer" className="ps1-cta">
        Book Your Wash →
      </a>
    </div>
  );
}

/* ─── DRAG CAROUSEL ─── */
function useDragCarousel(ref: React.RefObject<HTMLDivElement | null>) {
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    isDown.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  }, [ref]);
  const onMouseLeave = useCallback(() => { isDown.current = false; }, []);
  const onMouseUp = useCallback(() => { isDown.current = false; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  }, [ref]);
  return { onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [jeepZoomed, setJeepZoomed] = useState(false);
  const jeepRef = useRef<HTMLDivElement>(null);
  const pkgWrapRef = useRef<HTMLDivElement>(null);
  const newsWrapRef = useRef<HTMLDivElement>(null);
  const pkgDrag = useDragCarousel(pkgWrapRef);
  const newsDrag = useDragCarousel(newsWrapRef);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowSticky(window.scrollY > 500 && !stickyDismissed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickyDismissed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          if (e.target === jeepRef.current) setJeepZoomed(true);
        }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));
    if (jeepRef.current) observer.observe(jeepRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HEADER */}
      <header id="site-header" className={scrolled ? "scrolled" : ""}>
        <a href="#" className="hdr-logo">
          <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" stroke="#00c2e0" strokeWidth="1.5" />
            <path d="M7 26 Q13 14 21 21 Q29 28 35 16" stroke="#00c2e0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M7 30 Q13 18 21 25 Q29 32 35 20" stroke="rgba(0,194,224,.35)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
          <span className="hdr-wordmark">Serenade<span> Wash</span></span>
        </a>
        <nav className="hdr-nav">
          <a href="#">Wash Packages</a>
          <a href="#">Freedom Pass</a>
          <a href="#">Locations</a>
          <a href="#">Help &amp; Support</a>
          <a href={waContact()} target="_blank" rel="noreferrer" className="btn-login">Login</a>
        </nav>
        <button className={`burger${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* MOBILE MENU */}
      <div className={`mob-menu${mobileOpen ? " open" : ""}`}>
        <a href="#" onClick={() => setMobileOpen(false)}>Home</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Wash Packages</a>
        <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>Freedom Pass</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Locations</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Help &amp; Support</a>
        <a href={waBook()} target="_blank" rel="noreferrer" style={{ color: "var(--aqua)", marginTop: "18px" }} onClick={() => setMobileOpen(false)}>Book an Appointment →</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline
          poster="https://www.aquasoniccarwash.com/wp-content/uploads/2024/12/aquasonic-sunset-roadtrip-woman-enjoying-car-journey.webp">
          <source src="https://www.aquasoniccarwash.com/wp-content/uploads/2024/11/woman_sunset_beach_1920.webm" type="video/webm" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Start Your Journey</p>
          <h1>Welcome to<br /><em>Serenade Wash</em></h1>
          <p className="hero-sub">
            Uthiru's Smartest Car Wash<br />
            Professional interior and exterior car care with affordable wash plans for every customer.
            We also offer home car wash services where our team comes to you.
          </p>
          <div className="hero-ctas">
            <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" className="btn-primary">Membership</a>
            <a href={waBook()} target="_blank" rel="noreferrer" className="btn-ghost">Book an Appointment</a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* RIBBON */}
      <div className="ribbon-wrap">
        <div className="rib-row rib-row-aqua">
          <div className="rib-track">
            {[...AQUA_RIBBON, ...AQUA_RIBBON].map((item, i) => (
              <span key={i} className="rib-item">{item}<span className="rib-dot" /></span>
            ))}
          </div>
        </div>
        <div className="rib-row rib-row-navy">
          <div className="rib-track">
            {[...NAVY_RIBBON, ...NAVY_RIBBON].map((item, i) => (
              <span key={i} className="rib-item">{item}<span className="rib-dot" /></span>
            ))}
          </div>
        </div>
      </div>

      {/* JOURNEY / BEFORE-AFTER */}
      <section id="journey" className="sec sec-gray">
        <div className="container">
          <div className="journey-hdr rv">
            <p className="sec-label">We Are Here For The Journey</p>
            <h2 className="sec-title">Wherever that <em>takes you.</em></h2>
            <p className="sec-sub mx-auto t-center">Here's to those who know that driving isn't just about getting there. It's about the memories you make along the way.</p>
          </div>
          <div className="jgrid">
            {JOURNEY_CARDS.map((card, i) => (
              <div key={i} className={`jcard rv d${i + 1}`}>
                <div className="jcard-imgwrap">
                  {card.sliderId ? (
                    <BeforeAfterSlider
                      slider={BEFORE_AFTER_SLIDERS.find((slider) => slider.id === card.sliderId)!}
                    />
                  ) : (
                    <img src={card.img} alt={card.alt} loading="lazy" />
                  )}
                </div>
                <div className="jcard-body">
                  <div className="jtag">{card.tag}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JEEP BAND */}
      <div className={`jeep-band${jeepZoomed ? " zoomed" : ""}`} ref={jeepRef}>
        <img src="https://www.aquasoniccarwash.com/wp-content/uploads/2024/10/Jeep_by_lake-600x336.webp" alt="An SUV parked near a lake at sunset" loading="lazy" />
        <div className="jeep-overlay">
          <div className="jeep-quote"><span>#fortheloveofthecar</span></div>
        </div>
      </div>

      {/* LOCATION FINDER */}
      <section className="finder">
        <div className="container">
          <p className="sec-label rv" style={{ textAlign: "center" }}>#fortheloveofthecar</p>
          <h2 className="sec-title rv" style={{ color: "#fff", textAlign: "center", marginTop: "6px" }}>
            Find a Serenade Wash near you…<br /><em style={{ color: "var(--aqua)" }}>it's just a click away!</em>
          </h2>
          <p className="sec-sub rv mx-auto t-center" style={{ color: "rgba(255,255,255,.46)", marginTop: "0", marginBottom: "16px" }}>
            Two branches in Nairobi — Uthiru &amp; Utawala. We also come to you with our home service.
          </p>
          <div className="branches-row rv">
            <div className="branch-pill">📍 Serenade Apartments, Uthiru, Nairobi</div>
            <div className="branch-pill">📍 Utawala, Nairobi</div>
            <div className="branch-pill">🏠 Home Service Available</div>
          </div>
          <div className="finder-form rv" style={{ marginTop: "30px" }}>
            <input type="text" className="finder-input" placeholder="Enter your location or area" />
            <button className="finder-btn" onClick={() => window.open(waContact(), "_blank")}>Search</button>
          </div>
        </div>
      </section>

      {/* WASH PACKAGES */}
      <section className="sec">
        <div className="container">
          <div className="pkg-hdr rv">
            <p className="sec-label">Our Wash Packages</p>
            <h2 className="sec-title">Industry-leading car washes in<br /><em>three smart packages</em></h2>
            <p className="drag-hint">← Drag to explore →</p>
          </div>
        </div>
        <div className="carousel-wrap" ref={pkgWrapRef} style={{ overflowX: "auto", scrollbarWidth: "none" }} {...pkgDrag}>
          <div className="carousel-track">
            {PACKAGES.map((pkg, i) => (
              <div key={i} className={`pkg-card${pkg.featured ? " featured" : ""}`}>
                {pkg.badge && <div className="pkg-badge">{pkg.badge}</div>}
                <div className="pkg-ico">{pkg.ico}</div>
                <div className="pkg-label">{pkg.label}</div>
                <h3 className="pkg-name">{pkg.name}</h3>
                <div className="pkg-sub">{pkg.sub}</div>
                <div className="pkg-price">{pkg.price}</div>
                <p className="pkg-desc">{pkg.desc}</p>
                <ul className="pkg-features">
                  {pkg.features.map((f, fi) => <li key={fi}>{f}</li>)}
                </ul>
                <a href={waPackage(pkg.waMsg)} target="_blank" rel="noreferrer" className="pkg-link">Book Now →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREEDOMPASS */}
      <section className="sec sec-navy">
        <div className="container">
          <div className="fp-wrap">
            <div className="fp-text rv">
              <div className="fp-kicker">★ This isn't just a membership, it's complete freedom…</div>
              <p className="sec-label">Welcome to</p>
              <h2 className="sec-title" style={{ color: "#fff", fontSize: "clamp(2.2rem,4vw,3.3rem)" }}>Freedom Pass</h2>
              <p className="sec-sub" style={{ color: "rgba(255,255,255,.52)" }}>
                Get the Pro Wash plan for one full week at only KSh 1,300. Designed for customers who want consistent daily cleaning at an affordable price.
              </p>
              <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: "36px" }}>Freedom Pass</a>
            </div>
            <div className="fp-card rv d2">
              <div className="fp-name">Freedom<span> Pass</span></div>
              <div className="fp-tagline">Uthiru's Smartest Membership</div>
              <ul className="fp-list">
                <li>Pro Wash access for 1 week</li>
                <li>Daily interior cleaning</li>
                <li>Daily exterior cleaning</li>
                <li>Mats &amp; tires included</li>
                <li>Affordable weekly package — KSh 1,300</li>
                <li>Use at any Serenade Wash location</li>
              </ul>
              <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" className="btn-primary">Join Freedom Pass</a>
            </div>
          </div>
        </div>
      </section>

      {/* MEDIA SPLIT */}
      <div className="media-split">
        <div className="media-side">
          <img src="https://www.aquasoniccarwash.com/wp-content/uploads/2024/10/Young_woman_selfie_party-600x338.webp" alt="Joyful Journeys Begin with Serenade Wash" loading="lazy" />
        </div>
        <div className="media-side">
          <video autoPlay muted loop playsInline poster="https://www.aquasoniccarwash.com/wp-content/uploads/2024/10/Young_woman_selfie_party-600x338.webp">
            <source src="https://www.aquasoniccarwash.com/wp-content/uploads/2024/12/dog-car-window.webm" type="video/webm" />
          </video>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <section className="sec sec-gray">
        <div className="container">
          <div className="app-inner">
            <div className="rv">
              <p className="sec-label">Get In Touch</p>
              <h2 className="sec-title">We come to <em>you.</em></h2>
              <p className="sec-sub" style={{ marginBottom: "28px" }}>
                Visit us at either of our two Nairobi branches, or book a home service and our team will come and wash your vehicle at your location.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                {[
                  { ico: "📍", label: "Branch 1:", val: "Serenade Apartments, Uthiru, Nairobi" },
                  { ico: "📍", label: "Branch 2:", val: "Utawala, Nairobi" },
                  { ico: "🏠", label: "Home Service:", val: "We come and wash your vehicle at your location" },
                ].map((r) => (
                  <div key={r.label} style={{ fontSize: ".8rem", color: "var(--body)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "var(--aqua)", fontSize: "1rem", flexShrink: 0 }}>{r.ico}</span>
                    <span><strong>{r.label}</strong> {r.val}</span>
                  </div>
                ))}
              </div>
              <div className="store-btns">
                <a href={`tel:${CALL_NUMBER}`} className="store-btn">
                  <span className="store-btn-ico">📞</span>
                  <div className="store-btn-txt"><small>Call us</small><strong>{CALL_NUMBER}</strong></div>
                </a>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="store-btn">
                  <span className="store-btn-ico">💬</span>
                  <div className="store-btn-txt"><small>WhatsApp</small><strong>0115566775</strong></div>
                </a>
                <a href="mailto:bowambura123@gmail.com" className="store-btn">
                  <span className="store-btn-ico">✉️</span>
                  <div className="store-btn-txt"><small>Email us</small><strong>bowambura123@gmail.com</strong></div>
                </a>
                <a href={waHome()} target="_blank" rel="noreferrer" className="store-btn" style={{ borderColor: "rgba(0,194,224,.3)" }}>
                  <span className="store-btn-ico">🏠</span>
                  <div className="store-btn-txt"><small>Home Service</small><strong>Book via WhatsApp</strong></div>
                </a>
              </div>
            </div>

            {/* SINGLE PHONE SCREEN */}
            <div className="phone-wrap rv d3">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="phone">
                  <PhoneScreen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS / COMMUNITY */}
      <section className="sec">
        <div className="container">
          <div className="news-hdr rv">
            <div>
              <p className="sec-label">Word on the Street</p>
              <h2 className="sec-title">Get the lowdown on our latest news, events,<br /><em>and all things Serenade Wash.</em></h2>
            </div>
            <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" className="btn-primary" style={{ flexShrink: 0, whiteSpace: "nowrap", alignSelf: "flex-end" }}>View All News</a>
          </div>
        </div>
        <div className="carousel-wrap" ref={newsWrapRef} style={{ overflowX: "auto", scrollbarWidth: "none" }} {...newsDrag}>
          <div className="carousel-track">
            <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" className="news-card">
              <img className="news-img" src="https://www.aquasoniccarwash.com/wp-content/uploads/2025/05/Untitled-design-21-600x338.png" alt="Join the Serenade Wash Community" loading="lazy" />
              <div className="news-body">
                <div className="news-tag">Community · WhatsApp</div>
                <h3 className="news-title">Join the Serenade Wash Community</h3>
                <p style={{ fontSize: ".78rem", color: "var(--mgray)", lineHeight: "1.6", margin: "6px 0 10px" }}>
                  Get exclusive offers, wash updates, discounts, booking assistance, and connect directly with the Serenade Wash team.
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px", marginBottom: "14px" }}>
                  {["Exclusive offers", "Priority updates", "Customer support", "Community discounts"].map((item) => (
                    <li key={item} style={{ fontSize: ".72rem", color: "var(--aqua)", fontWeight: 700, letterSpacing: ".04em" }}>✦ {item}</li>
                  ))}
                </ul>
                <div className="news-wa-btn">Join WhatsApp Group →</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* DIFFERENCE */}
      <section className="sec sec-dark">
        <div className="container">
          <div className="diff-hdr rv">
            <p className="sec-label">The Serenade Wash Difference</p>
            <h2 className="sec-title">Why Uthiru's most passionate<br /><em style={{ color: "var(--aqua)" }}>customers choose us.</em></h2>
            <p className="sec-sub">Five pillars that set Serenade Wash apart from every other car wash on the road.</p>
          </div>
          <div className="diff-grid">
            {DIFF_CARDS.map((card, i) => (
              <div key={i} className={`diff-card rv d${i + 1}`}>
                <span className="diff-ico">{card.ico}</span>
                <div className="diff-label">{card.label}</div>
                <div className="diff-title">{card.title}</div>
                <div className="diff-desc">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HASHTAG BAR */}
      <div className="hashtag-bar">#fortheloveofthecar — wash it like you mean it.</div>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="foot-grid">
            <div className="foot-col">
              <div className="foot-logo">Serenade<span> Wash</span></div>
              <p className="foot-tagline">Uthiru's Smartest Car Wash. Professional interior and exterior car care. Home service available. #fortheloveofthecar</p>
              <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.3)", lineHeight: "1.9", margin: "12px 0 16px" }}>
                <div>📍 Serenade Apartments, Uthiru, Nairobi</div>
                <div>📍 Utawala, Nairobi</div>
                <div>🏠 Home Service Available</div>
              </div>
              <div className="socials">
                <a href="#" className="soc">f</a><a href="#" className="soc">in</a>
                <a href="#" className="soc">X</a><a href="#" className="soc">yt</a><a href="#" className="soc">ig</a>
              </div>
              <div style={{ marginTop: "20px" }}>
                <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.3)", marginBottom: "6px" }}>📞 <a href={`tel:${CALL_NUMBER}`} style={{ color: "rgba(255,255,255,.5)" }}>{CALL_NUMBER}</a></div>
                <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.3)", marginBottom: "6px" }}>✉️ <a href="mailto:bowambura123@gmail.com" style={{ color: "rgba(255,255,255,.5)" }}>bowambura123@gmail.com</a></div>
                <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.3)" }}>💬 <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,.5)" }}>WhatsApp: 0115566775</a></div>
              </div>
            </div>
            <div className="foot-col">
              <h4>Car Wash</h4>
              <ul>
                <li><a href={waPackage("Ultimate Wash package (KSh 450)")} target="_blank" rel="noreferrer">Ultimate Wash — KSh 450</a></li>
                <li><a href={waPackage("Pro Wash package (KSh 300)")} target="_blank" rel="noreferrer">Pro Wash — KSh 300</a></li>
                <li><a href={waPackage("Lite Wash package (KSh 100)")} target="_blank" rel="noreferrer">Lite Wash — KSh 100</a></li>
                <li><a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer">Freedom Pass — KSh 1,300/wk</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Services</h4>
              <ul>
                <li><a href={waContact()} target="_blank" rel="noreferrer">Interior Wash — KSh 100</a></li>
                <li><a href={waContact()} target="_blank" rel="noreferrer">Exterior Wash — KSh 100</a></li>
                <li><a href={waContact()} target="_blank" rel="noreferrer">Mats &amp; Tires — KSh 100</a></li>
                <li><a href={waHome()} target="_blank" rel="noreferrer">Home Service</a></li>
                <li><a href={waBook()} target="_blank" rel="noreferrer">Book an Appointment</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Support</h4>
              <ul>
                <li><a href={waContact()} target="_blank" rel="noreferrer">Help Centre</a></li>
                <li><a href={waContact()} target="_blank" rel="noreferrer">FAQs</a></li>
                <li><a href="#">Locations</a></li>
                <li><a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer">WhatsApp Community</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>

          {/* DEVELOPER CREDIT */}
          <div className="dev-credit rv">
            <div className="dev-credit-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(PORTFOLIO_URL)}&bgcolor=0a1628&color=00c2e0&margin=8`}
                alt="Developer QR Code"
                className="dev-qr"
              />
              <div className="dev-info">
                <div className="dev-label">Designed &amp; Built by</div>
                <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="dev-name">Barrack Rabuku</a>
                <div className="dev-sub">Scan the QR code or click the name to view portfolio</div>
              </div>
            </div>
          </div>

          <div className="foot-bottom">
            <div className="foot-copy">© 2026 Serenade Wash. All rights reserved.</div>
            <div className="foot-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* STICKY BAR */}
      {!stickyDismissed && (
        <div className={`sticky-bar${showSticky ? " show" : ""}`}>
          <div className="sticky-bar-txt">
            <strong>Join Freedom Pass</strong> — Pro Wash for a full week at just KSh 1,300.
          </div>
          <div className="sticky-bar-actions">
            <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: "10px 28px" }}>Join Now</a>
            <button className="bar-dismiss" onClick={() => { setStickyDismissed(true); setShowSticky(false); }}>✕</button>
          </div>
        </div>
      )}

      {/* AI ASSISTANT */}
      <AIAssistant />
    </>
  );
}
