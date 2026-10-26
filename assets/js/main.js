/**
 * Codename Majha Ghar - Core Interactive Engine
 * Strictly enforces Indian mobile validation, price & blueprint gating,
 * animated counters, mobile app view, date chips, and instant WhatsApp lead routing.
 * Strictly NO email addresses used.
 */

const PROJECT_CONFIG = {
  name: "Codename Majha Ghar",
  developer: "LJ Tanna Realty LLP",
  location: "Sonarpada, Kalyan-Shil Road, Dombivli East",
  hotlinePhone: "8422861465",
  formattedPhone: "+91 84228 61465",
  reraNo: "P51700078323",
  googleSheetId: "1LCGztDOS6utQ3ngKfnYicR3vJfao1pyUyVmrkjGuK3c",
  googleSheetWebhookUrl: "", // Deploy integrations/google-apps-script/Code.gs to activate live Sheet syncing
  pricing: {
    bhk1_masked: "FROM ₹ 37 LAKH*",
    bhk1_actual: "₹ 37 Lakhs* All-Inclusive",
    bhk2_masked: "FROM ₹ 75 LAKH*",
    bhk2_actual: "₹ 75 Lakhs* All-Inclusive"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initGatingState();
  initPhoneSanitization();
  initDateChips();
  initAnimatedCounters();
  initModals();
  initFormSubmissions();
  initFloorPlanTabs();
  initHeroParallax();
  initNavbarScroll();
  initMobileDrawer();
});

/* ========================================================
   1. PRICE & BLUEPRINT GATING SYSTEM
   ======================================================== */
function initGatingState() {
  const isUnlocked = localStorage.getItem("majha_ghar_unlocked") === "true";
  if (isUnlocked) {
    applyUnlockedState();
  }
}

function unlockProjectContent() {
  localStorage.setItem("majha_ghar_unlocked", "true");
  applyUnlockedState();
}

function applyUnlockedState() {
  document.body.classList.add("content-unlocked");

  // Reveal 1 BHK price
  document.querySelectorAll("[data-price-target='1bhk']").forEach((el) => {
    el.innerHTML = `<span style="color: #34d399; font-weight: 700;">${PROJECT_CONFIG.pricing.bhk1_actual}</span>`;
  });

  // Reveal 2.5 BHK price
  document.querySelectorAll("[data-price-target='2bhk']").forEach((el) => {
    el.innerHTML = `<span style="color: #34d399; font-weight: 700;">${PROJECT_CONFIG.pricing.bhk2_actual}</span>`;
  });

  // Update lock badges
  document.querySelectorAll(".gating-badge").forEach((el) => {
    el.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; background: rgba(52, 211, 153, 0.15); border: 1px solid rgba(52, 211, 153, 0.4); color: #34d399;">
        <svg style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        Price & Plans Unlocked
      </span>
    `;
  });

  // Un-blur floor plans
  document.querySelectorAll(".gated-plan-img").forEach((img) => {
    img.classList.remove("is-locked");
  });

  // Hide lock overlays
  document.querySelectorAll(".plan-lock-overlay").forEach((overlay) => {
    overlay.style.display = "none";
  });
}

/* ========================================================
   2. STRICT 10-DIGIT INDIAN PHONE SANITIZATION & VALIDATION
   ======================================================== */
function sanitizePhoneNumber(rawVal) {
  let cleaned = rawVal.replace(/\D/g, "");
  // Strip leading 0
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  // Strip leading +91 / 91 if length is 12
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.substring(2);
  }
  // Limit to 10 digits
  if (cleaned.length > 10) {
    cleaned = cleaned.slice(-10);
  }
  return cleaned;
}

function isValidIndianMobile(number) {
  return /^[6-9]\d{9}$/.test(number);
}

function initPhoneSanitization() {
  document.querySelectorAll(".phone-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const sanitized = sanitizePhoneNumber(e.target.value);
      e.target.value = sanitized;
      const errorEl = input.closest(".phone-field-wrapper")?.querySelector(".phone-error-msg");
      if (errorEl) {
        if (sanitized.length > 0 && !/^[6-9]/.test(sanitized)) {
          errorEl.textContent = "Number must start with 6, 7, 8, or 9";
          errorEl.classList.add("visible");
        } else if (sanitized.length === 10) {
          errorEl.classList.remove("visible");
        } else {
          errorEl.classList.remove("visible");
        }
      }
    });

    input.addEventListener("blur", (e) => {
      const sanitized = sanitizePhoneNumber(e.target.value);
      const errorEl = input.closest(".phone-field-wrapper")?.querySelector(".phone-error-msg");
      if (errorEl) {
        if (sanitized.length > 0 && !isValidIndianMobile(sanitized)) {
          errorEl.textContent = "Please enter a valid 10-digit mobile number";
          errorEl.classList.add("visible");
        } else {
          errorEl.classList.remove("visible");
        }
      }
    });
  });
}

/* ========================================================
   3. ANIMATED STAT COUNTER EFFECT (easeOutExpo)
   ======================================================== */
function initAnimatedCounters() {
  const counterEls = document.querySelectorAll(".stat-counter");
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("has-animated")) {
        entry.target.classList.add("has-animated");
        obs.unobserve(entry.target);
        runCounter(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counterEls.forEach((el) => observer.observe(el));
}

function runCounter(el) {
  const target = parseFloat(el.getAttribute("data-counter") || 0);
  const decimals = parseInt(el.getAttribute("data-decimals") || 0, 10);
  const suffix = el.getAttribute("data-suffix") || "";
  const prefix = el.getAttribute("data-prefix") || "";
  const duration = 1800; // 1.8 seconds
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentVal = ease * target;

    el.textContent = `${prefix}${currentVal.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${target.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/* ========================================================
   4. INTERACTIVE SITE VISIT DATE PICKER & CHIPS
   ======================================================== */
function formatDateToYYYYMMDD(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initDateChips() {
  const todayStr = formatDateToYYYYMMDD(new Date());
  document.querySelectorAll("input[type='date']").forEach((inp) => {
    inp.min = todayStr;
    if (!inp.value) inp.value = todayStr;
  });

  document.querySelectorAll(".date-chips-container").forEach((container) => {
    const targetInputId = container.getAttribute("data-target-input");
    const targetInput = document.getElementById(targetInputId);

    container.querySelectorAll(".date-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        container.querySelectorAll(".date-chip").forEach((c) => c.classList.remove("is-selected"));
        chip.classList.add("is-selected");

        const offsetType = chip.getAttribute("data-date-offset");
        const now = new Date();
        let targetDate = new Date();

        if (offsetType === "today") {
          targetDate = now;
        } else if (offsetType === "tomorrow") {
          targetDate.setDate(now.getDate() + 1);
        } else if (offsetType === "saturday") {
          const day = now.getDay();
          const diff = (6 - day + 7) % 7 || 7;
          targetDate.setDate(now.getDate() + diff);
        } else if (offsetType === "sunday") {
          const day = now.getDay();
          const diff = (0 - day + 7) % 7 || 7;
          targetDate.setDate(now.getDate() + diff);
        }

        if (targetInput) {
          targetInput.value = formatDateToYYYYMMDD(targetDate);
        }
      });
    });
  });
}

/* ========================================================
   5. ROYALE GALAXY PARALLAX & CURSOR GLOW
   ======================================================== */
function initHeroParallax() {
  const hero = document.getElementById("overview");
  const bgLayer = document.querySelector(".hero-bg-layer");
  const spotlight = document.getElementById("heroSpotlight");
  const cursorDot = document.getElementById("heroCursorDot");

  if (!hero || !bgLayer) return;

  if (window.innerWidth > 1024) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const shiftX = (x / hero.clientWidth - 0.5) * -16;
      const shiftY = (y / hero.clientHeight - 0.5) * -16;

      bgLayer.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(1.04)`;

      if (spotlight) {
        spotlight.style.background = `radial-gradient(550px circle at ${x}px ${y}px, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.06) 45%, transparent 75%)`;
      }
      if (cursorDot) {
        cursorDot.style.display = "block";
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
      }
    });

    hero.addEventListener("mouseleave", () => {
      bgLayer.style.transform = "scale(1)";
      if (spotlight) spotlight.style.background = "transparent";
      if (cursorDot) cursorDot.style.display = "none";
    });
  }
}

/* ========================================================
   6. NAVBAR SCROLL BLUR & BORDER (Royale Galaxy)
   ======================================================== */
function initNavbarScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header.style.background = "rgba(7, 10, 16, 0.95)";
      header.style.backdropFilter = "blur(16px)";
      header.style.borderBottom = "1px solid rgba(212, 175, 55, 0.2)";
      header.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.7)";
    } else {
      header.style.background = "linear-gradient(to bottom, rgba(7, 10, 16, 0.95), rgba(7, 10, 16, 0))";
      header.style.backdropFilter = "none";
      header.style.borderBottom = "none";
      header.style.boxShadow = "none";
    }
  }, { passive: true });
}

/* ========================================================
   7. MOBILE NAVIGATION DRAWER
   ======================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const drawer = document.getElementById("mobileNavDrawer");
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = drawer.classList.contains("hidden") || drawer.style.display === "none";
    if (isHidden) {
      drawer.classList.remove("hidden");
      drawer.style.display = "flex";
    } else {
      drawer.classList.add("hidden");
      drawer.style.display = "none";
    }
  });

  drawer.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => {
      drawer.classList.add("hidden");
      drawer.style.display = "none";
    });
  });
}

/* ========================================================
   8. MODAL & BOTTOM SHEET ENGINE
   ======================================================== */
function initModals() {
  // Ensure all modals start closed
  closeAllModals();

  // Open triggers
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute("data-open-modal");
      const title = btn.getAttribute("data-modal-title");
      const config = btn.getAttribute("data-modal-config");
      openModal(modalId, title, config);
    });
  });

  // Close triggers
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  // Backdrop click close
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // ESC key close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
}

function openModal(modalId, title, config) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (title) {
    const titleEl = modal.querySelector(".modal-title-text");
    if (titleEl) titleEl.textContent = title;
    const form = modal.querySelector("form");
    if (form) form.setAttribute("data-source", title);
  }
  if (config) {
    const configInput = modal.querySelector("input[name='configuration']");
    if (configInput) configInput.value = config;
  }

  modal.classList.remove("hidden");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Mobile bottom sheet animation
  const sheet = modal.querySelector(".app-modal-sheet");
  if (sheet) {
    requestAnimationFrame(() => {
      sheet.classList.add("sheet-open");
    });
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-container").forEach((m) => {
    const sheet = m.querySelector(".app-modal-sheet");
    if (sheet) sheet.classList.remove("sheet-open");
    m.classList.add("hidden");
    m.style.display = "none";
  });
  document.body.style.overflow = "";
}

/* ========================================================
   9. FLOOR PLAN TABS
   ======================================================== */
function initFloorPlanTabs() {
  const tabs = document.querySelectorAll(".plan-tab-btn");
  const panes = document.querySelectorAll(".plan-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active", "btn-gold");
        t.classList.add("btn-secondary");
      });
      tab.classList.remove("btn-secondary");
      tab.classList.add("active", "btn-gold");

      const targetPaneId = tab.getAttribute("data-tab-target");
      panes.forEach((pane) => {
        if (pane.id === targetPaneId) {
          pane.style.display = "block";
        } else {
          pane.style.display = "none";
        }
      });
    });
  });
}

/* ========================================================
   10. LEAD CAPTURE & WHATSAPP ROUTING (STRICTLY NO EMAIL)
   ======================================================== */
function initFormSubmissions() {
  document.querySelectorAll("form.lead-capture-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = form.querySelector("input[name='fullName']");
      const phoneInput = form.querySelector(".phone-input");
      const configInput = form.querySelector("select[name='configuration']") || form.querySelector("input[name='configuration']");
      const dateInput = form.querySelector("input[name='visitDate']");
      const formSource = form.getAttribute("data-source") || "Website Enquiry";

      const name = nameInput ? nameInput.value.trim() : "Valued Customer";
      const rawPhone = phoneInput ? phoneInput.value.trim() : "";
      const phone = sanitizePhoneNumber(rawPhone);

      const errorEl = form.querySelector(".phone-error-msg");
      if (!isValidIndianMobile(phone)) {
        if (errorEl) {
          errorEl.textContent = "Please enter a valid 10-digit mobile number";
          errorEl.classList.add("visible");
        }
        if (phoneInput) phoneInput.focus();
        return;
      }
      if (errorEl) errorEl.classList.remove("visible");

      const config = configInput ? configInput.value : "1 BHK / 2.5 BHK";
      const visitDate = dateInput ? dateInput.value : "Immediate Visit";
      const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      // Save Lead Dossier to localStorage (strictly no email)
      const leadDossier = {
        name,
        phone,
        configuration: config,
        visitDate,
        source: formSource,
        timestamp,
        project: PROJECT_CONFIG.name,
        destinationPhone: PROJECT_CONFIG.hotlinePhone
      };

      // Asynchronously synchronize lead directly to Google Sheet
      submitLeadToGoogleSheet(leadDossier);

      try {
        const existingLeads = JSON.parse(localStorage.getItem("majha_ghar_leads") || "[]");
        existingLeads.push(leadDossier);
        localStorage.setItem("majha_ghar_leads", JSON.stringify(existingLeads));
      } catch (err) {
        console.warn("Storage error", err);
      }

      // Unlock content on site
      unlockProjectContent();

      // Close open lead modals
      closeAllModals();

      // Build WhatsApp message
      const waMessage = 
`*New Enquiry - ${PROJECT_CONFIG.name}*
👤 Name: ${name}
📞 Mobile: +91 ${phone}
🏠 Configuration: ${config}
📅 Preferred Visit Date: ${visitDate}
📍 Source: ${formSource}
⏰ Time: ${timestamp} IST

Please send me the project brochure, price breakdown & arrange my site visit.`;

      const waUrl = `https://wa.me/91${PROJECT_CONFIG.hotlinePhone}?text=${encodeURIComponent(waMessage)}`;

      // Show Success Modal with 1-tap WhatsApp trigger
      showSuccessModal(name, phone, waUrl);
    });
  });
}

function showSuccessModal(name, phone, waUrl) {
  const successModal = document.getElementById("leadSuccessModal");
  if (!successModal) {
    window.open(waUrl, "_blank");
    return;
  }

  const nameEl = successModal.querySelector(".success-lead-name");
  if (nameEl) nameEl.textContent = name;

  const waBtn = successModal.querySelector(".whatsapp-continue-btn");
  if (waBtn) {
    waBtn.href = waUrl;
  }

  successModal.classList.remove("hidden");
  successModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  const sheet = successModal.querySelector(".app-modal-sheet");
  if (sheet) {
    requestAnimationFrame(() => {
      sheet.classList.add("sheet-open");
    });
  }
}

/* ========================================================
   11. GOOGLE SHEET ASYNC WEBHOOK SYNC
   ======================================================== */
async function submitLeadToGoogleSheet(leadDossier) {
  const webhookUrl = PROJECT_CONFIG.googleSheetWebhookUrl;
  if (!webhookUrl || webhookUrl.trim() === "" || webhookUrl.includes("REPLACE_WITH")) {
    console.info("Google Sheet Webhook URL awaiting deployment. Lead saved locally & WhatsApp queued.");
    return false;
  }

  const payload = {
    ...leadDossier,
    pageUrl: window.location.href,
    userAgent: navigator.userAgent
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.info("Lead synced to Google Sheet:", leadDossier.name);
    return true;
  } catch (err) {
    if (err && err.name === "AbortError") {
      console.warn("Google Sheet sync timeout (dispatched).");
      return true;
    }
    console.error("Google Sheet synchronization error:", err);
    return false;
  }
}
