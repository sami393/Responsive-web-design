document.addEventListener("DOMContentLoaded", () => {
  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById("navbar");
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );

  /* ===== HAMBURGER ===== */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll(".nav-link").forEach((l) => {
    l.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  /* ===== ACTIVE NAV ON SCROLL — snowflake indicator ===== */
  const sections = ["home", "gallery", "about", "contact"];
  const allLinks = document.querySelectorAll(".nav-link");

  function setActive(id) {
    allLinks.forEach((l) => {
      l.classList.toggle("active", l.dataset.section === id);
    });
  }

  const secObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { threshold: 0.35 },
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) secObserver.observe(el);
  });

  /* ===== HERO SLIDESHOW ===== */
  const slides = document.querySelectorAll(".slide");
  let current = 0;
  function nextSlide() {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }
  setInterval(nextSlide, 4500);

  /* ===== SMOOTH SCROLL WITH OFFSET ===== */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector(".navbar").offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ===== GALLERY FILTER ===== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const show = f === "all" || item.dataset.category === f;
        item.classList.toggle("hidden", !show);
      });
    });
  });

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbCat = document.getElementById("lbCat");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbBackdrop = document.getElementById("lightboxBackdrop");

  let idx = 0;

  function visible() {
    return Array.from(galleryItems).filter(
      (i) => !i.classList.contains("hidden"),
    );
  }

  function open(i) {
    idx = i;
    render();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function render() {
    const v = visible();
    if (!v.length) return;
    idx = (idx + v.length) % v.length;
    const item = v[idx];
    const img = item.querySelector("img");

    lbImg.style.opacity = "0";
    setTimeout(() => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = item.dataset.title || img.alt;
      lbCat.textContent = (item.dataset.category || "").toUpperCase();
      lbImg.style.opacity = "1";
    }, 180);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener("click", () => {
      const v = visible();
      const vi = v.indexOf(item);
      open(vi >= 0 ? vi : 0);
    });
  });

  lbClose.addEventListener("click", close);
  lbBackdrop.addEventListener("click", close);
  lbPrev.addEventListener("click", () => {
    idx--;
    render();
  });
  lbNext.addEventListener("click", () => {
    idx++;
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") {
      idx--;
      render();
    }
    if (e.key === "ArrowRight") {
      idx++;
      render();
    }
  });

  // Touch swipe
  let tx = 0;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      tx = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  lightbox.addEventListener("touchend", (e) => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? idx++ : idx--;
      render();
    }
  });

  /* ===== SCROLL FADE-IN ===== */
  const fadeEls = document.querySelectorAll(
    ".about-content, .contact-form, .section-title, .filter-tabs, .footer-info",
  );
  fadeEls.forEach((el) => el.classList.add("fade-in"));
  const fo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 70);
          fo.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  fadeEls.forEach((el) => fo.observe(el));

  /* ===== CONTACT FORM ===== */
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector(".submit-btn");
    const orig = btn.textContent;
    btn.textContent = "MESSAGE SENT ✓";
    btn.style.background = "#5b8fa8";
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = "";
      e.target.reset();
    }, 3000);
  });
});
