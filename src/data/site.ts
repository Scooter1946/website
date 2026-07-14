export interface Project {
  title: string;
  outcome: string; // one line; should carry a concrete, quantified result
  tags: string[];
  href: string;
  badge?: string; // e.g. an award or placement
  period?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string; // one line — roughly what I did / am doing
  tags: string[];
  href?: string;
}

export interface Stat {
  value: string;
  label: string;
  href?: string; // optional link to a verifiable source
}

export const site = {
  name: "Justin Chen",
  // Status pill text (paired with the pulsing availability dot).
  available: "Building at Purdue",
  location: "West Lafayette, IN",
  education: "B.S. + M.S. Electrical Engineering, Purdue · Math + CS minor",
  gradYear: "B.S. expected May 2028",
  // One-line essence, used in the hero + meta description.
  tagline:
    "I build top to bottom — from a React app someone actually enjoys down to SystemVerilog on an FPGA.",
  specializations: [
    // the kinetic headline cycles through these — each must read after
    // "currently building ___"
    "firmware",
    "silicon",
    "web apps",
    "embedded ML",
  ],
  // Big warm ticker between sections — tech stack only (languages,
  // frameworks, tools, hardware), no domains/buzzwords.
  keywords: [
    "Python",
    "C / C++",
    "TypeScript",
    "React",
    "Node.js",
    "PyTorch",
    "SystemVerilog",
    "FPGAs",
    "Docker",
    "OpenCV",
    "Java",
    "Flutter",
    "Firebase",
    "Arduino",
  ],
  stats: [
    { value: "Top 2%", label: "LeetCode, global", href: "https://leetcode.com/u/Scooter1946/" },
    { value: "1600+", label: "Codeforces — Expert" }, // TODO(user): add Codeforces profile URL
    { value: "3.8", label: "GPA · Purdue EE (B.S./M.S.)" },
    {
      value: "#1",
      label: "DECA stock-market game · 2,000+ entrants",
      href: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/65c3fd9c04db82bd7dc61cd3_DECA-HS-SMG-24-ICDC.pdf",
    },
  ] as Stat[],
  email: "tulare789@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Scooter1946" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/justin-chen-a60a8a283/" },
  ],
  aboutQuote:
    "I fell for software through competitive programming — now I like working top to bottom, from the pixels down to the silicon.",
  about:
    "These days that means a React app someone actually enjoys one week and SystemVerilog on an FPGA the next. I care most about building things that are fast and genuinely pleasant to use — and I qualified for the AIME along the way, which is where the taste for hard problems started.",
  experience: [
    {
      company: "Vivalink",
      role: "Software Engineering Intern",
      period: "May 2026 — Present",
      summary: "Working on internal tooling + backend services.",
      tags: ["TypeScript", "Docker", "Python", "CI/CD"],
    },
    {
      company: "Boiler Quant Finance Group",
      role: "Quantitative Analyst",
      period: "Jan 2026 — Present",
      summary: "Building FPGA-accelerated market simulation + risk tooling.",
      tags: ["C++", "FPGA", "SystemVerilog"],
    },
    {
      company: "Scale AI",
      role: "Gen AI Technical Advisor",
      period: "Oct 2025 — Jan 2026",
      summary: "Improving LLM code-generation on hard problems.",
      tags: ["LLMs", "Python"],
    },
    {
      company: "Monta Vista Robotics (FRC)",
      role: "Director of Software",
      period: "Nov 2021 — Jun 2025",
      summary: "Led robot-control software for a 10-person team.",
      tags: ["Java", "FSM", "Leadership"],
    },
  ] as Experience[],
  projects: [
    {
      title: "Remote beehive health monitor",
      badge: "3rd · Starkhacks",
      period: "Apr 2026",
      outcome:
        "An end-to-end IoT health monitor: an on-device C++ neural net at 95% accuracy fuses 4 sensor streams into live alerts on a real-time dashboard — 3rd at Starkhacks (Analog Devices track), the world's largest hardware hackathon, shown to Ford, AMD & Espressif.",
      tags: ["C++", "Embedded ML", "IoT"],
      href: "https://github.com/Scooter1946",
    },
    {
      title: "Real-time limit order book",
      period: "2026",
      outcome:
        "A price-time-priority matching engine in C++ with automated market-making bots — quote two-sided markets and manage inventory risk inside a simulated exchange.",
      tags: ["C++", "Low-latency", "Trading"],
      href: "https://github.com/Scooter1946",
    },
    {
      title: "Macropad",
      period: "Jan — Mar 2025",
      outcome:
        "The one up top, for real: custom RP2040 firmware with layered key mappings and RGB control, in a hinged, latchable enclosure I designed to be portable and serviceable.",
      tags: ["RP2040", "Firmware", "CAD"],
      href: "https://github.com/Scooter1946",
    },
    {
      title: "3-DOF robotic arm",
      period: "Dec 2025 — Present",
      outcome:
        "Hand-derived forward kinematics and transformation matrices driving a 3-DOF arm, with distance-based error minimization for smooth, continuous motion paths.",
      tags: ["Robotics", "Kinematics", "Control"],
      href: "https://github.com/Scooter1946",
    },
    {
      title: "Handwritten digit detector",
      period: "Nov — Dec 2025",
      outcome:
        "Real-time digit recognition — a computer-vision pipeline (contour detection, perspective transforms, adaptive thresholding) feeding a CNN for frame-by-frame inference on live camera input.",
      tags: ["Python", "OpenCV", "PyTorch"],
      href: "https://github.com/Scooter1946",
    },
  ] as Project[],
  skills: [
    { group: "Languages", items: ["Java", "Python", "TypeScript", "C/C++", "Dart"] },
    { group: "Web & cloud", items: ["React", "Node.js", "REST APIs", "Firebase"] },
    { group: "Tools", items: ["Git", "Docker", "PyTorch", "OpenCV", "Flutter"] },
    { group: "Hardware", items: ["SystemVerilog", "FPGAs", "RP2040 / Arduino"] },
  ],
};
