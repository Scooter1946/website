import { site } from "./site";

// Expanded draft copy checked against the public repositories / Devpost writeups.
// Keep prototypes explicit and omit unverified performance / completion claims.
const entries = [
  {
    title: "Real-time limit order book",
    description:
      "A C++ exchange simulator with trading bots. Buy and sell orders are matched by price, then by arrival time.",
    detail:
      "Includes automated bid/ask bots and tests for the matching engine.",
    stack: ["C++"],
    status: "",
  },
  {
    title: "Handwritten digit detector",
    description:
      "Reads handwritten digits from a webcam using a CNN trained on MNIST.",
    detail:
      "OpenCV finds the paper, corrects the camera angle, and converts the image to 28 × 28 pixels before the model reads it.",
    stack: ["Python", "OpenCV", "PyTorch", "NumPy"],
    status: "",
  },
  {
    title: "3-DOF robotic arm",
    description:
      "An Arduino-controlled arm. I derived the forward kinematics and use gradient descent to move the joints toward a target.",
    detail:
      "Two planar joints are implemented. Base rotation is still planned.",
    stack: ["C++", "Arduino", "Servo library"],
    status: "In progress",
  },
  {
    title: "PitchLoop",
    description:
      "A hackathon project that finds prospects, makes outreach calls, and reviews how the pitches went.",
    detail:
      "A state machine runs each step, with spending limits and checks before the agent takes an action. It can also propose new tools through pull requests.",
    stack: ["Python", "FastAPI"],
    status: "",
  },
  {
    title: "Remote beehive health monitor",
    description:
      "A prototype for monitoring beehive health with environmental sensors and a small neural network.",
    detail:
      "The design combines ESP32 sensors, FPGA signal processing, and a neural network. The hardware isn’t fully integrated yet.",
    stack: ["C++", "ESP32", "PyTorch", "Verilog"],
    status: "Prototype",
  },
  {
    title: "Personal website",
    description: "This site, built with Astro and TypeScript.",
    detail:
      "Three.js handles the 3D models. A WebGL shader animates the background, and the scenes respond to scrolling.",
    stack: ["Astro", "TypeScript", "Three.js", "CSS"],
    status: "",
  },
];

export const moreProjects = entries.map((entry) => ({
  ...entry,
  href: site.projects.find((project) => project.title === entry.title)!.href,
  linkLabel:
    entry.title === "PitchLoop" ||
    entry.title === "Remote beehive health monitor"
      ? "Read writeup"
      : "View code",
}));
