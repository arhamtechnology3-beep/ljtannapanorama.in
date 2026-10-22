# Codename Majha Ghar — Official Luxury Landing Page

A high-converting real estate web portal engineered for **Codename Majha Ghar** (LJ Tanna Panorama, Dombivli East) by LJ Tanna Realty LLP.

---

## 🌟 Key Highlights

* **Project Identity:** Codename Majha Ghar (LJ Tanna Panorama, Dombivli East)
* **Official Hotline:** [+91 84228 61465](tel:+918422861465) / WhatsApp: [+91 84228 61465](https://wa.me/918422861465)
* **Zero-Email Invariant:** Strictly 0 email addresses used across the site. All inquiries route via Phone and WhatsApp.
* **MahaRERA Registration:** `P51700078323` (LJTANNA PANORAMA A WING, Sonarpada, Kalyan-Shil Road, Dombivli East).
* **Tower Profile:** G+22 Storey Iconic High-Rise Tower with 25+ Lifestyle Amenities.
* **Configurations:** Luxury 1 BHK (420–450 sq.ft.) & Grand 2 BHK (610–650 sq.ft.) residences with private sundecks.

---

## 🎨 Design & Brochure Theme Architecture

* **Official Brand Vector Logo:** Authentic floral flame motif with **माझं घर** in Devanagari script and **Tanna Panorama**.
* **Palette:**
  * **Royal Navy Base:** `#0a143a` & `#070d24`
  * **Vivid Magenta / Rose:** `#e5007c`
  * **Radiant Sunset Orange:** `#ef7c00`
  * **Champagne Gold:** `#d4af37` & `#fcd5a4`
* **Signature Flame Gradient:** `linear-gradient(135deg, #e5007c 0%, #ef7c00 55%, #d4af37 100%)`
* **Full Multi-Device Responsive System:** Mobile app bar (56px), horizontal category pills strip, bottom app dock, and balanced desktop/laptop layouts.

---

## 🏗️ Technical Features

1. **Price & Blueprint Gating Rule:** Masked launch pricing and blurred architectural floor plans unlock dynamically upon submitting a verified 10-digit Indian mobile number.
2. **Strict Indian Phone Sanitization:** Validates `^[6-9]\d{9}$`, auto-strips `+91`, `91`, leading `0`, spaces, and non-numeric characters.
3. **Animated Stat Counters:** 1.8-second `easeOutExpo` count-up using `tabular-nums` and `IntersectionObserver`.
4. **Interactive Site Visit Date Picker:** Day chips (`Today`, `Tomorrow`, `Saturday`, `Sunday`) with calendar synchronization.
5. **Instant Lead Routing:** WhatsApp dossier generation and `localStorage` backup without third-party dependencies.
6. **Statutory Compliance Suite:** Dedicated pages for MahaRERA approvals, zero-email privacy policy, and terms & conditions.

---

## 📁 Repository Structure

```text
├── index.html                   # Master Luxury Landing Page
├── rera-approvals.html          # MahaRERA Sanctions & Approvals
├── privacy-policy.html          # Data Privacy Policy
├── terms-conditions.html        # Terms & Statutory Disclaimers
├── favicon.svg                  # SVG Favicon Emblem
├── favicon-32x32.png            # 32x32 Favicon
├── apple-touch-icon.png         # 180x180 iOS Touch Icon
├── favicon.ico                  # Standard ICO Favicon
├── assets/
│   ├── css/
│   │   └── styles.css           # Brochure styling, mobile dock, gating & sheets
│   ├── js/
│   │   └── main.js              # Gating logic, Indian phone validator & WhatsApp routing
│   └── images/                  # Web-optimized 3D renders, floor plans & brand logos
└── README.md
```

---

## 🚀 Local Preview

Run any static server:
```bash
python3 -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.
