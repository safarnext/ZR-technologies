"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Lenis from "@studio-freight/lenis";

const services = [
  ["🌐", "Website Development", "Fast, responsive websites with polished interactions, admin dashboards and enquiry systems."],
  ["🔗", "Domains & Hosting", "Domain registration, DNS, SSL and dependable hosting configured the right way."],
  ["☁️", "Cloudflare Setup", "Pages, security, caching, Turnstile and Workers for speed and protection."],
  ["✉️", "Business Email", "Professional email on your own domain with SPF, DKIM and DMARC configuration."],
  ["⚙️", "Backend & APIs", "Databases, APIs, integrations, payments and operational dashboards."],
  ["🤖", "Automation", "Lead capture, alerts, follow-ups and reports that reduce repetitive work."]
];

const steps = [
  ["01", "Discover", "We understand your business, audience and goals before touching any code."],
  ["02", "Design", "Clean, modern layouts with motion that supports your message instead of distracting from it."],
  ["03", "Develop", "Fast, secure builds with the backend, forms and automation your team needs."],
  ["04", "Deploy & Support", "Launch with monitoring, backups and ongoing improvements."]
];

function Background3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer, scene, camera, points, group, frame;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 7;

      const count = window.innerWidth < 768 ? 550 : 1200;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const b = Math.acos(2 * Math.random() - 1);
        const d = 3 + Math.random() * 7;
        positions[i * 3] = d * Math.sin(b) * Math.cos(a);
        positions[i * 3 + 1] = d * Math.sin(b) * Math.sin(a);
        positions[i * 3 + 2] = d * Math.cos(b);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      points = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color: 0x20d9ff, size: 0.025, transparent: true, opacity: 0.65 })
      );
      group = new THREE.Group();
      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.45, 1),
        new THREE.MeshBasicMaterial({ color: 0x20d9ff, wireframe: true, transparent: true, opacity: 0.24 })
      );
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.65, 0),
        new THREE.MeshBasicMaterial({ color: 0x72edff, wireframe: true, transparent: true, opacity: 0.5 })
      );
      group.add(wire, core);
      scene.add(points, group);

      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.12;
        group.rotation.x = Math.sin(t * 0.2) * 0.15;
        points.rotation.y = t * 0.012;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        scene?.traverse((obj) => {
          obj.geometry?.dispose?.();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
        renderer?.dispose();
      };
    } catch (e) {
      console.warn("3D background unavailable:", e);
    }
  }, []);

  return <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />;
}

function MotionSetup() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.from(".hero-kicker", { y: 18, opacity: 0, duration: 0.7, delay: 0.15 });
      gsap.from(".hero-line", { yPercent: 110, opacity: 0, stagger: 0.12, duration: 0.95, ease: "power4.out", delay: 0.25 });
      gsap.from(".hero-copy, .hero-actions", { y: 24, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.55 });
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 42, opacity: 0, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true }
        });
      });
      gsap.from(".service-card", {
        y: 48, opacity: 0, stagger: 0.09, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: ".services-grid", start: "top 82%", once: true }
      });
      gsap.utils.toArray(".metric-number").forEach((el) => {
        const target = Number(el.dataset.value);
        const value = { n: 0 };
        gsap.to(value, {
          n: target, duration: 1.8, ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => { el.textContent = `${Math.round(value.n)}${el.dataset.suffix || "+"}`; }
        });
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);
  return null;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const whatsappNumber = "923000000000"; // Replace with your real WhatsApp number.

  const sendWhatsApp = () => {
    const text = `Name: ${form.name}\nPhone: ${form.phone}\nProject: ${form.message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <MotionSetup />
      <Background3D />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="top-progress" />
      <nav className="site-nav">
        <div className="nav-wrap container">
          <a href="#top" className="brand" aria-label="ZR Technologies home">
            <span className="brand-mark">ZR</span>
            <span>ZR <b>Technologies</b></span>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            <span>{menuOpen ? "✕" : "☰"}</span>
          </button>
          <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            {["Services", "Process", "Results", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
            ))}
          </div>
          <a href="#contact" className="nav-cta">Get a Quote <span>↗</span></a>
        </div>
      </nav>

      <main id="top">
        <header className="hero container">
          <div className="hero-content">
            <div className="hero-kicker"><span className="status-dot" /> DIGITAL SOLUTIONS THAT MOVE YOU FORWARD</div>
            <h1>
              <span className="hero-line">We Build</span>
              <span className="hero-line gradient-text">Digital Power.</span>
            </h1>
            <p className="hero-copy">
              Professional websites, domains, Cloudflare setup, business email, backend and automation —
              engineered to make your business faster, smarter and ready to grow.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="button button-primary">Start a Project <span>↗</span></a>
              <a href="#services" className="button button-ghost">Explore Services <span>↓</span></a>
            </div>
            <div className="hero-proof"><span className="proof-line" /> DESIGN <i>•</i> DEVELOPMENT <i>•</i> DEPLOYMENT</div>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <div className="orbit-core"><span>ZR</span><small>TECHNOLOGY<br/>IN MOTION</small></div>
            <span className="orbit-tag tag-top">BUILD / 01</span>
            <span className="orbit-tag tag-bottom">INNOVATE / 24-7</span>
          </div>
          <a href="#services" className="scroll-cue"><span /> SCROLL TO EXPLORE</a>
        </header>

        <div className="ticker" aria-label="Our capabilities">
          <div className="ticker-track">
            {Array.from({ length: 2 }).map((_, i) => <div className="ticker-set" key={i}>
              {["WEBSITES", "CLOUDFLARE", "DOMAINS", "BUSINESS EMAIL", "BACKEND", "AUTOMATION"].map((x) => <span key={x}>{x}<i>✳</i></span>)}
            </div>)}
          </div>
        </div>

        <section id="services" className="section container">
          <div className="section-heading reveal">
            <div className="eyebrow">01 / WHAT WE DO</div>
            <h2>Technology built around <span className="gradient-text">your next move.</span></h2>
            <p>From your first website to connected business systems, we bring the pieces together.</p>
          </div>
          <div className="services-grid">
            {services.map(([icon, title, desc], i) => <article className="service-card" key={title}>
              <div className="card-top"><span className="service-icon">{icon}</span><span className="card-index">0{i + 1}</span></div>
              <h3>{title}</h3><p>{desc}</p><a href="#contact" className="card-link">Discuss this service <span>↗</span></a>
            </article>)}
          </div>
        </section>

        <section id="process" className="section process-section">
          <div className="container">
            <div className="section-heading reveal">
              <div className="eyebrow">02 / HOW WE WORK</div>
              <h2>From first idea to <span className="gradient-text">live launch.</span></h2>
              <p>A clear process. Thoughtful execution. No unnecessary complexity.</p>
            </div>
            <div className="process-grid">
              {steps.map(([n, title, desc]) => <article className="process-card reveal" key={n}>
                <span className="process-number">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="process-arrow">↗</span>
              </article>)}
            </div>
          </div>
        </section>

        <section id="results" className="section container">
          <div className="metrics-panel reveal">
            <div className="eyebrow">03 / THE STANDARD</div>
            <h2>Built with purpose.<br/><span className="gradient-text">Focused on outcomes.</span></h2>
            <div className="metrics-grid">
              <div><b className="metric-number" data-value="50">0+</b><span>Project target*</span></div>
              <div><b className="metric-number" data-value="99" data-suffix="%">0%</b><span>Uptime goal*</span></div>
              <div><b className="metric-number" data-value="24" data-suffix="/7">0/7</b><span>Support availability*</span></div>
              <div><b className="metric-number" data-value="100" data-suffix="%">0%</b><span>Client-focused</span></div>
            </div>
            <p className="metrics-note">*Replace illustrative figures with verified business statistics before publishing.</p>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-layout">
            <div className="contact-copy reveal">
              <div className="eyebrow">04 / LET'S CONNECT</div>
              <h2>Have a big idea?<br/><span className="gradient-text">Let's build it.</span></h2>
              <p>Tell us what you're planning. We'll help you map the next step.</p>
              <div className="contact-note"><span className="status-dot" /> Available for new projects</div>
            </div>
            <div className="contact-card reveal">
              <label>Your name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" /></label>
              <label>Phone / WhatsApp<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 ..." /></label>
              <label>Tell us about your project<textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="A few details about your idea..." /></label>
              <button onClick={sendWhatsApp} className="button button-primary send-button">Continue on WhatsApp <span>↗</span></button>
              <small>Your details will be placed into a WhatsApp message for you to review and send.</small>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#top" className="brand"><span className="brand-mark">ZR</span><span>ZR <b>Technologies</b></span></a>
          <p>Code • Cloud • Connect.</p>
          <span>© {new Date().getFullYear()} ZR Technologies</span>
        </div>
      </footer>
    </>
  );
}
