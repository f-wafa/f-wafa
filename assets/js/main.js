/* ==========================================================================
   Faiz Syaiful Wafa — portfolio interactions
   Vanilla JavaScript, no dependencies.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const root = document.documentElement;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = () => motionQuery.matches;

  const EMAIL = "faizsyaifulwafa@gmail.com";
  const THEME_KEY = "fw-theme";
  const CAT_KEY = "fw-cat-pats";
  const SOUND_KEY = "fw-cat-sound";

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (_) {
        /* private mode / storage disabled */
      }
    },
  };

  /* ---------------------------------------------------------------------- */
  /* Toast                                                                  */
  /* ---------------------------------------------------------------------- */
  const toast = $("#toast");
  const toastMessage = $("#toast-message");
  let toastTimer = 0;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("is-open");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 3200);
  }

  /* ---------------------------------------------------------------------- */
  /* Theme                                                                  */
  /* ---------------------------------------------------------------------- */
  const themeMeta = $("#theme-color");
  const statImages = $$("img[data-src-light][data-src-dark]");
  let currentTheme = root.classList.contains("dark") ? "dark" : "light";

  function syncThemeUI() {
    const isDark = currentTheme === "dark";

    $$("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
    });

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#0d1017" : "#fafafa");
    }

    statImages.forEach((img) => {
      const next = isDark ? img.dataset.srcDark : img.dataset.srcLight;
      if (next && img.getAttribute("src") !== next) {
        img.setAttribute("src", next);
      }
    });
  }

  function applyTheme(theme, { animate = false } = {}) {
    currentTheme = theme === "dark" ? "dark" : "light";
    const change = () => {
      root.classList.toggle("dark", currentTheme === "dark");
      root.dataset.theme = currentTheme;
      syncThemeUI();
    };

    if (
      animate &&
      !reducedMotion() &&
      typeof document.startViewTransition === "function"
    ) {
      document.startViewTransition(change);
    } else {
      change();
    }
  }

  function toggleTheme() {
    const next = currentTheme === "dark" ? "light" : "dark";
    storage.set(THEME_KEY, next);
    applyTheme(next, { animate: true });
  }

  $$("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });

  const savedTheme = storage.get(THEME_KEY);
  if (!savedTheme) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        applyTheme(event.matches ? "dark" : "light");
      });
  }

  syncThemeUI();

  /* ---------------------------------------------------------------------- */
  /* GitHub stat images                                                     */
  /* ---------------------------------------------------------------------- */
  statImages.forEach((img) => {
    const card = img.closest("[data-stat-card]");
    img.addEventListener("error", () => card?.classList.add("is-failed"));
    img.addEventListener("load", () => card?.classList.remove("is-failed"));
  });

  /* ---------------------------------------------------------------------- */
  /* Scroll progress, header state, back-to-top                             */
  /* ---------------------------------------------------------------------- */
  const progress = $("#scroll-progress");
  const header = $("#site-header");
  const toTop = $("#to-top");
  let scrollTicking = false;

  function onScroll() {
    const scrollTop = window.scrollY || root.scrollTop;
    const max = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const ratio = Math.min(scrollTop / max, 1);

    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 12);
    if (toTop) toTop.hidden = scrollTop < 640;
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true },
  );

  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  });

  /* ---------------------------------------------------------------------- */
  /* Active navigation                                                      */
  /* ---------------------------------------------------------------------- */
  const navLinks = $$("[data-nav]");
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            if (link.dataset.nav === id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.removeAttribute("aria-current"));
      link.setAttribute("aria-current", "true");
      closeMenu();
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Mobile menu                                                            */
  /* ---------------------------------------------------------------------- */
  const menuButton = $("#menu-button");
  const mobileMenu = $("#mobile-menu");

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    mobileMenu.hidden = !open;
    $(".menu-icon", menuButton)?.classList.toggle("hidden", open);
    $(".close-icon", menuButton)?.classList.toggle("hidden", !open);
  }

  function closeMenu() {
    if (mobileMenu && !mobileMenu.hidden) setMenu(false);
  }

  menuButton?.addEventListener("click", () => {
    setMenu(mobileMenu.hidden);
  });

  mobileMenu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu || mobileMenu.hidden) return;
    if (
      !mobileMenu.contains(event.target) &&
      !menuButton?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  /* ---------------------------------------------------------------------- */
  /* Reveal on scroll                                                       */
  /* ---------------------------------------------------------------------- */
  const revealItems = $$(".reveal");

  if (reducedMotion() || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------------------------------------------------------------------- */
  /* Subtle 3D tilt                                                        */
  /* ---------------------------------------------------------------------- */
  const tiltItems = $$("[data-tilt]");

  tiltItems.forEach((card) => {
    const max = Number(card.dataset.tiltMax || 5);

    card.addEventListener("pointermove", (event) => {
      if (reducedMotion() || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = "transform 120ms ease-out";
      card.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transition = "";
      card.style.transform = "";
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Filters (skills + projects)                                            */
  /* ---------------------------------------------------------------------- */
  function wireFilter({ buttonSelector, itemSelector, matches, onChange }) {
    const buttons = $$(buttonSelector);
    const items = $$(itemSelector);

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.skillFilter || button.dataset.projectFilter;
        buttons.forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });

        let visible = 0;
        items.forEach((item) => {
          const show = value === "all" || matches(item, value);
          item.hidden = !show;
          if (show) {
            visible += 1;
            if (!reducedMotion()) {
              item.classList.remove("animate-pop");
              // restart the entrance animation
              void item.offsetWidth;
              item.classList.add("animate-pop");
            }
          }
        });

        onChange?.(visible);
      });
    });
  }

  wireFilter({
    buttonSelector: "[data-skill-filter]",
    itemSelector: "[data-skill-group]",
    matches: (item, value) => item.dataset.skillGroup === value,
  });

  const projectCount = $("#project-count");
  const projectEmpty = $("#project-empty");

  wireFilter({
    buttonSelector: "[data-project-filter]",
    itemSelector: "[data-tags]",
    matches: (item, value) => item.dataset.tags.split(/\s+/).includes(value),
    onChange: (visible) => {
      if (projectCount) projectCount.textContent = String(visible);
      if (projectEmpty) projectEmpty.hidden = visible > 0;
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Copy email                                                             */
  /* ---------------------------------------------------------------------- */
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        /* fall through to the legacy path */
      }
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    field.remove();
    return ok;
  }

  async function copyEmail(button) {
    const ok = await copyText(EMAIL);
    showToast(ok ? "Email copied to clipboard" : `Email: ${EMAIL}`);

    if (ok && button) {
      const copyIcon = $(".copy-icon", button);
      const checkIcon = $(".check-icon", button);
      copyIcon?.classList.add("hidden");
      checkIcon?.classList.remove("hidden");
      window.setTimeout(() => {
        copyIcon?.classList.remove("hidden");
        checkIcon?.classList.add("hidden");
      }, 1800);
    }
  }

  $$("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", () => copyEmail(button));
  });

  /* ---------------------------------------------------------------------- */
  /* Contact form (mailto, fully client-side)                               */
  /* ---------------------------------------------------------------------- */
  const form = $("#contact-form");

  function setFieldError(field, message) {
    if (!field) return;
    const error = $(`#${field.id}-error`);
    if (error) {
      error.textContent = message;
      error.classList.toggle("hidden", !message);
    }
    field.setAttribute("aria-invalid", message ? "true" : "false");
    field.classList.toggle("!border-red-500", Boolean(message));
  }

  function validateForm() {
    if (!form) return null;
    const name = $("#name", form);
    const email = $("#email", form);
    const message = $("#message", form);
    let firstInvalid = null;

    const checks = [
      [
        name,
        name.value.trim().length >= 2 ? "" : "Please enter at least 2 characters.",
      ],
      [
        email,
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())
          ? ""
          : "Please enter a valid email address.",
      ],
      [
        message,
        message.value.trim().length >= 10
          ? ""
          : "Please write at least 10 characters.",
      ],
    ];

    checks.forEach(([field, error]) => {
      setFieldError(field, error);
      if (error && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return null;
    }

    return {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
    };
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    // Honeypot: bots fill hidden fields.
    if ($("#company", form)?.value) return;

    const data = validateForm();
    if (!data) return;

    const subject = `Portfolio contact from ${data.name}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("Opening your email app…");
  });

  $$("#contact-form input, #contact-form textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        setFieldError(field, "");
      }
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Local time (WIB)                                                       */
  /* ---------------------------------------------------------------------- */
  const clock = $("#local-time");
  if (clock) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => {
      clock.textContent = formatter.format(new Date());
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* ---------------------------------------------------------------------- */
  /* Cat easter egg                                                         */
  /* ---------------------------------------------------------------------- */
  const catButton = $("#cat-button");
  const catBubble = $("#cat-bubble");
  const catCount = $("#cat-count");
  const pawTrail = $("#paw-trail");
  const soundButton = $("#cat-sound");
  const soundOnIcon = soundButton ? $(".sound-on", soundButton) : null;
  const soundOffIcon = soundButton ? $(".sound-off", soundButton) : null;
  const soundLabel = soundButton ? $(".sound-label", soundButton) : null;

  let pats = Number.parseInt(storage.get(CAT_KEY) || "0", 10);
  if (!Number.isFinite(pats) || pats < 0) pats = 0;

  let soundEnabled = storage.get(SOUND_KEY) !== "off";
  let bubbleTimer = 0;
  let audioContext = null;

  const catMessages = [
    "Meow! Thanks for the headpat 🐾",
    "Purr… that's the spot.",
    "You found the easter egg. You have good taste.",
    "Cats > bugs. Always.",
    "One more headpat and I'll review your CSS.",
    "I'm the real tech lead here.",
    "Meow means ship it.",
    "This portfolio is 1% cat hair.",
    "Have you tried turning it off and on again?",
    "Purrfection takes iterations.",
  ];

  function renderPats() {
    if (catCount) catCount.textContent = String(pats);
  }

  function renderSound() {
    if (!soundButton) return;
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    soundLabel && (soundLabel.textContent = soundEnabled ? "on" : "off");
    soundOnIcon?.classList.toggle("hidden", !soundEnabled);
    soundOffIcon?.classList.toggle("hidden", soundEnabled);
  }

  function spawnPaw() {
    if (!pawTrail) return;
    const paw = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    paw.setAttribute("class", "paw size-3.5");
    paw.setAttribute("aria-hidden", "true");
    paw.style.left = `${18 + Math.random() * 28}px`;
    paw.style.setProperty("--rot", `${Math.round(Math.random() * 50 - 25)}deg`);
    paw.style.animationDelay = `${Math.random() * 120}ms`;
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-paw-print");
    paw.appendChild(use);
    pawTrail.appendChild(paw);
    window.setTimeout(() => paw.remove(), 1500);
  }

  function meow() {
    if (!soundEnabled) return;

    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();

      const now = audioContext.currentTime;
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      gain.connect(audioContext.destination);

      const osc = audioContext.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(390, now + 0.42);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.44);

      const sub = audioContext.createOscillator();
      const subGain = audioContext.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(360, now);
      sub.frequency.exponentialRampToValueAtTime(210, now + 0.42);
      subGain.gain.setValueAtTime(0.05, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      sub.connect(subGain);
      subGain.connect(audioContext.destination);
      sub.start(now);
      sub.stop(now + 0.44);
    } catch (_) {
      /* audio is a bonus, never a blocker */
    }
  }

  function petCat() {
    if (!catButton) return;
    pats += 1;
    storage.set(CAT_KEY, String(pats));
    renderPats();

    if (catBubble) {
      catBubble.textContent = catMessages[pats % catMessages.length];
      catBubble.classList.add("is-open");
      window.clearTimeout(bubbleTimer);
      bubbleTimer = window.setTimeout(
        () => catBubble.classList.remove("is-open"),
        3000,
      );
    }

    catButton.classList.remove("is-petted");
    void catButton.offsetWidth;
    catButton.classList.add("is-petted");
    window.setTimeout(() => catButton.classList.remove("is-petted"), 650);

    spawnPaw();
    spawnPaw();
    spawnPaw();
    meow();
  }

  renderPats();
  renderSound();

  catButton?.addEventListener("click", petCat);

  soundButton?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    storage.set(SOUND_KEY, soundEnabled ? "on" : "off");
    renderSound();
    showToast(soundEnabled ? "Cat sounds on" : "Cat sounds muted");
    if (soundEnabled) meow();
  });

  /* ---------------------------------------------------------------------- */
  /* Command palette                                                        */
  /* ---------------------------------------------------------------------- */
  const palette = $("#palette");
  const paletteInput = $("#palette-input");
  const paletteList = $("#palette-list");
  const paletteEmpty = $("#palette-empty");
  const paletteItems = $$("[data-palette-item]", palette || document);
  let activeIndex = -1;

  paletteItems.forEach((item, index) => {
    item.id ||= `palette-item-${index}`;
    item.setAttribute("aria-selected", "false");
  });

  function visiblePaletteItems() {
    return paletteItems.filter((item) => !item.hidden);
  }

  function setActiveItem(index) {
    const items = visiblePaletteItems();
    activeIndex = index;

    paletteItems.forEach((item) => {
      item.removeAttribute("data-active");
      item.setAttribute("aria-selected", "false");
    });

    if (index < 0 || index >= items.length) {
      paletteInput?.setAttribute("aria-activedescendant", "");
      return;
    }

    const item = items[index];
    item.setAttribute("data-active", "true");
    item.setAttribute("aria-selected", "true");
    paletteInput?.setAttribute("aria-activedescendant", item.id);

    // Scroll only the palette list. `scrollIntoView` would also scroll the
    // page underneath the modal dialog.
    if (paletteList) {
      const listRect = paletteList.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < listRect.top) {
        paletteList.scrollTop -= listRect.top - itemRect.top + 8;
      } else if (itemRect.bottom > listRect.bottom) {
        paletteList.scrollTop += itemRect.bottom - listRect.bottom + 8;
      }
    }
  }

  function filterPalette(query) {
    const needle = query.trim().toLowerCase();

    paletteItems.forEach((item) => {
      const haystack = `${item.textContent} ${item.dataset.keywords || ""}`
        .toLowerCase()
        .replace(/\s+/g, " ");
      item.hidden = Boolean(needle) && !haystack.includes(needle);
    });

    // Hide group labels that have no visible items underneath.
    if (paletteList) {
      const children = [...paletteList.children];
      children.forEach((child, index) => {
        if (!child.hasAttribute("data-group-label")) return;
        let hasVisible = false;
        for (let i = index + 1; i < children.length; i += 1) {
          if (children[i].hasAttribute("data-group-label")) break;
          if (
            children[i].hasAttribute("data-palette-item") &&
            !children[i].hidden
          ) {
            hasVisible = true;
            break;
          }
        }
        child.hidden = !hasVisible;
      });
    }

    const visible = visiblePaletteItems();
    if (paletteEmpty) paletteEmpty.hidden = visible.length > 0;
    setActiveItem(visible.length ? 0 : -1);
  }

  function openPalette() {
    if (!palette || palette.open) return;
    palette.showModal();
    if (paletteInput) {
      paletteInput.value = "";
      paletteInput.focus();
    }
    if (paletteList) paletteList.scrollTop = 0;
    filterPalette("");
  }

  function closePalette() {
    if (palette?.open) palette.close();
  }

  $$("[data-open-palette], #open-palette").forEach((button) => {
    button.addEventListener("click", openPalette);
  });

  paletteInput?.addEventListener("input", () => {
    filterPalette(paletteInput.value);
  });

  palette?.addEventListener("keydown", (event) => {
    const items = visiblePaletteItems();

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!items.length) return;
      setActiveItem((activeIndex + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!items.length) return;
      setActiveItem((activeIndex - 1 + items.length) % items.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveItem(items.length - 1);
    } else if (event.key === "Enter") {
      if (activeIndex < 0 || !items[activeIndex]) return;
      event.preventDefault();
      items[activeIndex].click();
    }
  });

  palette?.addEventListener("click", (event) => {
    // Clicking the backdrop closes the dialog.
    if (event.target === palette) {
      closePalette();
      return;
    }

    const item = event.target.closest("[data-palette-item]");
    if (!item) return;

    const action = item.dataset.action;
    if (action) {
      event.preventDefault();
      closePalette();

      if (action === "theme") toggleTheme();
      if (action === "email") copyEmail();
      if (action === "resume") window.location.href = "resume.html";
      if (action === "pet") {
        petCat();
        $("#cat-button")?.focus({ preventScroll: true });
      }
      return;
    }

    closePalette();
  });

  paletteItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      const items = visiblePaletteItems();
      const position = items.indexOf(item);
      if (position !== -1 && position !== activeIndex) {
        setActiveItem(position);
      }
      void index;
    });
  });

  palette?.addEventListener("close", () => {
    setActiveItem(-1);
  });

  /* ---------------------------------------------------------------------- */
  /* Keyboard shortcuts                                                     */
  /* ---------------------------------------------------------------------- */
  let sequence = "";
  let sequenceTimer = 0;

  const isTyping = (target) =>
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const cmdK = (event.ctrlKey || event.metaKey) && key === "k";

    if (cmdK) {
      event.preventDefault();
      if (palette?.open) closePalette();
      else openPalette();
      return;
    }

    if (isTyping(event.target) || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (event.key === "?") {
      event.preventDefault();
      openPalette();
      return;
    }

    // Two-key navigation: g then h/a/s/p/g/c
    if (sequence === "g") {
      const map = {
        h: "#home",
        a: "#about",
        s: "#skills",
        p: "#projects",
        g: "#stats",
        c: "#contact",
      };
      if (map[key]) {
        event.preventDefault();
        sequence = "";
        window.clearTimeout(sequenceTimer);
        const target = document.querySelector(map[key]);
        target?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
        history.replaceState(null, "", map[key]);
      }
      return;
    }

    if (key === "g") {
      sequence = "g";
      window.clearTimeout(sequenceTimer);
      sequenceTimer = window.setTimeout(() => {
        sequence = "";
      }, 1200);
    }
  });

  /* ---------------------------------------------------------------------- */
  /* Print (resume page)                                                    */
  /* ---------------------------------------------------------------------- */
  $$("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  /* ---------------------------------------------------------------------- */
  /* Year                                                                   */
  /* ---------------------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
