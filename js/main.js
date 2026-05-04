/* =========================================================
   Studio Stars — interactions
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Nav: scroll & mobile toggle ---------- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Hero parallax ---------- */
  const heroBg = document.querySelector(".hero .hero-bg");
  if (heroBg && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.05)`;
        }
      },
      { passive: true },
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Stat counters ---------- */
  const stats = document.querySelectorAll("[data-count]");
  if (stats.length && "IntersectionObserver" in window) {
    const animate = (el) => {
      const target = +el.dataset.count;
      const dur = 1400;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            sio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    stats.forEach((s) => sio.observe(s));
  }

  /* ---------- Gallery filter ---------- */
  const tabs = document.querySelectorAll(".tab");
  const items = document.querySelectorAll(".masonry .item");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const f = tab.dataset.filter;
        items.forEach((it) => {
          const show = f === "all" || it.dataset.cat === f;
          it.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  if (lb) {
    const lbImg = lb.querySelector("img");
    const lbCount = lb.querySelector(".lb-count");
    const close = lb.querySelector(".lb-close");
    const prev = lb.querySelector(".lb-prev");
    const next = lb.querySelector(".lb-next");
    let visibleItems = [];
    let idx = 0;

    const refreshList = () => {
      visibleItems = Array.from(document.querySelectorAll("[data-lightbox] img")).filter(
        (i) => i.offsetParent !== null,
      );
    };

    const show = (i) => {
      refreshList();
      if (!visibleItems.length) return;
      idx = (i + visibleItems.length) % visibleItems.length;
      const src = visibleItems[idx].dataset.full || visibleItems[idx].src;
      lbImg.src = src;
      if (lbCount) lbCount.textContent = `${idx + 1} / ${visibleItems.length}`;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    document.querySelectorAll("[data-lightbox]").forEach((wrap) => {
      wrap.addEventListener("click", (e) => {
        e.preventDefault();
        const img = wrap.querySelector("img");
        refreshList();
        const i = visibleItems.indexOf(img);
        show(i >= 0 ? i : 0);
      });
    });

    const closeLb = () => {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    };
    close.addEventListener("click", closeLb);
    prev.addEventListener("click", () => show(idx - 1));
    next.addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Year ---------- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
