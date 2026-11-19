
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Lenis from "@studio-freight/lenis";

const services = [
  {
    number: "01",
    icon: "⌘",
    title: "Website Development",
    description:
      "High-performance websites, premium interfaces, admin dashboards and enquiry systems built around your business.",
    tags: ["Next.js", "React", "UI / UX"],
  },
  {
    number: "02",
    icon: "◎",
    title: "Domains & Hosting",
    description:
      "Domain registration, DNS management, SSL configuration and dependable hosting infrastructure.",
    tags: ["DNS", "SSL", "Hosting"],
  },
  {
    number: "03",
    icon: "◈",
    title: "Cloudflare Solutions",
    description:
      "Cloudflare Pages, security, caching, Workers and performance optimization for modern websites.",
    tags: ["Pages", "Security", "CDN"],
  },
  {
    number: "04",
    icon: "✉",
    title: "Business Email",
    description:
      "Professional domain-based email with SPF, DKIM and DMARC configuration for reliable communication.",
    tags: ["Email", "SPF", "DMARC"],
  },
  {
    number: "05",
    icon: "⌘",
    title: "Backend & APIs",
    description:
      "Databases, APIs, integrations, payments and operational dashboards that connect your systems.",
    tags: ["APIs", "Database", "Systems"],
  },
  {
    number: "06",
    icon: "✳",
    title: "Automation",
    description:
      "Lead capture, alerts, follow-ups and reporting workflows designed to reduce repetitive work.",
    tags: ["Workflows", "Leads", "Alerts"],
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your business, audience and goals before touching any code.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We shape a clear visual direction with thoughtful interactions and modern experiences.",
  },
  {
    number: "03",
    title: "Develop",
    description:
      "We build responsive, secure digital products with the tools your business needs.",
  },
  {
    number: "04",
    title: "Deploy & Support",
    description:
      "We launch your project and help keep it running smoothly as it grows.",
  },
];

function ThreeScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let renderer;
    let frame;
    let resizeHandler;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        48,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );

      camera.position.set(0, 0, 8);

      const group = new THREE.Group();
      group.position.set(2.2, 0, 0);
      scene.add(group);

      const mainGeometry = new THREE.IcosahedronGeometry(1.65, 2);
      const mainMaterial = new THREE.MeshBasicMaterial({
        color: 0x35dfff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });

      const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
      group.add(mainMesh);

      const innerGeometry = new THREE.IcosahedronGeometry(0.88, 1);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x8c7bff,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });

      const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      group.add(innerMesh);

      const ringGeometry = new THREE.TorusGeometry(2.2, 0.008, 8, 150);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x42dfff,
        transparent: true,
        opacity: 0.3,
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = 1.1;
      group.add(ring);

      const particleCount = window.innerWidth < 768 ? 350 : 850;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: 0x65dfff,
        size: 0.018,
        transparent: true,
        opacity: 0.65,
      });

      const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
      );

      scene.add(particles);

      resizeHandler = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      resizeHandler();
      window.addEventListener("resize", resizeHandler);

      const clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();

        group.rotation.y = time * 0.13;
        group.rotation.x = Math.sin(time * 0.3) * 0.16;
        innerMesh.rotation.y = -time * 0.22;
        ring.rotation.z = time * 0.12;
        particles.rotation.y = time * 0.008;

        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resizeHandler);

        scene.traverse((object) => {
          object.geometry?.dispose();

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        renderer.dispose();
      };
    } catch (error) {
      console.warn("3D scene could not initialize:", error);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
      renderer?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-canvas" aria-hidden="true" />;
}

function MotionExperience() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const updateScroll = () => ScrollTrigger.update();
    lenis.on("scroll", updateScroll);

    const raf = (time) => lenis.raf(time * 1000);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      intro
        .from(".nav-inner", {
          y: -30,
          opacity: 0,
          duration: 0.9,
        })
        .from(
          ".hero-kicker",
          {
            y: 22,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.45"
        )
        .from(
          ".hero-heading-line",
          {
            yPercent: 120,
            opacity: 0,
            duration: 1.1,
            stagger: 0.13,
          },
          "-=0.35"
        )
        .from(
          ".hero-description, .hero-buttons, .hero-meta",
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.5"
        )
        .from(
          ".hero-visual",
          {
            scale: 0.75,
            opacity: 0,
            rotate: -12,
            duration: 1.4,
          },
          "-=0.9"
        );

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 55,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.from(".service-card", {
        y: 65,
        opacity: 0,
        scale: 0.96,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".process-card", {
        x: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".process-grid",
          start: "top 82%",
          once: true,
        },
      });

      gsap.to(".hero-visual", {
        y: 75,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // Existing project number. Replace with your real WhatsApp number.
  const whatsappNumber = "923000000000";

  const sendWhatsApp = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      alert("Please complete all fields before continuing.");
      return;
    }

    const message = `Hello ZR Technologies!

Name: ${form.name}
Phone: ${form.phone}
Project: ${form.message}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <MotionExperience />
      <ThreeScene />

      <div className="site-noise" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="ambient ambient-violet" aria-hidden="true" />
      <div className="scroll-progress" />

      <nav className="site-nav">
        <div className="container nav-inner">
          <a href="#top" className="brand">
            <span className="brand-symbol">ZR<span>.</span></span>
            <span className="brand-name">ZR <b>Technologies</b></span>
          </a>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            {["Services", "Process", "Results", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeMenu}
              >
                {item}
              </a>
            ))}
          </div>

          <a href="#contact" className="nav-cta">
            Let's Talk <span>↗</span>
          </a>
        </div>
      </nav>

      <main id="top">
        <header className="hero container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span className="status-dot" />
              DIGITAL INNOVATION. ENGINEERED FOR GROWTH.
            </div>

            <h1 className="hero-heading">
              <span className="hero-heading-line">We Build</span>
              <span className="hero-heading-line gradient-text">
                Digital Power<span className="hero-period">.</span>
              </span>
            </h1>

            <p className="hero-description">
              Professional websites, domains, Cloudflare setup, business
              email, backend and automation — engineered to make your
              business faster, smarter and ready to grow.
            </p>

            <div className="hero-buttons">
              <a href="#contact" className="button button-primary">
                Start a Project <span>↗</span>
              </a>
              <a href="#services" className="button button-secondary">
                Explore Services <span>↓</span>
              </a>
            </div>

            <div className="hero-meta">
              <span className="meta-line" />
              DESIGN <i>✳</i> DEVELOPMENT <i>✳</i> DEPLOYMENT
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-glow" />
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-orbit orbit-three" />

            <div className="visual-core">
              <div className="core-inner">
                <span>ZR</span>
                <small>TECHNOLOGY<br />IN MOTION</small>
              </div>
            </div>

            <div className="floating-chip chip-one">
              <span className="chip-dot" /> DIGITAL / 01
            </div>
            <div className="floating-chip chip-two">
              <span className="chip-dot" /> INNOVATION / 24-7
            </div>
            <div className="visual-cross cross-one">+</div>
            <div className="visual-cross cross-two">+</div>
          </div>

          <a href="#services" className="hero-scroll">
            <span className="scroll-line" />
            SCROLL TO EXPLORE
          </a>

          <div className="hero-index">01 — 04</div>
        </header>

        <section className="capability-strip">
          <div className="container capability-inner">
            <span>OUR CAPABILITIES</span>
            <div className="capability-track">
              <b>WEB DEVELOPMENT</b><i>✳</i>
              <b>CLOUDFLARE</b><i>✳</i>
              <b>DOMAINS</b><i>✳</i>
              <b>BUSINESS EMAIL</b><i>✳</i>
              <b>BACKEND</b><i>✳</i>
              <b>AUTOMATION</b>
            </div>
          </div>
        </section>

        <section id="services" className="section container">
          <div className="section-heading reveal">
            <div className="eyebrow">01 / WHAT WE DO</div>
            <h2>
              Technology built around{" "}
              <span className="gradient-text">your next move.</span>
            </h2>
            <p>
              From your first website to connected business systems, we bring
              the pieces together.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article
                className="service-card"
                key={service.number}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty(
                    "--mouse-x",
                    `${event.clientX - rect.left}px`
                  );
                  event.currentTarget.style.setProperty(
                    "--mouse-y",
                    `${event.clientY - rect.top}px`
                  );
                }}
              >
                <div className="service-card-top">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-number">{service.number}</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <a href="#contact" className="service-link">
                  Discuss this service <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="process-section section">
          <div className="container">
            <div className="section-heading reveal">
              <div className="eyebrow">02 / HOW WE WORK</div>
              <h2>
                From first idea to{" "}
                <span className="gradient-text">live launch.</span>
              </h2>
              <p>
                A clear process. Thoughtful execution. No unnecessary
                complexity.
              </p>
            </div>

            <div className="process-grid">
              {steps.map((step) => (
                <article className="process-card" key={step.number}>
                  <div className="process-top">
                    <span>{step.number}</span>
                    <span className="process-symbol">↗</span>
                  </div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="results" className="section container">
          <div className="metrics-panel reveal">
            <div className="metrics-heading">
              <div>
                <div className="eyebrow">03 / THE STANDARD</div>
                <h2>
                  Built with purpose.
                  <br />
                  <span className="gradient-text">Focused on outcomes.</span>
                </h2>
              </div>
              <div className="metrics-orb">ZR<span>.</span></div>
            </div>

            <div className="metrics-grid">
              <div>
                <b>01</b>
                <span>Thoughtful strategy</span>
              </div>
              <div>
                <b>02</b>
                <span>Performance focused</span>
              </div>
              <div>
                <b>03</b>
                <span>Security minded</span>
              </div>
              <div>
                <b>04</b>
                <span>Growth oriented</span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section">
          <div className="container contact-layout">
            <div className="contact-copy reveal">
              <div className="eyebrow">04 / LET'S CONNECT</div>
              <h2>
                Have a big idea?
                <br />
                <span className="gradient-text">Let's build it.</span>
              </h2>
              <p>
                Tell us what you're planning. We'll help you map the next
                step and bring your digital vision to life.
              </p>

              <div className="contact-availability">
                <span className="status-dot" />
                Available for new projects
              </div>

              <div className="contact-decoration">
                <span>ZR</span>
                <span>CODE • CLOUD • CONNECT</span>
              </div>
            </div>

            <div className="contact-card reveal">
              <div className="form-heading">
                <span>PROJECT ENQUIRY</span>
                <span className="form-status">● ONLINE</span>
              </div>

              <label>
                YOUR NAME
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </label>

              <label>
                PHONE / WHATSAPP
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="+92 ..."
                  autoComplete="tel"
                />
              </label>

              <label>
                TELL US ABOUT YOUR PROJECT
                <textarea
                  rows="4"
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                  placeholder="A few details about your idea..."
                />
              </label>

              <button
                onClick={sendWhatsApp}
                className="button button-primary send-button"
              >
                Continue on WhatsApp <span>↗</span>
              </button>

              <small>
                Your details will be placed into a WhatsApp message for you
                to review and send.
              </small>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#top" className="brand">
            <span className="brand-symbol">ZR<span>.</span></span>
            <span className="brand-name">ZR <b>Technologies</b></span>
          </a>

          <p>Code • Cloud • Connect.</p>

          <a href="#top" className="back-top">
            BACK TO TOP ↑
          </a>

          <span className="copyright">
            © {new Date().getFullYear()} ZR Technologies
          </span>
        </div>
      </footer>
    </>
  );
}
