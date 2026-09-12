/* ══════════════════════════════════════════════════════════════
   ROBIX — data layer
   Edit this file. Nothing else needs touching for day-to-day changes.
   ══════════════════════════════════════════════════════════════ */

/* ─── 1 · FORM ENDPOINT ─────────────────────────────────────────
   Formspree: formspree.io → new form → paste the endpoint below.
   Or any webhook accepting a JSON POST (Zapier, Make, n8n, a
   Cloudflare Worker writing to Airtable).
   Left unset, forms fall back to a pre-filled email.
   ───────────────────────────────────────────────────────────── */
const CONFIG = {
  ENDPOINT: "PASTE_YOUR_ENDPOINT_HERE",
  FALLBACK_EMAIL: "hello@robix.one",
  DIAG_FEE: 450
};

/* ─── 2 · SCHEMATICS ────────────────────────────────────────────
   Original line drawings, one per platform class. Joints are the
   orange dots — they're what breaks, and what we fix.

   TO USE REAL PHOTOS instead: put files in assets/img/ and add
   `photo:"assets/img/g1.jpg"` to a platform below. The card will
   render the photo and ignore the schematic.
   ───────────────────────────────────────────────────────────── */
const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">

<!-- ══ full-size biped · H1 / H2 class ══ -->
<symbol id="rb-biped-tall" viewBox="0 0 112 206">
  <rect class="rb-fill" x="45" y="8" width="22" height="22" rx="6"/>
  <line class="rb" x1="49" y1="19" x2="63" y2="19"/>
  <circle class="rb-j" cx="56" cy="34" r="3.5"/>
  <path class="rb-fill" d="M42 38 H70 L67 92 H45 Z"/>
  <line class="rb-d" x1="46" y1="54" x2="66" y2="54"/>
  <line class="rb-d" x1="46" y1="62" x2="66" y2="62"/>
  <circle class="rb-j" cx="40" cy="45" r="5.5"/>
  <circle class="rb-j" cx="72" cy="45" r="5.5"/>
  <line class="rb" x1="40" y1="51" x2="36" y2="76"/>
  <line class="rb" x1="72" y1="51" x2="76" y2="76"/>
  <circle class="rb-j" cx="36" cy="79" r="4.5"/>
  <circle class="rb-j" cx="76" cy="79" r="4.5"/>
  <line class="rb" x1="36" y1="84" x2="38" y2="110"/>
  <line class="rb" x1="76" y1="84" x2="74" y2="110"/>
  <rect class="rb-fill" x="33" y="110" width="10" height="13" rx="3"/>
  <rect class="rb-fill" x="69" y="110" width="10" height="13" rx="3"/>
  <circle class="rb-j" cx="56" cy="92" r="4"/>
  <line class="rb" x1="47" y1="97" x2="65" y2="97"/>
  <circle class="rb-j" cx="47" cy="100" r="5"/>
  <circle class="rb-j" cx="65" cy="100" r="5"/>
  <line class="rb" x1="47" y1="106" x2="46" y2="140"/>
  <line class="rb" x1="65" y1="106" x2="66" y2="140"/>
  <circle class="rb-j" cx="46" cy="144" r="5"/>
  <circle class="rb-j" cx="66" cy="144" r="5"/>
  <line class="rb" x1="46" y1="150" x2="46" y2="180"/>
  <line class="rb" x1="66" y1="150" x2="66" y2="180"/>
  <circle class="rb-j" cx="46" cy="184" r="4.5"/>
  <circle class="rb-j" cx="66" cy="184" r="4.5"/>
  <path class="rb-fill" d="M38 189 H54 V196 H38 Z"/>
  <path class="rb-fill" d="M58 189 H74 V196 H58 Z"/>
</symbol>

<!-- ══ compact biped · G1 / Booster class ══ -->
<symbol id="rb-biped-mid" viewBox="0 0 112 170">
  <rect class="rb-fill" x="46" y="6" width="20" height="19" rx="6"/>
  <line class="rb" x1="50" y1="15" x2="62" y2="15"/>
  <circle class="rb-j" cx="56" cy="29" r="3"/>
  <path class="rb-fill" d="M42 32 H70 L68 78 H44 Z"/>
  <line class="rb-d" x1="46" y1="46" x2="66" y2="46"/>
  <circle class="rb-j" cx="40" cy="39" r="5"/>
  <circle class="rb-j" cx="72" cy="39" r="5"/>
  <line class="rb" x1="40" y1="44" x2="37" y2="62"/>
  <line class="rb" x1="72" y1="44" x2="75" y2="62"/>
  <circle class="rb-j" cx="37" cy="65" r="4"/>
  <circle class="rb-j" cx="75" cy="65" r="4"/>
  <line class="rb" x1="37" y1="69" x2="38" y2="88"/>
  <line class="rb" x1="75" y1="69" x2="74" y2="88"/>
  <rect class="rb-fill" x="34" y="88" width="9" height="11" rx="3"/>
  <rect class="rb-fill" x="69" y="88" width="9" height="11" rx="3"/>
  <circle class="rb-j" cx="56" cy="78" r="3.5"/>
  <line class="rb" x1="48" y1="83" x2="64" y2="83"/>
  <circle class="rb-j" cx="48" cy="86" r="4.5"/>
  <circle class="rb-j" cx="64" cy="86" r="4.5"/>
  <line class="rb" x1="48" y1="91" x2="47" y2="113"/>
  <line class="rb" x1="64" y1="91" x2="65" y2="113"/>
  <circle class="rb-j" cx="47" cy="117" r="4.5"/>
  <circle class="rb-j" cx="65" cy="117" r="4.5"/>
  <line class="rb" x1="47" y1="122" x2="47" y2="146"/>
  <line class="rb" x1="65" y1="122" x2="65" y2="146"/>
  <circle class="rb-j" cx="47" cy="150" r="4"/>
  <circle class="rb-j" cx="65" cy="150" r="4"/>
  <path class="rb-fill" d="M40 155 H54 V161 H40 Z"/>
  <path class="rb-fill" d="M58 155 H72 V161 H58 Z"/>
</symbol>

<!-- ══ light biped · R1 class ══ -->
<symbol id="rb-biped-light" viewBox="0 0 100 146">
  <rect class="rb-fill" x="40" y="6" width="18" height="16" rx="8"/>
  <line class="rb" x1="43" y1="14" x2="55" y2="14"/>
  <circle class="rb-j" cx="49" cy="26" r="2.5"/>
  <path class="rb-fill" d="M38 29 H60 L58 68 H40 Z"/>
  <circle class="rb-j" cx="36" cy="35" r="4.5"/>
  <circle class="rb-j" cx="62" cy="35" r="4.5"/>
  <line class="rb" x1="36" y1="40" x2="34" y2="55"/>
  <line class="rb" x1="62" y1="40" x2="64" y2="55"/>
  <circle class="rb-j" cx="34" cy="58" r="3.5"/>
  <circle class="rb-j" cx="64" cy="58" r="3.5"/>
  <line class="rb" x1="34" y1="62" x2="35" y2="78"/>
  <line class="rb" x1="64" y1="62" x2="63" y2="78"/>
  <rect class="rb-fill" x="31" y="78" width="8" height="9" rx="2"/>
  <rect class="rb-fill" x="59" y="78" width="8" height="9" rx="2"/>
  <line class="rb" x1="43" y1="71" x2="55" y2="71"/>
  <circle class="rb-j" cx="43" cy="75" r="4"/>
  <circle class="rb-j" cx="55" cy="75" r="4"/>
  <line class="rb" x1="43" y1="79" x2="42" y2="98"/>
  <line class="rb" x1="55" y1="79" x2="56" y2="98"/>
  <circle class="rb-j" cx="42" cy="101" r="4"/>
  <circle class="rb-j" cx="56" cy="101" r="4"/>
  <line class="rb" x1="42" y1="105" x2="42" y2="126"/>
  <line class="rb" x1="56" y1="105" x2="56" y2="126"/>
  <circle class="rb-j" cx="42" cy="129" r="3.5"/>
  <circle class="rb-j" cx="56" cy="129" r="3.5"/>
  <path class="rb-fill" d="M36 133 H48 V139 H36 Z"/>
  <path class="rb-fill" d="M50 133 H62 V139 H50 Z"/>
</symbol>

<!-- ══ quadruped · Go2 / B2 class ══ -->
<symbol id="rb-quad" viewBox="0 0 184 126">
  <line class="rb-d" x1="132" y1="72" x2="140" y2="90"/>
  <line class="rb-d" x1="140" y1="94" x2="134" y2="112"/>
  <line class="rb-d" x1="52" y1="72" x2="44" y2="90"/>
  <line class="rb-d" x1="44" y1="94" x2="50" y2="112"/>
  <rect class="rb-fill" x="38" y="40" width="102" height="28" rx="7"/>
  <line class="rb-d" x1="60" y1="46" x2="118" y2="46"/>
  <rect class="rb-fill" x="138" y="42" width="30" height="18" rx="5"/>
  <circle class="rb-jo" cx="160" cy="51" r="4"/>
  <circle class="rb-j" cx="128" cy="68" r="5"/>
  <line class="rb" x1="128" y1="73" x2="136" y2="90"/>
  <circle class="rb-j" cx="136" cy="93" r="4"/>
  <line class="rb" x1="136" y1="97" x2="130" y2="114"/>
  <circle class="rb-j" cx="129" cy="117" r="3.5"/>
  <circle class="rb-j" cx="48" cy="68" r="5"/>
  <line class="rb" x1="48" y1="73" x2="40" y2="90"/>
  <circle class="rb-j" cx="40" cy="93" r="4"/>
  <line class="rb" x1="40" y1="97" x2="46" y2="114"/>
  <circle class="rb-j" cx="47" cy="117" r="3.5"/>
</symbol>

<!-- ══ three-finger dexterous hand · Dex3-1 ══ -->
<symbol id="rb-hand3" viewBox="0 0 104 118">
  <rect class="rb-fill" x="32" y="52" width="38" height="34" rx="6"/>
  <line class="rb-d" x1="38" y1="66" x2="64" y2="66"/>
  <rect class="rb-fill" x="41" y="86" width="20" height="14" rx="3"/>
  <circle class="rb-j" cx="51" cy="103" r="4.5"/>
  <circle class="rb-j" cx="39" cy="50" r="3.5"/>
  <line class="rb" x1="39" y1="46" x2="36" y2="30"/>
  <circle class="rb-j" cx="36" cy="27" r="3"/>
  <line class="rb" x1="36" y1="24" x2="37" y2="12"/>
  <line class="rb-d" x1="33" y1="12" x2="41" y2="12"/>
  <circle class="rb-j" cx="53" cy="50" r="3.5"/>
  <line class="rb" x1="53" y1="46" x2="53" y2="27"/>
  <circle class="rb-j" cx="53" cy="24" r="3"/>
  <line class="rb" x1="53" y1="21" x2="53" y2="8"/>
  <line class="rb-d" x1="49" y1="8" x2="57" y2="8"/>
  <circle class="rb-j" cx="68" cy="59" r="3.5"/>
  <line class="rb" x1="71" y1="56" x2="84" y2="43"/>
  <circle class="rb-j" cx="86" cy="41" r="3"/>
  <line class="rb" x1="88" y1="38" x2="96" y2="30"/>
  <line class="rb-d" x1="92" y1="26" x2="99" y2="33"/>
</symbol>

<!-- ══ parallel gripper · Dex1-1 ══ -->
<symbol id="rb-grip" viewBox="0 0 104 108">
  <rect class="rb-fill" x="34" y="56" width="36" height="26" rx="5"/>
  <rect class="rb-fill" x="43" y="82" width="18" height="13" rx="3"/>
  <circle class="rb-j" cx="52" cy="98" r="4.5"/>
  <circle class="rb-jo" cx="52" cy="69" r="4"/>
  <line class="rb" x1="40" y1="56" x2="40" y2="34"/>
  <path class="rb-fill" d="M34 20 H46 V34 H34 Z"/>
  <line class="rb" x1="64" y1="56" x2="64" y2="34"/>
  <path class="rb-fill" d="M58 20 H70 V34 H58 Z"/>
  <line class="rb-d" x1="46" y1="27" x2="58" y2="27"/>
</symbol>

<!-- ══ joint module cutaway ══ -->
<symbol id="rb-joint" viewBox="0 0 140 104">
  <rect class="rb-fill" x="24" y="22" width="82" height="60" rx="10"/>
  <circle class="rb" cx="65" cy="52" r="24"/>
  <circle class="rb-d" cx="65" cy="52" r="16"/>
  <circle class="rb-j" cx="65" cy="52" r="6"/>
  <line class="rb" x1="65" y1="28" x2="65" y2="34"/>
  <line class="rb" x1="65" y1="70" x2="65" y2="76"/>
  <line class="rb" x1="41" y1="52" x2="47" y2="52"/>
  <line class="rb" x1="83" y1="52" x2="89" y2="52"/>
  <rect class="rb-fill" x="106" y="40" width="16" height="24" rx="3"/>
  <path class="rb" d="M24 52 C14 52 12 66 10 78"/>
  <circle class="rb-jo" cx="9" cy="81" r="3.5"/>
</symbol>

<!-- ══ bench capability glyphs ══ -->
<symbol id="ic-hand" viewBox="0 0 24 24">
  <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 12V4.5a1.5 1.5 0 0 1 3 0V12"/>
  <path d="M14 12V6a1.5 1.5 0 0 1 3 0v7"/>
  <path d="M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2a7 7 0 0 1-7-7v-3"/>
</symbol>
<symbol id="ic-drive" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="3.2"/>
  <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>
</symbol>
<symbol id="ic-frame" viewBox="0 0 24 24">
  <path d="M4 20V8l8-4.5L20 8v12"/><path d="M9 20v-6h6v6"/><path d="M4 12h16"/>
</symbol>
<symbol id="ic-power" viewBox="0 0 24 24">
  <rect x="4" y="8" width="13" height="8" rx="1.5"/><path d="M17 11h3v2h-3z"/>
  <path d="M8.5 10 7 12.5h2.5L8 15"/>
</symbol>
<symbol id="ic-code" viewBox="0 0 24 24">
  <path d="M8.5 8.5 4.5 12l4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5.5l-3 13"/>
</symbol>
</svg>`;

/* ─── 3 · PLATFORMS ─────────────────────────────────────────────
   Specs are manufacturer-published where available, "—" where not.
   Don't invent numbers here — a lab engineer will check.
   ───────────────────────────────────────────────────────────── */
const PLATFORMS = [
  {
    id:"g1", group:"robot", art:"rb-biped-mid", size:"h-med",
    name:"Unitree G1", sub:"Compact biped · the Bay Area default",
    specs:[["Height","1.32 m"],["Mass","35 kg"],["Degrees of freedom","23–43"],
           ["US street price","$17,990"],["Factory list","$13,500"]],
    faults:["Ankle & knee joints after falls","Shell & frame damage","Battery capacity loss","Harness chafe"],
    note:"FCC authorised 3 Mar 2025 — grandfathered under the July 2026 Covered List."
  },
  {
    id:"g1edu", group:"robot", art:"rb-biped-mid", size:"h-med",
    name:"Unitree G1 EDU", sub:"G1 frame + Jetson Orin, ROS 2 SDK",
    specs:[["Height","1.32 m"],["Degrees of freedom","23–43"],["Compute","Jetson Orin"],
           ["Factory warranty","18 months"],["Reseller price","$43,900–73,900"]],
    faults:["Dex3-1 hand failures","Arm & wrist joints","Compute / boot faults","Sensor calibration drift"],
    note:"The manipulation-research config. Hands are the dominant failure mode and the dominant cost."
  },
  {
    id:"g1pro", group:"robot", art:"rb-biped-mid", size:"h-med",
    name:"Unitree G1 Pro", sub:"Uprated compact biped",
    specs:[["Height","1.32 m"],["Degrees of freedom","23–43"],["US street price","$27,990"]],
    faults:["Leg joint modules","Hand & gripper faults","Battery","Firmware recovery"]
  },
  {
    id:"r1", group:"robot", art:"rb-biped-light", size:"h-short",
    name:"Unitree R1 / R1 Air", sub:"Lightweight biped · entry research",
    specs:[["Height","1.21 m"],["Mass","25 kg"],["Factory list","from $4,900"],
           ["R1 Air, US dealer","$6,870"]],
    faults:["Fall damage — light frame","Ankle joints","Battery","Cable & connector wear"]
  },
  {
    id:"h1", group:"robot", art:"rb-biped-tall", size:"h-tall",
    name:"Unitree H1", sub:"Full-size biped",
    specs:[["Height","1.80 m"],["Degrees of freedom","27"],["Price","≈ $90k · quote"]],
    faults:["Hip & knee modules — high torque","Structural damage","Thermal shutdown","Harness"]
  },
  {
    id:"h2", group:"robot", art:"rb-biped-tall", size:"h-tall",
    name:"Unitree H2 / H2 Plus", sub:"Full-size biped · bionic face",
    specs:[["Height","1.80 m"],["Compute","2,070 TOPS"],["Released","Oct 2025"],
           ["Commercial","$40,900"],["EDU","$68,900"]],
    faults:["High-torque joint modules","Hand assemblies","Cooling & thermal","Compute stack"]
  },
  {
    id:"quad", group:"robot", art:"rb-quad", size:"h-short",
    name:"Unitree Go2 / B2", sub:"Quadruped",
    specs:[["Class","Quadruped"],["Price","Quote"]],
    faults:["Hip & knee abduction joints","Foot pads & contact sensors","LiDAR head","Battery"]
  },
  {
    id:"booster", group:"robot", art:"rb-biped-mid", size:"h-med",
    name:"Booster T1 / K1", sub:"Compact biped · research & education",
    specs:[["Class","Compact biped"],["Segment","Research / edu"],["Price","Quote"]],
    faults:["Leg joint modules","Fall damage","Firmware & SDK","Battery"]
  },
  {
    id:"dex3", group:"part", art:"rb-hand3", size:"h-med",
    name:"Dex3-1 dexterous hand", sub:"Three-finger, force-controlled",
    specs:[["Degrees of freedom","7"],["Tactile sensors","33"],
           ["Replacement, US","$6,500"],["Replacement, EU","€6,664"]],
    faults:["Finger micro-actuator burnout","Tendon & linkage wear","Tactile sensor array dead","Flex circuit fracture"],
    note:"The single highest-value repair we do. A whole-hand replacement is $6,500; most faults are one component."
  },
  {
    id:"dex5", group:"part", art:"rb-hand3", size:"h-med",
    name:"Dex5-1 dexterous hand", sub:"High-DOF hand",
    specs:[["Replacement, US","$25,000"]],
    faults:["Actuator failure","Tendon routing","Sensor array","Controller board"]
  },
  {
    id:"dex1", group:"part", art:"rb-grip", size:"h-short",
    name:"Dex1-1 gripper", sub:"Parallel gripper · V1 and V2",
    specs:[["V1 replacement","$380"],["V2 · with camera","$580"]],
    faults:["Drive wear","Camera fault (V2)","Calibration drift"]
  },
  {
    id:"joint", group:"part", art:"rb-joint", size:"h-short",
    name:"Joint module", sub:"Leg, arm and waist actuators",
    specs:[["Peak torque","120 N·m"],["Availability","Factory only"],
           ["Factory lead time","6–8 wks"]],
    faults:["Bearing wear & play","Encoder fault","Winding / thermal failure","Gearbox backlash"],
    note:"Not sold through any public storefront — which is exactly why labs give up and leave the robot in a corner."
  }
];

/* ─── 4 · SERVICE CATALOG ───────────────────────────────────────
   `oem` is the public replacement list price, shown struck through.
   `oemLabel` alone (with oem:null) shows a text comparison instead.
   ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {cat:"hand", t:"Dexterous hand — finger actuator or tendon", from:1200, days:"3–7",
   plats:["G1 EDU","H1","H2"], oem:6500, oemLabel:"whole hand"},
  {cat:"hand", t:"Dexterous hand — tactile sensor array", from:900, days:"3–7",
   plats:["G1 EDU","H1","H2"], oem:6500, oemLabel:"whole hand"},
  {cat:"hand", t:"Gripper service & recalibration", from:350, days:"1–3",
   plats:["G1","R1","H1","H2"]},
  {cat:"joint", t:"Leg or ankle joint module", from:1400, days:"4–10",
   plats:["G1","R1","H1","H2"], oem:null, oemLabel:"factory order, 6–8 weeks"},
  {cat:"joint", t:"Arm, wrist or waist joint module", from:1100, days:"4–8",
   plats:["G1","H1","H2"]},
  {cat:"joint", t:"Gearbox & harmonic drive rebuild", from:1300, days:"5–10",
   plats:["G1","H1","H2","Go2","B2"]},
  {cat:"fall", t:"Shell & frame damage after a fall", from:600, days:"2–5",
   plats:["All platforms"], oem:null, oemLabel:"often quoted unrepairable"},
  {cat:"fall", t:"Harness, cable chafe, intermittent joint", from:450, days:"2–4",
   plats:["All platforms"]},
  {cat:"power", t:"Battery service or replacement", from:700, days:"1–3",
   plats:["All platforms"], oem:null, oemLabel:"freight from factory"},
  {cat:"sensor", t:"LiDAR or depth camera fault", from:800, days:"3–6",
   plats:["G1","R1","H1","H2","Go2"]},
  {cat:"sensor", t:"Full sensor recalibration", from:500, days:"1–2",
   plats:["All platforms"]},
  {cat:"compute", t:"Boot recovery, compute & firmware", from:350, days:"1–3",
   plats:["All platforms"]},
  {cat:"preventive", t:"Annual service & inspection", from:900, days:"1 day",
   plats:["All platforms"]},
  {cat:"preventive", t:"Fleet health audit", from:1500, days:"Per site",
   plats:["3+ robots"]}
];

const CATS = [
  {f:"all",        n:"All"},
  {f:"hand",       n:"Hands &amp; grippers"},
  {f:"joint",      n:"Joints &amp; drives"},
  {f:"fall",       n:"Fall damage"},
  {f:"power",      n:"Power &amp; battery"},
  {f:"sensor",     n:"Sensors"},
  {f:"compute",    n:"Compute &amp; software"},
  {f:"preventive", n:"Preventive"}
];

/* ─── 5 · COVERAGE ──────────────────────────────────────────────
   Flip `live:true` per zone once a qualified engineer is on the
   roster there. Recruiting is the honest state — and it works as
   engineer recruitment too.
   ───────────────────────────────────────────────────────────── */
const ZONES = [
  {z:"Palo Alto · Stanford",      n:"Stanford, Menlo Park, Redwood City", eta:"48h",      live:true},
  {z:"Berkeley · Oakland",        n:"UC Berkeley, Emeryville, Albany",    eta:"48h",      live:true},
  {z:"San Francisco",             n:"SoMa, Mission Bay, Dogpatch",        eta:"48h",      live:true},
  {z:"Mountain View · Sunnyvale", n:"Palo Alto through Santa Clara",      eta:"48h",      live:false},
  {z:"San Jose · Santa Clara",    n:"SJSU, North San Jose",               eta:"72h",      live:false},
  {z:"Fremont · Hayward",         n:"East Bay corridor",                  eta:"72h",      live:false},
  {z:"San Leandro (bench)",       n:"Fabrication &amp; machining partner",eta:"Drop-off", live:true}
];

/* ─── 6 · THE BENCH ─────────────────────────────────────────────
   Capability groups, not named people. Never put invented profiles
   or ratings here — labs check, and a fabricated roster is fatal.
   ───────────────────────────────────────────────────────────── */
const BENCH = [
  {i:"ic-hand",  t:"Hand &amp; micro-actuator bench",
   who:"Recruited from medical device, camera and precision-assembly repair",
   s:["Micro-actuators","Tendons &amp; linkages","Tactile sensor arrays","Flex circuits"],
   zone:"Berkeley · SF", live:true},
  {i:"ic-drive", t:"Actuator &amp; drive rebuild",
   who:"From robotics labs and hardware startups",
   s:["BLDC &amp; servo","Harmonic drives","Encoders","Thermal faults"],
   zone:"Palo Alto · SF", live:true},
  {i:"ic-frame", t:"Structural fabrication",
   who:"Machine shop and fabrication partner",
   s:["Frame straightening","CNC replacements","3D-printed shells","Mounts"],
   zone:"San Leandro", live:true},
  {i:"ic-power", t:"Power, battery &amp; harness",
   who:"From drone, RC and e-mobility service",
   s:["Pack rebuild","BMS","Harness fabrication","Charging faults"],
   zone:"East Bay", live:false},
  {i:"ic-code",  t:"Compute, firmware &amp; calibration",
   who:"From robotics research and embedded engineering",
   s:["Boot recovery","Firmware flashing","ROS 2 / SDK","Sensor calibration"],
   zone:"Bay-wide · remote", live:true}
];
