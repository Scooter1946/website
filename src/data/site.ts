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

export const siftProject: Project = {
  title: "Sift",
  badge: "4th · HackMIT",
  outcome:
    "A reimbursement reconciliation agent that checks receipts against claims and event policies, bringing uncertain cases to a human reviewer. Fourth place at HackMIT.",
  tags: ["Next.js", "Supabase", "AI agents"],
  href: "https://plume.hackmit.org/project/rbdjt-lrlzh-wcsop-znsvr",
};

export const riscvProject = {
  title: "RISC-V CPU",
  status: "In progress",
  description:
    "A single-cycle RISC-V CPU. Each instruction runs in one clock cycle, from fetching the instruction to writing back the result.",
  // The owner has not supplied a ready-to-share repository for this project.
};

export const site = {
  name: "Justin Chen",
  // Status pill text (paired with the pulsing availability dot).
  available: "Building at Purdue",
  location: "West Lafayette, IN",
  education: "B.S. + M.S. Electrical Engineering, Purdue · Math + CS minor",
  gradYear: "B.S. expected May 2028",
  // Qualification supplied by the portfolio owner; no year or score specified.
  mathRecognition: {
    title: "AIME qualifier",
    description: "American Invitational Mathematics Examination",
  },
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
    {
      value: "Top 2%",
      label: "LeetCode, global",
      href: "https://leetcode.com/u/Scooter1946/",
    },
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
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/justin-chen-a60a8a283/",
    },
  ],
  aboutQuote:
    "My favorite projects are the ones where code meets physical hardware.",
  about:
    "My path started in competitive programming and quickly spilled over into physical hardware. Whether it is building a smart beehive monitor, assembling a 3-DOF robotic arm, or hand-wiring the macropad up top, I go wherever the interesting problems are. I shift between code and circuits because I get bored doing just one, and I will take a complex, messy challenge over a perfect resume line any day.",
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
      summary: "Led robot-control software on a 100+ person team.",
      tags: ["Java", "FSM", "Leadership"],
    },
  ] as Experience[],
  // Order matters for the bento grid (6 columns): [0] is the featured flagship
  // and spans 4 columns; every other card spans 2. The grid stays gap-free when
  // the number of standard (non-flagship) tiles is 1, 4, 7, … (≡ 1 mod 3).
  // Archived design studies use these stable positions; append new projects.
  inProgressProjects: [riscvProject],
  projects: [
    {
      title: "Remote beehive health monitor",
      badge: "3rd · Starkhacks",
      period: "Apr 2026",
      outcome:
        "An end-to-end IoT health monitor: an on-device C++ neural net at 95% accuracy fuses 4 sensor streams into live alerts on a real-time dashboard — 3rd at Starkhacks (Analog Devices track), the world's largest hardware hackathon, shown to Ford, AMD & Espressif.",
      tags: ["C++", "Embedded ML", "IoT"],
      href: "https://devpost.com/software/beealive",
    },
    {
      title: "PitchLoop",
      badge: "2nd · zero.xyz",
      period: "Jul 2026",
      outcome:
        "An autonomous outreach agent: give it a goal in plain English and it finds prospects, places paid outbound calls, diagnoses failed pitches, and ships new tools for itself via PRs — all policy-checked with hard budget caps. 2nd of 195+ in the zero.xyz track ($500).",
      tags: ["Python", "FastAPI", "AI agents"],
      href: "https://devpost.com/software/pitchloop",
    },
    {
      title: "Real-time limit order book",
      period: "2026",
      outcome:
        "A price-time-priority matching engine in C++ with automated market-making bots — quote two-sided markets and manage inventory risk inside a simulated exchange.",
      tags: ["C++", "Low-latency", "Trading"],
      href: "https://github.com/Scooter1946/Order-Book-Sim",
    },
    {
      title: "Maze algorithm visualizer",
      outcome:
        "Generates mazes with Prim's algorithm, then races DFS, BFS, and A* through them so you can watch each strategy explore and solve in real time.",
      tags: ["JavaScript", "Pathfinding", "A*"],
      href: "https://github.com/Scooter1946/maze-algo-visualizer",
    },
    {
      title: "Handwritten digit detector",
      period: "Nov — Dec 2025",
      outcome:
        "Real-time digit recognition — an OpenCV pipeline (grayscale, Canny, contour finding, perspective warp, adaptive thresholding) feeding an MNIST-trained CNN for live, frame-by-frame inference.",
      tags: ["Python", "OpenCV", "PyTorch"],
      href: "https://github.com/Scooter1946/cv-number-detector",
    },
    {
      title: "3-DOF robotic arm",
      period: "Dec 2025 — Present",
      outcome:
        "Hand-derived forward kinematics and transformation matrices driving a 3-DOF arm, with distance-based error minimization for smooth, continuous motion paths.",
      tags: ["Robotics", "Kinematics", "Control"],
      href: "https://github.com/Scooter1946/roboArm",
    },
    {
      title: "Macropad",
      period: "Jan — Mar 2025",
      outcome:
        "The one up top, for real: custom RP2040 firmware with layered key mappings and RGB control, in a hinged, latchable enclosure I designed to be portable and serviceable.",
      tags: ["RP2040", "Firmware", "CAD"],
      href: "https://github.com/Scooter1946", // TODO(user): dedicated repo/demo
    },
    {
      title: "Personal website",
      period: "2026",
      outcome:
        "The site you're on — a static Astro build with a hand-built CSS-3D macropad, scroll-driven motion, and a warm editorial design system. No UI framework, ~2 KB of JS, fully responsive and accessible.",
      tags: ["Astro", "TypeScript", "CSS"],
      href: "https://github.com/Scooter1946/website",
    },
    siftProject,
  ] as Project[],
  skills: [
    {
      group: "Languages",
      items: ["Java", "Python", "TypeScript", "C/C++", "Dart"],
    },
    {
      group: "Web & cloud",
      items: ["React", "Node.js", "REST APIs", "Firebase"],
    },
    {
      group: "Tools",
      items: ["Git", "Docker", "PyTorch", "OpenCV", "Flutter"],
    },
    {
      group: "Hardware",
      items: ["SystemVerilog", "FPGAs", "RP2040 / Arduino"],
    },
  ],
};
