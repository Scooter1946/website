// Single source of truth for site content. Edit here; components read from this.

export const profile = {
  name: "Justin Chen",
  role: "Software engineer",
  tagline: "I build software people actually enjoy using.",
  heroLine: "Electrical engineering and computer science at Purdue, by way of competitive programming.",
  photo: "/me.svg", // portrait (currently unused — hero uses heroBg below)
  heroBg: "/hero.svg", // landscape hero background — drop public/hero.jpg and point this at it
  blurb:
    "I fell for software through competitive programming, and now I like working top to bottom — from a React app someone actually enjoys down to SystemVerilog on an FPGA. Mostly I care about building things that are fast and genuinely pleasant to use.",
  location: "West Lafayette, IN",
  email: "tulare789@gmail.com",
  phone: "650-613-3888",
  github: "https://github.com/Scooter1946",
  linkedin: "https://www.linkedin.com/in/justinchen", // placeholder — update with your real URL
  resume: "/resume.pdf",
  funFact:
    "I once got boba 14 days in a row my senior year of high school. Still chasing that high.",
};

// Headline metrics for the stats band (animated count-up).
export const stats: any[] = [
  { num: 20, suffix: "×", label: "faster order processing at Vivalink" },
  { num: 1600, suffix: "+", label: "Codeforces rating — Expert" },
  { static: "#1", label: "DECA stock-market game · 2,000+ entrants, Western Region" },
  { num: 95, suffix: "%", label: "accuracy on an on-device ML model" },
];

export const accolades = ["LeetCode top 2%", "AIME qualifier", "DECA ICDC qualifier", "3.8 GPA"];

export const experience = [
  {
    role: "Software Engineering Intern",
    org: "Vivalink",
    period: "May 2026 — present",
    blurb:
      "Cut order latency 20× (warm-up endpoint + precompiled Docker build), migrated the order schema in Odoo, built an order-lifecycle email system, and hardened the staging→production rollout with scoped API keys and CI/CD.",
    stack: ["TypeScript", "Docker", "Odoo", "CI/CD"],
  },
  {
    role: "Machine Learning Engineer",
    org: "Perceptions Innovations",
    period: "Jan 2026 — present",
    blurb:
      "Writing low-compute facial- and hand-detection algorithms for Arduino Zero — rewrote the core to run 5× faster, enabling cheaper, smaller hardware.",
    stack: ["C/C++", "Embedded", "Computer vision"],
  },
  {
    role: "Quantitative Analyst",
    org: "Boiler Quant Finance Group",
    period: "Jan 2026 — present",
    blurb:
      "Building a Monte Carlo risk engine on FPGAs, with the control-flow state machines written in SystemVerilog.",
    stack: ["SystemVerilog", "FPGA"],
  },
  {
    role: "Gen AI Technical Advisor Intern",
    org: "Scale AI",
    period: "Oct 2025 — Jan 2026",
    blurb:
      "Improved Gen-AI code generation by identifying systematic failure modes and authoring corrected reference solutions.",
    stack: ["Python", "LLMs"],
  },
  {
    role: "Software Engineering Intern",
    org: "AITOK Radio",
    period: "Jun — Sept 2024",
    blurb:
      "Prototyped and shipped mobile UI for an AI radio app in Dart/Flutter, iterating from user testing across iOS and Android.",
    stack: ["Dart", "Flutter"],
  },
  {
    role: "Director of Software",
    org: "Monta Vista Robotics (FRC)",
    period: "2021 — 2025",
    blurb:
      "Led 10+ engineers on real-time robot software in Java and built React/Firebase scouting tools — part of a top-3 regional finish.",
    stack: ["Java", "React", "Firebase"],
  },
  {
    role: "B.S./M.S. Electrical Engineering · CS & Math minors",
    org: "Purdue University",
    period: "Expected 2028",
    blurb: "3.8 GPA.",
    stack: [],
  },
];

export const projects = [
  {
    layer: "hackathon",
    name: "Remote Beehive Health Monitor",
    blurb:
      "Real-time IoT monitor fusing four sensors into live alerts, with an on-device C++ neural net at 95% accuracy. 3rd at Starkhacks.",
    stack: ["C++", "IoT", "ML"],
    code: "https://github.com/Scooter1946",
    live: "",
  },
  {
    layer: "hardware",
    name: "Customized Keypad",
    blurb:
      "A custom RP2040 macro keypad — bespoke firmware with advanced key mappings and RGB, in a hinged, latchable enclosure.",
    stack: ["RP2040", "C", "CAD"],
    code: "https://github.com/Scooter1946",
    live: "",
  },
  {
    layer: "robotics",
    name: "3-DOF Robotic Arm",
    blurb:
      "Forward kinematics and transformation matrices driving a 3-DOF arm with smooth, error-minimized motion.",
    stack: ["Python", "Kinematics"],
    code: "https://github.com/Scooter1946",
    live: "",
  },
  {
    layer: "computer vision",
    name: "Handwritten Digit Detector",
    blurb:
      "Real-time digit recognition from a live camera — an OpenCV pipeline feeding a CNN, frame by frame.",
    stack: ["Python", "OpenCV", "PyTorch"],
    code: "https://github.com/Scooter1946",
    live: "",
  },
];

export const skills = [
  { group: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "C/C++", "Dart"] },
  { group: "Web & cloud", items: ["React", "Node.js", "REST APIs", "Firebase"] },
  { group: "Tools", items: ["Git", "Docker", "PyTorch", "OpenCV", "Flutter"] },
  { group: "Hardware", items: ["SystemVerilog", "FPGAs", "RP2040 / Arduino"] },
];

// Placeholder travel list — swap in your real favorites.
export const places = ["Japan", "Italy", "Peru", "Iceland", "Vietnam"];

export const interests = ["soccer", "live music", "cooking & coffee", "trying new restaurants"];

// Travel photos — replace the placeholders in public/travel/ with your own shots.
export const gallery = [
  { src: "/travel/p1.svg", caption: "Japan" },
  { src: "/travel/p2.svg", caption: "Italy" },
  { src: "/travel/p3.svg", caption: "Peru" },
  { src: "/travel/p4.svg", caption: "Iceland" },
  { src: "/travel/p5.svg", caption: "Vietnam" },
];
