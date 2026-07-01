export interface Project {
  title: string;
  outcome: string; // one line; MUST contain a quantified metric
  tags: string[];
  href: string;
}

export const site = {
  name: "Justin Chen",
  // Status pill text (paired with the pulsing availability dot). Role-agnostic by request.
  available: "Building things at Purdue",
  location: "West Lafayette, IN",
  education: "B.S./M.S. Electrical Engineering, Purdue",
  specializations: [
    // the kinetic headline cycles through these
    "firmware",
    "silicon",
    "web",
    "ML",
  ],
  stats: [
    { value: "Top 2%", label: "LeetCode, global" },
    { value: "1600+", label: "Codeforces — Expert" },
    { value: "#1", label: "DECA stock-market game · 2,000+ entrants" },
  ],
  email: "tulare789@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Scooter1946" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/justin-chen-a60a8a283/" },
  ],
  resume: "/resume.pdf", // TODO(user): drop a (phone-redacted) PDF at public/resume.pdf
  about:
    "I fell for software through competitive programming, and now I like working top to bottom — from a React app someone actually enjoys down to SystemVerilog on an FPGA. Mostly I care about building things that are fast and genuinely pleasant to use.",
  skills: [
    { group: "Languages", items: ["Java", "Python", "TypeScript", "C/C++", "Dart"] },
    { group: "Web & cloud", items: ["React", "Node.js", "REST APIs", "Firebase"] },
    { group: "Tools", items: ["Git", "Docker", "PyTorch", "OpenCV", "Flutter"] },
    { group: "Hardware", items: ["SystemVerilog", "FPGAs", "RP2040 / Arduino"] },
  ],
  projects: [
    {
      title: "Remote beehive health monitor",
      outcome:
        "On-device C++ neural net at 95% accuracy, fusing 4 sensor streams into live alerts — 3rd at Starkhacks, the world's largest hardware hackathon.",
      tags: ["C++", "IoT", "ML"],
      href: "https://github.com/Scooter1946",
    },
    {
      title: "Order pipeline · Vivalink",
      outcome:
        "Cut order-processing latency 20× with a server warm-up endpoint and a precompiled Docker build.",
      tags: ["TypeScript", "Docker", "Odoo"],
      href: "https://github.com/Scooter1946",
    },
    {
      title: "On-device vision · Perceptions Innovations",
      outcome:
        "Rewrote the facial- and hand-detection core to run 5× faster, enabling cheaper, smaller hardware.",
      tags: ["C/C++", "Embedded", "Computer vision"],
      href: "https://github.com/Scooter1946",
    },
  ] as Project[],
};
