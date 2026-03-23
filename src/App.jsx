import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ─── Google Fonts ───────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap";
document.head.appendChild(fontLink);

// ─── Global Styles ──────────────────────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --cream: #F7F8F6;
      --cream-dark: #ECF0EE;
      --teal: #3D6B72;
      --teal-light: #4E8590;
      --teal-pale: #E3EEF1;
      --teal-mid: #C4DDE2;
      --teal-dark: #1e3f45;
      --coral: #D4736A;
      --coral-light: #E8A89F;
      --coral-pale: #FAEDEB;
      --amber: #C8893A;
      --amber-pale: #FBF4EB;
      --text-dark: #1C1C1A;
      --text-mid: #4A4A42;
      --text-muted: #7A7A72;
      --text-light: #A8A8A0;
      --border: rgba(28,28,26,0.1);
      --border-mid: rgba(28,28,26,0.2);
      --serif: 'DM Serif Display', Georgia, serif;
      --sans: 'Instrument Sans', system-ui, sans-serif;
      --shadow-sm: 0 1px 4px rgba(61,107,114,0.08);
      --shadow-md: 0 4px 20px rgba(61,107,114,0.12);
      --shadow-lg: 0 12px 48px rgba(61,107,114,0.18);
    }

    body { background: var(--cream); color: var(--text-dark); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes shimmer { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
    @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
    @keyframes blobMorph {
      0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    }

    .animate-fade-up { animation: fadeUp 0.6s ease forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
    .animate-slide-in { animation: slideIn 0.4s ease forwards; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--teal); color: #fff; border: none;
      padding: 14px 28px; border-radius: 100px; font-family: var(--sans);
      font-size: 15px; font-weight: 500; cursor: pointer;
      transition: all 0.2s ease; letter-spacing: -0.01em;
    }
    .btn-primary:hover { background: var(--teal-light); transform: translateY(-1px); box-shadow: var(--shadow-md); }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; color: var(--teal);
      border: 1.5px solid var(--teal); padding: 13px 27px;
      border-radius: 100px; font-family: var(--sans);
      font-size: 15px; font-weight: 500; cursor: pointer;
      transition: all 0.2s ease; letter-spacing: -0.01em;
    }
    .btn-outline:hover { background: var(--teal-pale); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 6px;
      background: transparent; color: var(--text-mid);
      border: none; padding: 10px 16px; border-radius: 100px;
      font-family: var(--sans); font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all 0.2s ease;
    }
    .btn-ghost:hover { background: var(--cream-dark); color: var(--text-dark); }

    .card {
      background: #fff; border: 1px solid var(--border);
      border-radius: 20px; padding: 28px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    .card:hover { box-shadow: var(--shadow-md); }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--teal-pale); color: var(--teal);
      padding: 6px 14px; border-radius: 100px; font-size: 13px;
      font-weight: 500; letter-spacing: 0.01em;
    }

    .badge {
      display: inline-flex; align-items: center;
      padding: 4px 12px; border-radius: 100px;
      font-size: 12px; font-weight: 500;
    }

    input, textarea {
      font-family: var(--sans); font-size: 15px;
      border: 1.5px solid var(--border-mid); background: #fff;
      border-radius: 12px; padding: 12px 16px; width: 100%;
      color: var(--text-dark); outline: none; transition: border-color 0.2s;
    }
    input:focus, textarea:focus { border-color: var(--teal); }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-mid); border-radius: 4px; }

    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--text-mid);
      text-decoration: none; padding: 8px 12px; border-radius: 8px;
      cursor: pointer; transition: all 0.15s ease;
    }
    .nav-link:hover { color: var(--teal); background: var(--teal-pale); }
    .nav-link.active { color: var(--teal); }

    .accordion-header {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; background: none; border: none; cursor: pointer;
      padding: 20px 0; font-family: var(--sans); font-size: 16px;
      font-weight: 500; color: var(--text-dark); text-align: left;
      border-bottom: 1px solid var(--border);
    }

    .chat-bubble-user {
      background: var(--teal); color: #fff; border-radius: 20px 20px 4px 20px;
      padding: 14px 18px; max-width: 80%; font-size: 15px; line-height: 1.6;
      align-self: flex-end; animation: fadeUp 0.3s ease;
    }
    .chat-bubble-ai {
      background: #fff; border: 1px solid var(--border);
      border-radius: 20px 20px 20px 4px; padding: 14px 18px;
      max-width: 85%; font-size: 15px; line-height: 1.7;
      align-self: flex-start; animation: fadeUp 0.3s ease;
      box-shadow: var(--shadow-sm);
    }

    .typing-dot {
      width: 7px; height: 7px; background: var(--text-muted);
      border-radius: 50%; animation: pulse 1.4s infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    .progress-bar {
      height: 4px; background: var(--border);
      border-radius: 4px; overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%; background: var(--teal);
      border-radius: 4px; transition: width 0.5s ease;
    }

    .blob {
      position: absolute; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      animation: blobMorph 8s ease-in-out infinite;
      pointer-events: none; z-index: 0;
    }

    .section { padding: 80px 0; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }

    .disclaimer-banner {
      background: var(--amber-pale); border: 1px solid rgba(200,137,58,0.3);
      border-radius: 16px; padding: 16px 20px; font-size: 14px;
      color: var(--text-mid); line-height: 1.6;
    }
    .urgent-banner {
      background: var(--coral-pale); border: 1px solid rgba(200,93,58,0.3);
      border-radius: 16px; padding: 16px 20px; font-size: 14px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .section { padding: 56px 0; }
      .hide-mobile { display: none !important; }
      .stack-mobile { flex-direction: column !important; }
    }
  `;
  document.head.appendChild(style);
};
injectStyles();

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const paths = {
    heart: "M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z",
    shield: "M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4z",
    chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    arrow: "M5 12h14M12 5l7 7-7 7",
    check: "M20 6L9 17l-5-5",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z",
    lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
    info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    menu: "M3 12h18M3 6h18M3 18h18",
    close: "M18 6L6 18M6 6l12 12",
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    chevron: "M6 9l6 6 6-6",
    external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
    sparkle: "M12 3l1.912 5.813L20 10.5l-6.088 1.687L12 18l-1.912-5.813L4 10.5l6.088-1.687z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
};

// ─── Navigation ──────────────────────────────────────────────────────────────

// ─── Brand Emblem ─────────────────────────────────────────────────────────────
const SHARDS = [
  [60,9,13,6,0],[87,17,11,5,42],[105,43,6,12,80],[103,73,7,11,108],
  [85,97,12,5,135],[58,109,13,6,178],[31,99,11,5,-140],[13,75,6,12,-105],
  [11,45,6,11,-75],[27,19,12,5,-42],
];
const Emblem = ({ size = 36, variant = "color" }) => {
  const bg = variant === "dark" ? "#1e3f45" : "#3D6B72";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" fill={bg} />
      {SHARDS.map(function(s, i) {
        var cx=s[0],cy=s[1],w=s[2],h=s[3],r=s[4];
        return <rect key={i} x={cx-w/2} y={cy-h/2} width={w} height={h} rx="1.5"
          fill="none" stroke="rgba(255,255,255,0.68)" strokeWidth="1.8"
          transform={"rotate("+r+" "+cx+" "+cy+")"} opacity="0.78" />;
      })}
      <line x1="90" y1="24" x2="101" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="26" y1="91" x2="15"  y2="103" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="93" y1="83" x2="106" y2="95"  stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="43" x2="5"   y2="33"  stroke="rgba(255,255,255,0.4)"  strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="60" y1="90" x2="60" y2="54" stroke="#1e3f45" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M60 80 Q46 71 41 58 Q52 61 60 74Z" fill="#1e3f45" opacity="0.9"/>
      <path d="M60 76 Q74 69 78 56 Q68 60 60 71Z" fill="#E8A89F" opacity="0.82"/>
      <path d="M60 55 C56 46 56 35 60 27 C64 35 64 46 60 55Z" fill="#D4736A"/>
      <path d="M60 53 C52 47 44 40 41 31 C49 33 57 42 60 52Z" fill="#D4736A" opacity="0.88"/>
      <path d="M60 53 C68 47 76 40 79 31 C71 33 63 42 60 52Z" fill="#D4736A" opacity="0.88"/>
      <path d="M60 50 C51 46 40 44 35 37 C42 35 54 44 60 50Z" fill="#C06060" opacity="0.72"/>
      <path d="M60 50 C69 46 80 44 85 37 C78 35 66 44 60 50Z" fill="#C06060" opacity="0.72"/>
      <ellipse cx="60" cy="29" rx="2.5" ry="4.5" fill="#1e3f45" opacity="0.65"/>
    </svg>
  );
};

const Nav = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { key: "home", label: "Home" },
    { key: "chat", label: "AI Support" },
    { key: "education", label: "Learn" },
    { key: "resources", label: "Resources" },
    { key: "about", label: "About Us" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(247,248,246,0.93)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10
        }}>
          <Emblem size={38} />
          <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--text-dark)", letterSpacing: "-0.02em" }}>
            Break The Cycle
          </span>
        </button>

        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.key} className={`nav-link ${page === item.key ? "active" : ""}`}
              onClick={() => setPage(item.key)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hide-mobile" style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => setPage("chat")} style={{ padding: "10px 20px", fontSize: 14 }}>
            <Icon name="chat" size={15} color="#fff" />
            Start Chat
          </button>
        </div>

        <button className="btn-ghost" style={{ display: "none" }} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "close" : "menu"} size={20} />
        </button>

        <style>{`
          @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
            .btn-ghost { display: flex !important; }
          }
        `}</style>
      </div>

      {menuOpen && (
        <div style={{
          background: "var(--cream)", borderTop: "1px solid var(--border)",
          padding: "16px 24px 20px",
          display: "flex", flexDirection: "column", gap: 4
        }}>
          {navItems.map(item => (
            <button key={item.key} className="nav-link" onClick={() => { setPage(item.key); setMenuOpen(false); }}
              style={{ textAlign: "left", borderRadius: 8, padding: "12px 16px" }}>
              {item.label}
            </button>
          ))}
          <button className="btn-primary" onClick={() => { setPage("chat"); setMenuOpen(false); }}
            style={{ marginTop: 8 }}>
            <Icon name="chat" size={15} color="#fff" /> Start Chat
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = ({ setPage }) => (
  <footer style={{ background: "var(--text-dark)", color: "#fff", padding: "56px 0 32px" }}>
    <div className="container">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Emblem size={36} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 17 }}>Break The Cycle</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 220 }}>
            Raising awareness about abuse and helping people find the support they deserve.
          </p>
        </div>
        {[
          { title: "Platform", links: [{ label: "AI Support Chat", key: "chat" }, { label: "Education Hub", key: "education" }, { label: "Resources", key: "resources" }] },
          { title: "About", links: [{ label: "Our Mission", key: "about" }, { label: "The Team", key: "about" }, { label: "How It Works", key: "resources" }] },
        ].map(col => (
          <div key={col.title}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>{col.title}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {col.links.map(l => (
                <button key={l.label} onClick={() => setPage(l.key)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.75)", fontSize: 14, textAlign: "left", padding: 0, transition: "color 0.15s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Emergency</p>
          <div style={{ background: "rgba(200,93,58,0.2)", border: "1px solid rgba(200,93,58,0.4)", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 13, color: "#F0CBBD", lineHeight: 1.6 }}>
              If you are in immediate danger, please call your local emergency services or a crisis line immediately.
            </p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          © 2025 Break The Cycle. AI results are probability-based and not clinical diagnoses.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Use", "Contact"].map(t => (
            <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── Landing Page ────────────────────────────────────────────────────────────
const LandingPage = ({ setPage }) => {
  const abuseTypes = [
    { icon: "heart", label: "Emotional", desc: "Manipulation, intimidation, humiliation and control through words and actions." },
    { icon: "users", label: "Social", desc: "Isolation from friends, family and community to increase dependence." },
    { icon: "lock", label: "Economic", desc: "Financial control, withholding resources, and sabotaging employment." },
    { icon: "eye", label: "Cyber", desc: "Online harassment, surveillance, threats and digital manipulation." },
    { icon: "alert", label: "Physical", desc: "Any use of force intended to injure, hurt, intimidate or control." },
    { icon: "sparkle", label: "Spiritual", desc: "Weaponising beliefs and identity to control or undermine someone." },
  ];

  const steps = [
    { num: "01", title: "Start a conversation", desc: "Open the AI Support Chat. No sign-up needed. Your privacy is protected." },
    { num: "02", title: "Share at your pace", desc: "Our AI listens, gently asks questions, and never rushes or judges you." },
    { num: "03", title: "Receive insights", desc: "Get probability-based insights about what you may be experiencing." },
    { num: "04", title: "Find your path", desc: "Explore curated resources and connect with human support when ready." },
  ];

  const trusts = [
    { icon: "lock", label: "Private & secure", sub: "HTTPS-encrypted, no data sold" },
    { icon: "shield", label: "Non-judgmental AI", sub: "Trauma-informed, always" },
    { icon: "users", label: "Human backup", sub: "Volunteers available" },
    { icon: "info", label: "Honest about limits", sub: "Not a diagnosis or therapy" },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden", paddingTop: 100,
        background: "linear-gradient(160deg, var(--cream) 60%, var(--teal-pale))"
      }}>
        <div className="blob" style={{ width: 400, height: 400, background: "rgba(61,107,114,0.06)", top: -80, right: -80 }} />
        <div className="blob" style={{ width: 280, height: 280, background: "rgba(212,115,106,0.05)", bottom: 40, left: -60, animationDelay: "4s" }} />


        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680, animation: "fadeUp 0.8s ease forwards" }}>
            <div className="tag" style={{ marginBottom: 24 }}>
              <Icon name="sparkle" size={14} color="var(--teal)" />
              AI-powered abuse awareness platform
            </div>
            <h1 style={{
              fontFamily: "var(--serif)", fontSize: "clamp(44px, 7vw, 80px)",
              lineHeight: 1.1, color: "var(--text-dark)", marginBottom: 24,
              letterSpacing: "-0.03em"
            }}>
              You deserve to{" "}
              <span style={{ color: "var(--teal)", fontStyle: "italic" }}>understand</span>{" "}
              what you're going through.
            </h1>
            <p style={{
              fontSize: "clamp(17px, 2.5vw, 20px)", color: "var(--text-mid)",
              lineHeight: 1.7, marginBottom: 40, maxWidth: 540
            }}>
              Break The Cycle is a safe, intelligent platform that helps you recognise patterns of abuse, understand your experiences, and find the support you need — at your own pace.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => setPage("chat")} style={{ fontSize: 16, padding: "16px 32px" }}>
                <Icon name="chat" size={18} color="#fff" />
                Start your conversation
              </button>
              <button className="btn-outline" onClick={() => setPage("education")} style={{ fontSize: 16, padding: "15px 31px" }}>
                Learn about abuse
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}>
              No sign-up required · Private · Free to use
            </p>
          </div>
        </div>

        <div className="hide-mobile" style={{
          position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
          width: 340, animation: "float 6s ease-in-out infinite"
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, padding: 28,
            boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="sparkle" size={16} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>AI Support Assistant</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Always here for you</p>
              </div>
            </div>
            {[
              { role: "ai", text: "I'm here to listen. Would you like to share what's been on your mind?" },
              { role: "user", text: "I'm not sure if what I'm experiencing is normal..." },
              { role: "ai", text: "That uncertainty is completely valid. Many people feel that way. Let's explore it together, gently." },
            ].map((m, i) => (
              <div key={i} style={{
                marginBottom: 10, display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  background: m.role === "user" ? "var(--teal)" : "var(--cream)",
                  color: m.role === "user" ? "#fff" : "var(--text-dark)",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 14px", fontSize: 13, lineHeight: 1.5, maxWidth: "85%"
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section style={{ padding: "40px 0", background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="grid-4">
            {trusts.map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={t.icon} size={18} color="var(--teal)" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-dark)" }}>{t.label}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abuse Types */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="tag" style={{ marginBottom: 16 }}>Awareness first</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Abuse takes many forms
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-mid)", maxWidth: 520, margin: "0 auto" }}>
              Understanding what abuse looks like — including subtle or hidden forms — is the first step toward recognition and safety.
            </p>
          </div>
          <div className="grid-3">
            {abuseTypes.map(t => (
              <div key={t.label} className="card" style={{ cursor: "pointer" }} onClick={() => setPage("education")}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={t.icon} size={22} color="var(--teal)" />
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 8, letterSpacing: "-0.02em" }}>{t.label} abuse</h3>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>{t.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, color: "var(--teal)", fontSize: 13, fontWeight: 500 }}>
                  Learn more <Icon name="arrow" size={14} color="var(--teal)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: "var(--teal)", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 500, height: 500, background: "rgba(255,255,255,0.04)", top: -150, right: -100 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em", color: "#fff", marginBottom: 16 }}>
              How it works
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", maxWidth: 500, margin: "0 auto" }}>
              A guided, compassionate experience designed around your wellbeing.
            </p>
          </div>
          <div className="grid-4">
            {steps.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: 28
              }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: "rgba(255,255,255,0.25)", display: "block", marginBottom: 12 }}>{s.num}</span>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button className="btn-primary" onClick={() => setPage("chat")}
              style={{ background: "#fff", color: "var(--teal)", fontSize: 16, padding: "16px 36px" }}>
              <Icon name="chat" size={18} color="var(--teal)" />
              Try it now — it's free
            </button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="disclaimer-banner">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Icon name="info" size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-dark)" }}>A note on our AI</p>
                  <p>Break The Cycle's AI is a supportive tool — not a therapist, doctor, or emergency service. Results are probability-based and should not be treated as clinical diagnoses. If you are in immediate danger, please contact emergency services. Human volunteers are available if you need further support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── AI Chat Page ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the Break The Cycle AI Support Assistant — a trauma-informed, compassionate, non-judgmental conversational guide helping users understand whether they may be experiencing abuse.

CORE RULES:
- Be warm, empathetic, and gentle at all times
- Ask ONE thoughtful question at a time — never multiple questions at once
- Never be clinical, cold, or bureaucratic
- Never tell the user what they are experiencing as fact — frame everything as possibility ("it sounds like...", "this could be consistent with...", "some people in similar situations...")
- NEVER present yourself as a therapist, counselor, doctor, or emergency service
- NEVER make legal claims or diagnoses
- Validate feelings before offering any insight
- If the user seems in immediate danger, gently but clearly encourage them to contact emergency services
- Be curious, reflective, and patient
- After 4–6 exchanges, offer a gentle summary of what you've discussed and any patterns you notice
- Always end messages with an open, gentle question or offer to continue

ABUSE TYPES TO RECOGNISE:
Domestic violence, verbal abuse, psychological/emotional abuse, physical abuse, sexual abuse, economic/financial abuse, social isolation, spiritual abuse, cyber abuse/digital abuse. Also: LGBTQ+-specific forms including family-based abuse, institutional discrimination.

CONVERSATION STYLE:
- Start by welcoming the user and asking what brought them here today
- Use reflective listening ("What I'm hearing is...", "It sounds like...")
- Normalise their experience without minimising it
- When appropriate, gently name patterns: "What you're describing sounds like it could be a form of emotional control — is that something you'd like to explore?"
- After meaningful sharing, provide a probability-based insight: "Based on what you've shared, there are patterns here that are sometimes consistent with [type] — with that said, every situation is unique and only you can know your full experience."
- Always end with resources or next steps when appropriate

IMPORTANT ETHICAL NOTES:
- Always include a disclaimer if giving insights: "This is not a diagnosis — only a supportive observation."
- Recommend human support when risk seems elevated
- Do not store or repeat any personally identifying information

Begin the conversation with a warm, gentle opening.`;

const ChatPage = ({ user, onSaveSession }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startChat = async () => {
    setShowDisclaimer(false);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: "Hello, I've just arrived at Break The Cycle." }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "Hello! I'm here for you. What's on your mind today?";
      setMessages([{ role: "assistant", content: text }]);
    } catch {
      setMessages([{ role: "assistant", content: "Welcome. I'm here to listen and support you. What brought you here today?" }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "I hear you. Can you tell me more?";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm still here. Please continue when you're ready." }]);
    }
    setLoading(false);
  };

  const requestSummary = async () => {
    setShowSummary(true);
    setSummaryLoading(true);
    try {
      const summaryPrompt = `Based on the following conversation, provide a compassionate summary with:
1. Key themes or patterns noticed (framed as possibilities, not diagnoses)
2. Emotional impact observed
3. Possible abuse category considerations (with probability language like "may be consistent with")
4. Suggested next steps
5. A warm closing message

Format your response in clearly separated sections. Be gentle, empathetic, and always include the disclaimer that this is not a clinical diagnosis.

Conversation:
${messages.map(m => `${m.role === "user" ? "User" : "AI"}: ${m.content}`).join("\n\n")}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: summaryPrompt }],
        }),
      });
      const data = await res.json();
      const summaryText = data.content?.map(c => c.text || "").join("") || "";
      setSummary(summaryText);
      // Save session to persistent storage
      if (onSaveSession) {
        const sessionData = {
          id: 'chat_' + Date.now(),
          date: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          preview: messages.find(m => m.role === "user")?.content?.slice(0, 120) + "..." || "Chat session",
          messageCount: messages.length,
          hasSummary: true,
          risk: "low",
          tags: [],
        };
        await onSaveSession(sessionData);
      }
    } catch {
      setSummary("Unable to generate summary. Please try again.");
    }
    setSummaryLoading(false);
  };

  const msgCount = messages.length;
  const progress = Math.min((msgCount / 12) * 100, 100);

  if (showDisclaimer) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
        <div style={{ maxWidth: 540, animation: "fadeUp 0.6s ease forwards" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="heart" size={28} color="#fff" />
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, letterSpacing: "-0.03em", marginBottom: 12 }}>
              You're in a safe space
            </h1>
            <p style={{ fontSize: 17, color: "var(--text-mid)", lineHeight: 1.7 }}>
              Our AI is here to listen, support, and help you understand your experiences — at your own pace, without judgment.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
            {[
              { icon: "lock", title: "Your conversation is private", desc: "We use HTTPS encryption. Your data is protected." },
              { icon: "heart", title: "Non-judgmental support", desc: "There are no wrong answers. Share only what feels comfortable." },
              { icon: "info", title: "This is not therapy or a diagnosis", desc: "Our AI offers supportive insights, not clinical assessments." },
              { icon: "users", title: "Human support is available", desc: "You can request to speak with a trained volunteer at any time." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: 14, padding: 16, background: "#fff", borderRadius: 14, border: "1px solid var(--border)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={16} color="var(--teal)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="urgent-banner" style={{ marginBottom: 24 }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: "var(--coral)", marginBottom: 4 }}>⚠ Need urgent help?</p>
            <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
              If you are in immediate danger, please call emergency services (e.g. 112, 911) or a local crisis line before using this chat.
            </p>
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: 18 }} onClick={startChat}>
            <Icon name="chat" size={18} color="#fff" />
            I understand — begin my conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", paddingTop: 64, flexDirection: window.innerWidth < 768 ? "column" : "row" }}>
      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid var(--border)",
          background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="sparkle" size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15 }}>AI Support Assistant</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Break The Cycle · Confidential</p>
            </div>
          </div>
          {messages.length >= 4 && (
            <button className="btn-outline" style={{ padding: "8px 16px", fontSize: 13 }} onClick={requestSummary}>
              <Icon name="eye" size={14} color="var(--teal)" />
              View insights
            </button>
          )}
        </div>

        {/* Progress */}
        {msgCount > 0 && (
          <div style={{ padding: "8px 24px", background: "#fff", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Conversation depth</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{msgCount} exchanges</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--cream)" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, flexShrink: 0, marginTop: 4 }}>
                  <Icon name="sparkle" size={14} color="#fff" />
                </div>
              )}
              <div className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                style={{ whiteSpace: "pre-wrap" }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="sparkle" size={14} color="#fff" />
              </div>
              <div style={{ background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "14px 18px", border: "1px solid var(--border)", display: "flex", gap: 5 }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px", background: "#fff", borderTop: "1px solid var(--border)" }}>
          <div className="urgent-banner" style={{ marginBottom: 12, padding: "10px 14px" }}>
            <p style={{ fontSize: 12, color: "var(--coral)" }}>In immediate danger? Call emergency services first.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Share what's on your mind... (Press Enter to send)"
              style={{ flex: 1, resize: "none", height: 80, borderRadius: 16, fontSize: 15, lineHeight: 1.6 }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: 52, height: 52, borderRadius: "50%",
                background: input.trim() && !loading ? "var(--teal)" : "var(--border)",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", alignSelf: "flex-end"
              }}>
              <Icon name="send" size={18} color="#fff" />
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 8, textAlign: "center" }}>
            AI insights are probability-based — not clinical diagnoses or legal advice
          </p>
        </div>
      </div>

      {/* Summary Panel */}
      {showSummary && (
        <div style={{
          width: 360, borderLeft: "1px solid var(--border)", overflowY: "auto",
          background: "#fff", animation: "slideIn 0.3s ease",
          display: window.innerWidth < 768 ? "none" : "block"
        }}>
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "-0.02em" }}>Conversation insights</h3>
              <button className="btn-ghost" onClick={() => setShowSummary(false)} style={{ padding: "6px 10px" }}>
                <Icon name="close" size={16} />
              </button>
            </div>

            {summaryLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 16 }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Generating your insights...</p>
              </div>
            ) : (
              <>
                <div className="disclaimer-banner" style={{ marginBottom: 20, fontSize: 12 }}>
                  <Icon name="info" size={14} color="var(--amber)" />
                  {" "}These insights are supportive observations, not clinical diagnoses.
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-mid)", whiteSpace: "pre-wrap" }}>
                  {summary}
                </div>
                <div style={{ marginTop: 24, padding: 16, background: "var(--teal-pale)", borderRadius: 14 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--teal)", marginBottom: 8 }}>Need human support?</p>
                  <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6, marginBottom: 12 }}>A trained volunteer can review your conversation and provide personalised guidance.</p>
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 16px", fontSize: 13 }}>
                    <Icon name="users" size={14} color="#fff" />
                    Request volunteer support
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Education Hub ────────────────────────────────────────────────────────────
const EducationPage = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

  const categories = [
    {
      id: "domestic",
      icon: "home",
      label: "Domestic violence",
      color: "var(--coral-pale)",
      accent: "var(--coral)",
      desc: "Domestic violence encompasses physical, emotional, psychological, sexual, and economic abuse within intimate or family relationships.",
      signs: ["Controlling behaviour and constant monitoring", "Physical harm or threats of harm", "Isolation from friends and family", "Financial control and withholding money", "Emotional manipulation and gaslighting"],
      myths: [{ myth: '"It only happens in poor or uneducated families"', reality: "Domestic abuse affects people of all backgrounds, incomes, and education levels." }],
      tag: "all",
    },
    {
      id: "emotional",
      icon: "heart",
      label: "Emotional & psychological",
      color: "var(--teal-pale)",
      accent: "var(--teal)",
      desc: "Emotional abuse involves behaviours that harm someone's self-worth, mental health, and emotional stability over time.",
      signs: ["Constant criticism, humiliation, or belittling", "Gaslighting — making you question your reality", "Threats and intimidation", "Withholding affection as punishment", "Extreme jealousy and possessiveness"],
      myths: [{ myth: '"Emotional abuse isn\'t as serious as physical abuse"', reality: "Emotional abuse can have profound, lasting effects on mental health — sometimes more damaging than physical abuse." }],
      tag: "all",
    },
    {
      id: "economic",
      icon: "lock",
      label: "Economic abuse",
      color: "var(--amber-pale)",
      accent: "var(--amber)",
      desc: "Economic abuse is a form of control that limits a person's access to financial resources, independence, and security.",
      signs: ["Controlling all finances and household spending", "Preventing access to work or education", "Sabotaging employment opportunities", "Running up debt in your name", "Withholding money for necessities"],
      myths: [{ myth: '"If they provide financially, it\'s not abuse"', reality: "Financial provision does not excuse control. True partnership involves financial equality and respect." }],
      tag: "all",
    },
    {
      id: "cyber",
      icon: "eye",
      label: "Cyber & digital abuse",
      color: "var(--teal-pale)",
      accent: "var(--teal)",
      desc: "Digital abuse uses technology to harass, stalk, control, intimidate, or humiliate someone.",
      signs: ["Monitoring messages, location, or accounts", "Sharing intimate images without consent", "Sending threatening messages", "Creating fake profiles to harass", "Demanding passwords and access to devices"],
      myths: [{ myth: '"Online abuse isn\'t real abuse"', reality: "Cyber abuse causes serious psychological harm and is illegal in many jurisdictions." }],
      tag: "all",
    },
    {
      id: "lgbtq",
      icon: "sparkle",
      label: "LGBTQ+ experiences",
      color: "var(--coral-pale)",
      accent: "var(--coral)",
      desc: "People in the LGBTQ+ community face all forms of abuse, plus additional forms specific to their identities and experiences.",
      signs: ["Threatening to 'out' someone without consent", "Using identity as a weapon ('no one will believe a gay person')", "Family-based rejection and emotional abuse", "Institutional or social discrimination", "Pressure to change gender identity or sexual orientation"],
      myths: [{ myth: '"Same-sex relationships can\'t involve abuse"', reality: "Abuse occurs across all relationship types. LGBTQ+ people may face unique barriers to seeking help." }],
      tag: "lgbtq",
    },
    {
      id: "social",
      icon: "users",
      label: "Social isolation",
      color: "var(--cream-dark)",
      accent: "var(--text-mid)",
      desc: "Social abuse involves deliberately cutting someone off from their support network, community, and identity.",
      signs: ["Preventing contact with family and friends", "Monitoring and controlling social interactions", "Creating conflict with loved ones", "Moving frequently to isolate", "Public humiliation to damage relationships"],
      myths: [{ myth: '"They just want to spend time with me"', reality: "Healthy love supports your connections — it doesn't systematically remove them." }],
      tag: "all",
    },
  ];

  const myths = [
    { myth: "Abuse always leaves visible marks", reality: "The most damaging forms of abuse — emotional, psychological, economic — leave no physical trace." },
    { myth: "Only women experience abuse", reality: "Abuse affects all genders. Men, non-binary people, and LGBTQ+ individuals are also victims." },
    { myth: "If it were that bad, they'd leave", reality: "Leaving an abusive relationship is complex, dangerous, and often takes multiple attempts. Victim-blaming is harmful." },
    { myth: "Abuse is always obvious and extreme", reality: "Abuse often starts subtly — with small acts of control — and escalates gradually." },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section className="section" style={{ background: "var(--teal)", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 400, height: 400, background: "rgba(255,255,255,0.05)", top: -100, right: -50 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="tag" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", marginBottom: 20, display: "inline-flex" }}>
            Education Hub
          </span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 6vw, 64px)", color: "#fff", letterSpacing: "-0.03em", maxWidth: 600, marginBottom: 20 }}>
            Understanding abuse — in all its forms
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", maxWidth: 540, lineHeight: 1.7 }}>
            Knowledge is protection. Explore the different types of abuse, warning signs, myths, and how to take the first steps toward safety.
          </p>
        </div>
      </section>

      {/* Myths section */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag" style={{ marginBottom: 16 }}>Common misconceptions</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>Myths vs reality</h2>
          </div>
          <div className="grid-2">
            {myths.map((m, i) => (
              <div key={i} className="card">
                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <div style={{ background: "var(--coral-pale)", color: "var(--coral)", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>MYTH</div>
                </div>
                <p style={{ fontSize: 16, fontStyle: "italic", color: "var(--text-mid)", marginBottom: 14, lineHeight: 1.6 }}>"{m.myth}"</p>
                <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />
                <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                  <div style={{ background: "var(--teal-pale)", color: "var(--teal)", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>REALITY</div>
                </div>
                <p style={{ fontSize: 15, color: "var(--text-dark)", lineHeight: 1.7 }}>{m.reality}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abuse categories */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Types of abuse explained
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["all", "lgbtq"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "btn-primary" : "btn-outline"}
                  style={{ padding: "8px 20px", fontSize: 14 }}>
                  {tab === "all" ? "All types" : "LGBTQ+ specific"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {categories.filter(c => activeTab === "all" ? true : c.tag === activeTab).map(cat => (
              <div key={cat.id} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: 20, overflow: "hidden", transition: "box-shadow 0.2s",
              }}>
                <button
                  className="accordion-header"
                  onClick={() => setExpandedCard(expandedCard === cat.id ? null : cat.id)}
                  style={{ padding: "24px 28px", borderBottom: expandedCard === cat.id ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={cat.icon} size={22} color={cat.accent} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-dark)" }}>{cat.label}</p>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{expandedCard === cat.id ? "Tap to collapse" : "Tap to learn more"}</p>
                    </div>
                  </div>
                  <div style={{ transform: expandedCard === cat.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                    <Icon name="chevron" size={20} color="var(--text-muted)" />
                  </div>
                </button>
                {expandedCard === cat.id && (
                  <div style={{ padding: "24px 28px", animation: "fadeIn 0.3s ease" }}>
                    <p style={{ fontSize: 16, color: "var(--text-mid)", lineHeight: 1.7, marginBottom: 24 }}>{cat.desc}</p>
                    <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Warning signs</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                      {cat.signs.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                            <Icon name="check" size={11} color={cat.accent} />
                          </div>
                          <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.6 }}>{s}</p>
                        </div>
                      ))}
                    </div>
                    {cat.myths.map((m, i) => (
                      <div key={i} style={{ background: "var(--cream)", borderRadius: 12, padding: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--coral)", marginBottom: 6 }}>MYTH: "{m.myth}"</p>
                        <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6 }}>{m.reality}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--teal-pale)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Ready to talk about your experience?
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-mid)", marginBottom: 32 }}>Our AI is ready to listen — gently, privately, and without judgment.</p>
          <button className="btn-primary" onClick={() => setPage("chat")} style={{ fontSize: 16, padding: "16px 36px" }}>
            <Icon name="chat" size={18} color="#fff" />
            Start a conversation
          </button>
        </div>
      </section>
    </div>
  );
};

// ─── Resources Page ──────────────────────────────────────────────────────────
const ResourcesPage = ({ setPage }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "Is my conversation truly private?", a: "Yes. All data is transmitted via HTTPS encryption. We do not sell your data. Sessions can be kept anonymous and you are never required to share personally identifying information." },
    { q: "Can the AI diagnose my situation?", a: "No — and it never will. Our AI offers probability-based observations based on patterns in conversation. It is a supportive tool, not a clinical instrument. Always consult a licensed professional for diagnosis or advice." },
    { q: "What happens if I seem to be in immediate danger?", a: "The AI will strongly encourage you to contact emergency services immediately. It is not a crisis line. If you are in danger right now, please call your local emergency number." },
    { q: "Can I speak to a real person?", a: "Yes. You can request volunteer support through the chat or this page. Trained volunteers with psychological backgrounds can review your session and provide human guidance." },
    { q: "Who can use Break The Cycle?", a: "Anyone. The platform is built to be inclusive across all genders, ages, sexual orientations, and identities. Abuse can happen to anyone, and support should be available to everyone." },
    { q: "What if I'm not sure I'm experiencing abuse?", a: "That uncertainty is completely normal and valid. Many people are unsure — especially when abuse is subtle. Our AI is specifically designed to help you explore that uncertainty gently and without pressure." },
    { q: "Does the AI store my chat?", a: "Sessions are stored only if you choose to create an account and save them. Guest sessions are not permanently stored. We handle all data with care and minimal collection principles." },
  ];

  const steps = [
    { num: 1, title: "Open the AI chat", desc: "No sign-up needed. Click 'Start Chat' from anywhere on the site." },
    { num: 2, title: "Read the disclaimer", desc: "A short, important note about what the AI can and cannot do." },
    { num: 3, title: "Share at your pace", desc: "The AI will gently guide the conversation. Share only what you're comfortable with." },
    { num: 4, title: "Receive insights", desc: "After your conversation, you'll receive supportive observations and next steps." },
    { num: 5, title: "Request human support", desc: "If you'd like a trained volunteer to review your case, you can request that too." },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(160deg, var(--cream) 60%, var(--teal-pale))" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="tag" style={{ marginBottom: 20 }}>Resources & Help</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: "-0.03em", marginBottom: 20 }}>
            We're here to help you navigate
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-mid)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Everything you need to understand how Break The Cycle works, what our AI can and cannot do, and how to get additional support.
          </p>
        </div>
      </section>

      {/* Urgent Banner */}
      <section style={{ padding: "0 0 40px" }}>
        <div className="container">
          <div className="urgent-banner">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon name="alert" size={20} color="var(--coral)" />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--coral)", marginBottom: 6 }}>In immediate danger?</p>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6 }}>
                  Break The Cycle is not an emergency service. If you or someone else is in immediate danger, please call emergency services (112 in Europe, 911 in the USA, or your local emergency number). You can also contact the Domestic Violence Hotline or a local crisis shelter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag" style={{ marginBottom: 16 }}>Getting started</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>How to use Break The Cycle</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680, margin: "0 auto" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: 24, background: "var(--cream)", borderRadius: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "var(--teal)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontFamily: "var(--serif)", fontSize: 18, color: "#fff"
                }}>{s.num}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{s.title}</p>
                  <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What AI can/cannot do */}
      <section className="section">
        <div className="container">
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em", marginBottom: 40, textAlign: "center" }}>
            What our AI can — and cannot — do
          </h2>
          <div className="grid-2">
            <div style={{ background: "var(--teal-pale)", borderRadius: 20, padding: 32 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={18} color="#fff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--teal)" }}>Our AI can</h3>
              </div>
              {[
                "Listen with empathy and without judgment",
                "Ask gentle, thoughtful questions",
                "Identify possible patterns in what you share",
                "Offer probability-based supportive observations",
                "Suggest educational resources and next steps",
                "Recommend you seek human support when appropriate",
                "Help you understand different types of abuse",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <Icon name="check" size={16} color="var(--teal)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--coral-pale)", borderRadius: 20, padding: 32 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--coral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="close" size={18} color="#fff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--coral)" }}>Our AI cannot</h3>
              </div>
              {[
                "Diagnose you clinically or medically",
                "Provide legal advice or evidence",
                "Replace a licensed therapist or counselor",
                "Contact emergency services on your behalf",
                "Guarantee 100% accuracy in its observations",
                "Guarantee complete anonymity if law requires disclosure",
                "Provide crisis intervention",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <Icon name="minus" size={16} color="var(--coral)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="tag" style={{ marginBottom: 16 }}>FAQ</span>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>Frequently asked questions</h2>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                <button className="accordion-header" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ borderBottom: "none" }}>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>{faq.q}</span>
                  <div style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                    <Icon name="chevron" size={18} color="var(--text-muted)" />
                  </div>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 0 20px", animation: "fadeIn 0.2s ease" }}>
                    <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Support */}
      <section className="section" style={{ background: "var(--teal-pale)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Request human support
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-mid)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            If you'd like a trained volunteer to review your situation and provide personalised guidance, submit a request below.
          </p>
          <div style={{ maxWidth: 480, margin: "0 auto", background: "#fff", borderRadius: 24, padding: 32, boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Your email (optional, for follow-up)" />
              <textarea placeholder="Briefly describe what you need support with..." style={{ height: 100 }} />
              <div className="disclaimer-banner">
                <p style={{ fontSize: 12 }}>Your request will be reviewed by a trained volunteer. By submitting, you understand this is not an emergency service.</p>
              </div>
              <button className="btn-primary" style={{ justifyContent: "center", padding: "16px" }}>
                <Icon name="send" size={16} color="#fff" />
                Submit support request
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── About Page ───────────────────────────────────────────────────────────────
const AboutPage = ({ setPage }) => {
  const values = [
    { icon: "heart", title: "Compassion first", desc: "Every decision we make is guided by genuine care for the people who use this platform." },
    { icon: "shield", title: "Trust & safety", desc: "We prioritise your privacy, security, and emotional safety above all else." },
    { icon: "star", title: "Radical inclusion", desc: "Abuse knows no boundaries. Neither does our support. This platform is built for everyone." },
    { icon: "sparkle", title: "Honest AI", desc: "We believe in transparent, probability-based AI — never overclaiming, never replacing human judgment." },
    { icon: "book", title: "Education as empowerment", desc: "Knowledge breaks cycles. We believe informed people make safer, more empowered decisions." },
    { icon: "users", title: "Human connection", desc: "Technology supports, but humans heal. We always keep real people in the loop." },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section className="section" style={{
        background: "linear-gradient(160deg, var(--teal) 40%, var(--teal-light))",
        position: "relative", overflow: "hidden"
      }}>
        <div className="blob" style={{ width: 500, height: 500, background: "rgba(255,255,255,0.04)", top: -100, right: -100 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="tag" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", marginBottom: 24, display: "inline-flex" }}>
            About us
          </span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 6vw, 72px)", color: "#fff", letterSpacing: "-0.03em", maxWidth: 700, marginBottom: 28, lineHeight: 1.1 }}>
            Breaking the silence, one conversation at a time
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 560, lineHeight: 1.7 }}>
            We are young innovators who believe technology can protect people, reveal hidden harm, and transform awareness into hope.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 60, alignItems: "center" }}>
            <div>
              <span className="tag" style={{ marginBottom: 20 }}>Our story</span>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em", marginBottom: 24, lineHeight: 1.2 }}>
                Born from friendship, driven by purpose
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-mid)", lineHeight: 1.9 }}>
                We are <strong style={{ color: "var(--text-dark)" }}>BreakTheCycle</strong>, a team of young innovators using AI to uncover hidden abuse and empower people to recognize it. <strong style={{ color: "var(--text-dark)" }}>Eliza</strong> and <strong style={{ color: "var(--text-dark)" }}>Ioana</strong> (bronze medalist, 3rd place at the International Conference of Young Scientists – Engineering), best friends since age six, share a deep passion for technology, and together with <strong style={{ color: "var(--text-dark)" }}>Daria</strong>—connected through our love for horses, computer science, and design—we channel our bond into one mission: <em style={{ color: "var(--teal)" }}>breaking the silence, protecting youth, and transforming awareness into hope.</em>
              </p>
            </div>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { name: "Eliza", role: "Technology & AI Lead", initial: "E" },
                  { name: "Ioana", role: "Research & Awareness", initial: "I" },
                  { name: "Daria", role: "Design & Product", initial: "D" },
                ].map(member => (
                  <div key={member.name} className="card" style={{ display: "flex", gap: 16, alignItems: "center", padding: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%", background: "var(--teal)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--serif)", fontSize: 24, color: "#fff", flexShrink: 0
                    }}>{member.initial}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16, color: "var(--text-dark)" }}>{member.name}</p>
                      <p style={{ fontSize: 13, color: "var(--teal)", fontWeight: 500 }}>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: "var(--teal-pale)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="tag" style={{ marginBottom: 20 }}>Our mission</span>
          <blockquote style={{
            fontFamily: "var(--serif)", fontSize: "clamp(24px, 4vw, 40px)",
            color: "var(--text-dark)", lineHeight: 1.4, maxWidth: 800, margin: "0 auto 32px",
            letterSpacing: "-0.02em", fontStyle: "italic"
          }}>
            "To use technology as a force for human dignity — helping people recognise abuse, find their voice, and access the support they deserve."
          </blockquote>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["Awareness", "Recognition", "Support", "Empowerment", "Hope"].map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
              What we stand for
            </h2>
          </div>
          <div className="grid-3">
            {values.map(v => (
              <div key={v.title} className="card">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={v.icon} size={22} color="var(--teal)" />
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 10, letterSpacing: "-0.02em" }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

// ─── Storage helpers (localStorage) ──────────────────────────────────────────
const DB = {
  async getUsers() {
    try { return JSON.parse(localStorage.getItem('btc:users') || '{}'); } catch { return {}; }
  },
  async saveUsers(users) {
    try { localStorage.setItem('btc:users', JSON.stringify(users)); } catch {}
  },
  async getSession() {
    try { const r = localStorage.getItem('btc:session'); return r ? JSON.parse(r) : null; } catch { return null; }
  },
  async saveSession(user) {
    try { localStorage.setItem('btc:session', JSON.stringify(user)); } catch {}
  },
  async clearSession() {
    try { localStorage.removeItem('btc:session'); } catch {}
  },
  async getChatSessions(userId) {
    try { return JSON.parse(localStorage.getItem('btc:chats:' + userId) || '[]'); } catch { return []; }
  },
  async saveChatSession(userId, session) {
    try {
      const sessions = await DB.getChatSessions(userId);
      const idx = sessions.findIndex(s => s.id === session.id);
      if (idx >= 0) sessions[idx] = session; else sessions.unshift(session);
      localStorage.setItem('btc:chats:' + userId, JSON.stringify(sessions.slice(0, 20)));
    } catch {}
  },
  async getVolApp(userId) {
    try { const r = localStorage.getItem('btc:volapp:' + userId); return r ? JSON.parse(r) : null; } catch { return null; }
  },
  async saveVolApp(userId, app) {
    try { localStorage.setItem('btc:volapp:' + userId, JSON.stringify(app)); } catch {}
  },
};

// ─── Auth Modal ───────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onAuth }) => {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateSignIn = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateSignUp = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email address";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;
    setLoading(true);
    const users = await DB.getUsers();
    const key = form.email.toLowerCase();
    const u = users[key];
    if (!u) { setErrors({ email: "No account found with this email" }); setLoading(false); return; }
    if (u.password !== form.password) { setErrors({ password: "Incorrect password" }); setLoading(false); return; }
    const userData = { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.name[0].toUpperCase() };
    await DB.saveSession(userData);
    onAuth(userData);
    setLoading(false); onClose();
  };

  const handleSignUpNext = () => { if (validateSignUp()) setStep(2); };

  const handleSignUpSubmit = async () => {
    setLoading(true);
    const users = await DB.getUsers();
    const key = form.email.toLowerCase();
    if (users[key]) { setErrors({ email: "An account with this email already exists" }); setStep(1); setLoading(false); return; }
    const newUser = {
      id: 'u_' + Date.now(),
      name: form.name, email: form.email, password: form.password,
      role: form.role, createdAt: new Date().toISOString(),
    };
    users[key] = newUser;
    await DB.saveUsers(users);
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.name[0].toUpperCase() };
    await DB.saveSession(userData);
    onAuth(userData);
    setLoading(false); onClose();
  };

  const Field = ({ label, type = "text", placeholder, error, val, onChange }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>{label}</label>
      <input type={type} placeholder={placeholder} value={val} onChange={e => onChange(e.target.value)}
        style={{ borderColor: error ? "var(--coral)" : undefined }} />
      {error && <p style={{ fontSize: 12, color: "var(--coral)" }}>{error}</p>}
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(28,28,26,0.55)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "fadeIn 0.2s ease"
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 28, padding: 40, width: "100%", maxWidth: 460,
        maxHeight: "90vh", overflowY: "auto", animation: "fadeUp 0.3s ease",
        boxShadow: "var(--shadow-lg)", position: "relative"
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ margin: "0 auto 14px", display: "flex", justifyContent: "center" }}>
            <Emblem size={60} />
          </div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "-0.03em", marginBottom: 6 }}>
            {mode === "signin" ? "Welcome back" : step === 1 ? "Create your account" : "How will you use the platform?"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            {mode === "signin" ? "Sign in to your Break The Cycle account" : step === 1 ? "Your data is saved securely on this device" : "This helps us personalise your experience"}
          </p>
        </div>

        {step === 1 && (
          <div style={{ display: "flex", background: "var(--cream)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[{ id: "signin", label: "Sign in" }, { id: "signup", label: "Create account" }].map(t => (
              <button key={t.id} onClick={() => { setMode(t.id); setErrors({}); }}
                style={{
                  flex: 1, padding: "10px 0", border: "none", borderRadius: 9, cursor: "pointer",
                  fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                  background: mode === t.id ? "#fff" : "transparent",
                  color: mode === t.id ? "var(--teal)" : "var(--text-muted)",
                  boxShadow: mode === t.id ? "var(--shadow-sm)" : "none"
                }}>{t.label}</button>
            ))}
          </div>
        )}

        {mode === "signin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Email address" type="email" placeholder="you@example.com" val={form.email} onChange={v => set("email", v)} error={errors.email} />
            <Field label="Password" type="password" placeholder="Your password" val={form.password} onChange={v => set("password", v)} error={errors.password} />
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: 15, marginTop: 4 }}
              onClick={handleSignIn} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <span style={{ color: "var(--teal)", cursor: "pointer", fontWeight: 500 }} onClick={() => { setMode("signup"); setErrors({}); }}>Create one</span>
            </p>
          </div>
        )}

        {mode === "signup" && step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Full name" placeholder="Your name" val={form.name} onChange={v => set("name", v)} error={errors.name} />
            <Field label="Email address" type="email" placeholder="you@example.com" val={form.email} onChange={v => set("email", v)} error={errors.email} />
            <Field label="Password" type="password" placeholder="At least 8 characters" val={form.password} onChange={v => set("password", v)} error={errors.password} />
            <Field label="Confirm password" type="password" placeholder="Repeat your password" val={form.confirmPassword} onChange={v => set("confirmPassword", v)} error={errors.confirmPassword} />
            <div className="disclaimer-banner" style={{ fontSize: 12 }}>
              <Icon name="lock" size={13} color="var(--amber)" /> Contul tău e salvat pe acest dispozitiv. Nu vindem niciodată datele tale.
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: 15 }} onClick={handleSignUpNext}>
              Continue <Icon name="arrow" size={16} color="#fff" />
            </button>
          </div>
        )}

        {mode === "signup" && step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { id: "user", icon: "heart", title: "I'm here for support", desc: "Access the AI chat, save sessions, and explore resources." },
              { id: "volunteer", icon: "users", title: "I want to volunteer", desc: "Review flagged sessions and support users as a trained volunteer." },
            ].map(r => (
              <div key={r.id} onClick={() => set("role", r.id)} style={{
                padding: 20, borderRadius: 16, cursor: "pointer", transition: "all 0.2s",
                border: "2px solid " + (form.role === r.id ? "var(--teal)" : "var(--border)"),
                background: form.role === r.id ? "var(--teal-pale)" : "#fff",
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: form.role === r.id ? "var(--teal)" : "var(--cream-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={r.icon} size={18} color={form.role === r.id ? "#fff" : "var(--text-muted)"} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-dark)", marginBottom: 4 }}>{r.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{r.desc}</p>
                  </div>
                  {form.role === r.id && (
                    <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="check" size={12} color="#fff" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {form.role === "volunteer" && (
              <div style={{ padding: 14, background: "var(--amber-pale)", borderRadius: 12, fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6 }}>
                <Icon name="info" size={13} color="var(--amber)" /> Volunteer accounts are reviewed before activation. You'll complete an application after registration.
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: 14 }} onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" style={{ flex: 2, justifyContent: "center", padding: 14, fontSize: 15 }}
                onClick={handleSignUpSubmit} disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 8 }}>
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
};

// ─── User Dashboard ────────────────────────────────────────────────────────────
const DashboardPage = ({ user, setPage, onSignOut }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DB.getChatSessions(user.id).then(s => { setSessions(s); setLoading(false); });
  }, [user.id]);

  const riskColor = { low: "var(--teal)", moderate: "var(--amber)", high: "var(--coral)" };
  const riskBg   = { low: "var(--teal-pale)", moderate: "var(--amber-pale)", high: "var(--coral-pale)" };

  const stats = [
    { label: "Sessions", value: String(sessions.length) },
    { label: "Insights received", value: String(sessions.filter(s => s.hasSummary).length) },
    { label: "Days active", value: sessions.length > 0 ? String(new Set(sessions.map(s => s.date?.split(',')[0])).size) : "0" },
    { label: "Messages sent", value: String(sessions.reduce((a, s) => a + (s.messageCount || 0), 0)) },
  ];

  const isVolunteer = user.role === "volunteer";

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--cream)" }}>
      <div style={{ background: "var(--teal)", padding: "48px 0 80px", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 300, height: 300, background: "rgba(255,255,255,0.05)", top: -80, right: -40 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontSize: 22, color: "#fff" }}>
              {user.avatar}
            </div>
            <div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>Welcome back</p>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, color: "#fff", letterSpacing: "-0.03em" }}>{user.name}</h1>
            </div>
            <button className="btn-ghost" onClick={onSignOut} style={{ marginLeft: "auto", color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Sign out</button>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px" }}>
            <Icon name={isVolunteer ? "users" : "heart"} size={14} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{isVolunteer ? "Volunteer" : "Registered user"} · {user.email}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -48, paddingBottom: 60 }}>
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 18, padding: "20px 24px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 32, fontFamily: "var(--serif)", color: "var(--teal)", letterSpacing: "-0.03em", marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "-0.02em" }}>Your sessions</h2>
              <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setPage("chat")}>
                <Icon name="plus" size={14} color="#fff" /> New
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontSize: 14 }}>Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: 32, textAlign: "center", border: "1px solid var(--border)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Icon name="chat" size={22} color="var(--teal)" />
                </div>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>No sessions yet</p>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>Start a conversation with the AI to see your sessions here.</p>
                <button className="btn-primary" style={{ fontSize: 14, padding: "10px 22px" }} onClick={() => setPage("chat")}>
                  Start first conversation
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {sessions.map(s => (
                  <div key={s.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.date}</p>
                      {s.risk && <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: riskBg[s.risk] || riskBg.low, color: riskColor[s.risk] || riskColor.low, textTransform: "capitalize" }}>{s.risk} risk</span>}
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6, marginBottom: s.tags?.length ? 12 : 0 }}>{s.preview}</p>
                    {s.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {s.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11, padding: "3px 10px" }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "var(--teal)", borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
              <div className="blob" style={{ width: 200, height: 200, background: "rgba(255,255,255,0.06)", top: -60, right: -40 }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fff", marginBottom: 10, position: "relative", zIndex: 1 }}>Continue your journey</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", marginBottom: 20, lineHeight: 1.6, position: "relative", zIndex: 1 }}>Your AI support assistant is ready to listen whenever you are.</p>
              <button className="btn-primary" onClick={() => setPage("chat")} style={{ background: "#fff", color: "var(--teal)", position: "relative", zIndex: 1, padding: "12px 22px", fontSize: 14 }}>
                <Icon name="chat" size={16} color="var(--teal)" /> Open chat
              </button>
            </div>

            {!isVolunteer && (
              <div className="card">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="users" size={18} color="var(--teal)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Become a volunteer</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>Help others on their journey by joining our trained volunteer team.</p>
                  </div>
                </div>
                <button className="btn-outline" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }} onClick={() => setPage("volunteer")}>
                  Apply now <Icon name="arrow" size={14} color="var(--teal)" />
                </button>
              </div>
            )}

            {isVolunteer && (
              <div className="card" style={{ background: "var(--teal-pale)", border: "1.5px solid var(--teal-mid)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="shield" size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: "var(--teal)", marginBottom: 4 }}>Volunteer panel</p>
                    <p style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.6 }}>Review sessions that need human support.</p>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }} onClick={() => setPage("volpanel")}>
                  Open review panel <Icon name="arrow" size={14} color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Volunteer Application Page ────────────────────────────────────────────────
const VolunteerPage = ({ user, setPage }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [form, setForm] = useState({ background: "", motivation: "", experience: "", hours: "", training: "", languages: "", agree: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const totalSteps = 3;

  useEffect(() => {
    if (user) {
      DB.getVolApp(user.id).then(existing => {
        if (existing) setSubmitted(true);
        setCheckingExisting(false);
      });
    } else { setCheckingExisting(false); }
  }, [user?.id]);

  const handleSubmit = async () => {
    setLoading(true);
    const app = { ...form, userId: user?.id, email: user?.email, submittedAt: new Date().toISOString(), status: "pending" };
    if (user) await DB.saveVolApp(user.id, app);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false); setSubmitted(true);
  };

  if (checkingExisting) return <div style={{ paddingTop: 120, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;

  if (submitted) {
    return (
      <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
        <div style={{ textAlign: "center", maxWidth: 480, animation: "fadeUp 0.6s ease" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Icon name="check" size={36} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, letterSpacing: "-0.03em", marginBottom: 16 }}>Application submitted</h1>
          <p style={{ fontSize: 17, color: "var(--text-mid)", lineHeight: 1.7, marginBottom: 32 }}>
            Thank you for wanting to make a difference. Our team will review your application and reach out within 5–7 working days.
          </p>
          <div style={{ background: "var(--teal-pale)", borderRadius: 16, padding: 20, marginBottom: 32, textAlign: "left" }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: "var(--teal)", marginBottom: 8 }}>What happens next?</p>
            {["Your application is reviewed by our team", "You may be invited to a short online interview", "Volunteers receive onboarding and guidance materials", "Access to the volunteer panel is granted"].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--teal)", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6 }}>{s}</p>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setPage(user ? "dashboard" : "home")}>
            <Icon name="home" size={16} color="#fff" /> Return to {user ? "dashboard" : "home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <section style={{ background: "var(--teal)", padding: "56px 0", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 360, height: 360, background: "rgba(255,255,255,0.05)", top: -80, right: -60 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <button className="btn-ghost" onClick={() => setPage(user ? "dashboard" : "home")} style={{ color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
            <Icon name="arrow" size={16} color="rgba(255,255,255,0.7)" style={{ transform: "rotate(180deg)" }} /> Back
          </button>
          <span className="tag" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", marginBottom: 20, display: "inline-flex" }}>
            <Icon name="users" size={14} color="rgba(255,255,255,0.85)" /> Volunteer programme
          </span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 56px)", color: "#fff", letterSpacing: "-0.03em", maxWidth: 600, marginBottom: 16, lineHeight: 1.1 }}>
            Help break the cycle for someone else
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", maxWidth: 520, lineHeight: 1.7 }}>
            Our volunteers are trained, compassionate individuals who review sessions and offer human support when someone needs it most.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "48px 0" }}>
        <div className="container">
          <div className="grid-3">
            {[
              { icon: "eye", title: "Review flagged sessions", desc: "Read AI-flagged conversations where users may need additional human support." },
              { icon: "heart", title: "Provide human warmth", desc: "Add personal notes, follow-up messages, and direct referrals to real services." },
              { icon: "book", title: "Support with expertise", desc: "Use your background in psychology, social work, or lived experience to guide users." },
            ].map(item => (
              <div key={item.title} style={{ textAlign: "center", padding: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon name={item.icon} size={24} color="var(--teal)" />
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 19, marginBottom: 8, letterSpacing: "-0.02em" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>Step {step} of {totalSteps}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{["About you", "Experience & availability", "Commitment"][step - 1]}</p>
              </div>
              <div className="progress-bar"><div className="progress-bar-fill" style={{ width: ((step / totalSteps) * 100) + "%" }} /></div>
            </div>

            <div className="card" style={{ padding: 36 }}>
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.3s ease" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, letterSpacing: "-0.02em", marginBottom: 8 }}>About you</h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Tell us a little about your background and why you want to volunteer.</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>Your professional or personal background</label>
                    <textarea placeholder="e.g. Social worker, psychologist, survivor, student in psychology..." value={form.background} onChange={e => set("background", e.target.value)} style={{ height: 100 }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>Why do you want to volunteer with Break The Cycle?</label>
                    <textarea placeholder="Share your motivation..." value={form.motivation} onChange={e => set("motivation", e.target.value)} style={{ height: 120 }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>Languages you're comfortable supporting in</label>
                    <input placeholder="e.g. English, Romanian, Spanish..." value={form.languages} onChange={e => set("languages", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.3s ease" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, letterSpacing: "-0.02em", marginBottom: 8 }}>Experience & availability</h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Help us understand your experience and how much time you can commit.</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>Relevant experience with abuse, mental health, or support work</label>
                    <textarea placeholder="Describe any professional training, volunteer work, or lived experience..." value={form.experience} onChange={e => set("experience", e.target.value)} style={{ height: 110 }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>How many hours per week can you commit?</label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {["1–2 hours", "3–5 hours", "5–10 hours", "10+ hours"].map(h => (
                        <button key={h} onClick={() => set("hours", h)} style={{
                          padding: "10px 18px", borderRadius: 100,
                          border: "1.5px solid " + (form.hours === h ? "var(--teal)" : "var(--border-mid)"),
                          background: form.hours === h ? "var(--teal-pale)" : "#fff",
                          color: form.hours === h ? "var(--teal)" : "var(--text-mid)",
                          cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, transition: "all 0.15s"
                        }}>{h}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>Any training you'd like us to provide?</label>
                    <textarea placeholder="e.g. trauma-informed communication, de-escalation techniques..." value={form.training} onChange={e => set("training", e.target.value)} style={{ height: 90 }} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.3s ease" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, letterSpacing: "-0.02em", marginBottom: 8 }}>Your commitment</h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Before you submit, please read and acknowledge these important guidelines.</p>
                  </div>
                  {["I understand that volunteering requires empathy, confidentiality, and a non-judgmental approach.",
                    "I will not provide medical, legal, or therapeutic advice — only compassionate, informed guidance.",
                    "I understand that all user data I access is strictly confidential.",
                    "I am committed to completing any onboarding materials provided by Break The Cycle.",
                    "I understand my volunteer access can be revoked if guidelines are not followed.",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: 16, background: "var(--cream)", borderRadius: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: "1.5px solid var(--border-mid)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="check" size={12} color="var(--teal)" />
                      </div>
                      <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 12, padding: 16, background: "var(--teal-pale)", borderRadius: 14, border: "1.5px solid var(--teal-mid)", cursor: "pointer" }}
                    onClick={() => set("agree", !form.agree)}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, border: "2px solid " + (form.agree ? "var(--teal)" : "var(--border-mid)"), background: form.agree ? "var(--teal)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                      {form.agree && <Icon name="check" size={13} color="#fff" />}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--teal)", lineHeight: 1.6 }}>I have read and agree to all the guidelines above.</p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                {step > 1 && <button className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: 14 }} onClick={() => setStep(s => s - 1)}>Back</button>}
                {step < totalSteps ? (
                  <button className="btn-primary" style={{ flex: 2, justifyContent: "center", padding: 14, fontSize: 15 }} onClick={() => setStep(s => s + 1)}>
                    Continue <Icon name="arrow" size={16} color="#fff" />
                  </button>
                ) : (
                  <button className="btn-primary" style={{ flex: 2, justifyContent: "center", padding: 14, fontSize: 15 }}
                    onClick={handleSubmit} disabled={!form.agree || loading}>
                    {loading ? "Submitting..." : "Submit application"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Volunteer Panel ───────────────────────────────────────────────────────────
const VolunteerPanel = ({ user, setPage }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [note, setNote] = useState("");
  const [reviewed, setReviewed] = useState({});

  const flagged = [
    { id: 1, date: "Today 09:12", risk: "high", tags: ["Physical", "Domestic"], preview: "User described repeated incidents of physical confrontation at home, mentions fear of returning...", messages: 14 },
    { id: 2, date: "Yesterday 22:41", risk: "moderate", tags: ["Emotional", "Economic"], preview: "Conversation revealed patterns of financial control and repeated belittling in a long-term relationship...", messages: 9 },
    { id: 3, date: "2 days ago", risk: "moderate", tags: ["Cyber", "Social"], preview: "User mentioned being monitored online and cut off from close friends. Seems isolated...", messages: 7 },
  ];

  const riskColor = { low: "var(--teal)", moderate: "var(--amber)", high: "var(--coral)" };
  const riskBg   = { low: "var(--teal-pale)", moderate: "var(--amber-pale)", high: "var(--coral-pale)" };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--cream)" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <button className="btn-ghost" onClick={() => setPage("dashboard")} style={{ padding: "4px 8px" }}>
                  <Icon name="arrow" size={15} color="var(--text-mid)" style={{ transform: "rotate(180deg)" }} />
                </button>
                <span className="tag"><Icon name="shield" size={13} color="var(--teal)" /> Volunteer Panel</span>
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, letterSpacing: "-0.03em" }}>Review queue</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>Logged in as volunteer</p>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{user.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: "Flagged sessions", value: String(flagged.length), color: "var(--coral)" },
            { label: "Reviewed today", value: String(Object.keys(reviewed).length), color: "var(--teal)" },
            { label: "Pending review", value: String(flagged.length - Object.keys(reviewed).length), color: "var(--amber)" },
            { label: "Total reviewed", value: String(18 + Object.keys(reviewed).length), color: "var(--text-dark)" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 18, padding: "20px 24px", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 32, fontFamily: "var(--serif)", color: s.color, letterSpacing: "-0.03em", marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: activeSession ? "1fr 1fr" : "1fr", gap: 24 }}>
          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "-0.02em", marginBottom: 16 }}>Flagged sessions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {flagged.map(s => (
                <div key={s.id} className="card" style={{ padding: 22, cursor: "pointer", border: activeSession?.id === s.id ? "2px solid var(--teal)" : undefined }}
                  onClick={() => setActiveSession(activeSession?.id === s.id ? null : s)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 100, background: riskBg[s.risk], color: riskColor[s.risk], textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.risk} risk</span>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.date} · {s.messages} messages</p>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.6, marginBottom: 12 }}>{s.preview}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {s.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11, padding: "2px 10px" }}>{t}</span>)}
                    </div>
                    {reviewed[s.id] && <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 500 }}>✓ Reviewed</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeSession && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "-0.02em", marginBottom: 16 }}>Review session</h2>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 100, background: riskBg[activeSession.risk], color: riskColor[activeSession.risk], textTransform: "uppercase" }}>{activeSession.risk} risk</span>
                  {activeSession.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                </div>
                <div style={{ background: "var(--cream)", borderRadius: 14, padding: 16, marginBottom: 20, fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8, color: "var(--text-dark)" }}>AI Session Summary</p>
                  {activeSession.preview}<br /><br />
                  The AI detected language patterns consistent with {activeSession.tags.join(" and ")} abuse indicators. Confidence: moderate-high.
                </div>
                <div className="urgent-banner" style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: "var(--coral)", fontWeight: 600, marginBottom: 4 }}>Volunteer reminder</p>
                  <p style={{ fontSize: 12, color: "var(--text-mid)" }}>Do not provide legal or clinical advice. Offer compassionate guidance and refer to professional services where appropriate.</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)", display: "block", marginBottom: 6 }}>Your notes & assessment</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add your observations and recommended next steps..." style={{ height: 110, width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {["Refer to services", "Send resources", "Escalate to admin", "Mark safe"].map(action => (
                    <button key={action} className="btn-outline" style={{ fontSize: 12, padding: "8px 12px" }}>{action}</button>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }}
                  onClick={() => { setReviewed(r => ({ ...r, [activeSession.id]: true })); setActiveSession(null); setNote(""); }}>
                  <Icon name="check" size={16} color="#fff" /> Mark as reviewed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Restore session on load
  useEffect(() => {
    DB.getSession().then(saved => {
      if (saved) setUser(saved);
      setAppReady(true);
    });
  }, []);

  const handleSetPage = useCallback((p) => {
    if ((p === "dashboard" || p === "volpanel") && !user) { setShowAuth(true); return; }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [user]);

  const handleAuth = (userData) => { setUser(userData); setPage("dashboard"); };

  const handleSignOut = async () => {
    await DB.clearSession();
    setUser(null); setPage("home");
  };

  const handleSaveChatSession = useCallback(async (sessionData) => {
    if (user) await DB.saveChatSession(user.id, sessionData);
  }, [user]);

  if (!appReady) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <div style={{ textAlign: "center" }}>
        <Emblem size={64} />
        <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  );

  const pages = {
    home: <LandingPage setPage={handleSetPage} />,
    chat: <ChatPage user={user} onSaveSession={handleSaveChatSession} />,
    education: <EducationPage setPage={handleSetPage} />,
    resources: <ResourcesPage setPage={handleSetPage} />,
    about: <AboutPage setPage={handleSetPage} />,
    dashboard: user ? <DashboardPage user={user} setPage={handleSetPage} onSignOut={handleSignOut} /> : null,
    volunteer: <VolunteerPage user={user} setPage={handleSetPage} />,
    volpanel: user?.role === "volunteer" ? <VolunteerPanel user={user} setPage={handleSetPage} /> : null,
  };

  const isChat = page === "chat";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}

      {!isChat && (
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(247,248,246,0.93)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <button onClick={() => handleSetPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <Emblem size={38} />
              <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--text-dark)", letterSpacing: "-0.02em" }}>Break The Cycle</span>
            </button>
            <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[{ key: "home", label: "Home" }, { key: "chat", label: "AI Support" }, { key: "education", label: "Learn" }, { key: "resources", label: "Resources" }, { key: "about", label: "About Us" }].map(item => (
                <button key={item.key} className={"nav-link " + (page === item.key ? "active" : "")} onClick={() => handleSetPage(item.key)}>{item.label}</button>
              ))}
            </div>
            <div className="hide-mobile" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {user ? (
                <button onClick={() => handleSetPage("dashboard")} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--teal-pale)", border: "1px solid var(--teal-mid)", borderRadius: 100, padding: "7px 16px 7px 8px", cursor: "pointer" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontSize: 13, color: "#fff" }}>{user.avatar}</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--teal)" }}>{user.name}</span>
                </button>
              ) : (
                <>
                  <button className="btn-ghost" onClick={() => setShowAuth(true)}>Sign in</button>
                  <button className="btn-primary" onClick={() => handleSetPage("chat")} style={{ padding: "10px 20px", fontSize: 14 }}>
                    <Icon name="chat" size={15} color="#fff" /> Start Chat
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {isChat && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(247,248,246,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", height: 64, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
          <button onClick={() => handleSetPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <Emblem size={34} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 17 }}>Break The Cycle</span>
          </button>
          <button className="btn-ghost" onClick={() => handleSetPage("home")}>
            <Icon name="arrow" size={16} color="var(--text-mid)" /> Back to home
          </button>
        </div>
      )}

      <main style={{ flex: 1 }}>{pages[page] ?? <LandingPage setPage={handleSetPage} />}</main>
      {!isChat && page !== "dashboard" && page !== "volpanel" && <Footer setPage={handleSetPage} />}
    </div>
  );
}
