# DHAI Outpatient Ultrasound Protocols

A fast, searchable reference for diagnostic ultrasound exam descriptions, clinical indications, scan durations, and patient preparation protocols across Dignity Health Advanced Imaging (DHAI) centers.

🔗 **Live Tool:** [https://patrickdo.github.io/usprotocols/](https://patrickdo.github.io/usprotocols/)

---

## Overview

The **DHAI US Protocols** guide gives sonographers, schedulers, and referring providers instant, client-side access to outpatient sonography workflows. Each entry details the target anatomy, exact ordering nomenclature, procedural steps, approved clinical indications, slot booking duration, and required patient prep (e.g., fasting, full bladder, or dual hydration/NPO guidelines).

---

## Features

- **Multi-Field Instant Search:** Fast, client-side filtering across anatomy, order names, protocols, and indications powered by [List.js](https://listjs.com/).
- **Visual Preparation Badges:** Color-coded status tags for at-a-glance prep verification:
  - Fasted / NPO
  - Fasted Preferred
  - Water Prep (Hydration / Full Bladder)
  - Fasted with Water Prep (Combination)
  - No Prep
- **Sticky Column Headers:** Pinned navigation header ensures continuous field identification during deep vertical scrolling.
- **Protocol Quick-Links:** One-click navigation across companion DHAI digital binders:
  - [Referral Guide](https://patrickdo.github.io/referralbinder/)
  - [X-ray Protocols](https://patrickdo.github.io/xrayprotocols/)
  - [CT & MRI Protocols](https://apps.mrgschedule.com/ctprotocols/)
- **Zero Backend Footprint:** Fully static HTML5/CSS/JavaScript architecture deployable directly via GitHub Pages.

---

## File Structure

```text
usprotocols/
├── index.html          # Main HTML structure and table container
├── style.css           # Styling, preparation badge designs, and table layout
├── script.js           # List.js initialization, JSON data ingestion, and DOM binding
├── list.min.js         # Client-side indexing and real-time search engine
└── Resources/
    ├── hashtag_icon.png            # Favicon
    ├── magnifying-glass-128.png    # Search bar input icon
    └── trade-gothic-lt-std.otf     # Primary font asset