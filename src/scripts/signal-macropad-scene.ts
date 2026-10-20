import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type MacropadScene = {
  update(state: {
    progress: number;
    pointerX: number;
    pointerY: number;
    reduced: boolean;
  }): void;
  dispose(): void;
};

const smooth = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function rounded(w: number, h: number, d: number, radius: number) {
  return new RoundedBoxGeometry(w, h, d, 3, radius);
}

function switchBoardGeometry(): THREE.ExtrudeGeometry {
  const board = new THREE.Shape();
  board.moveTo(-2.04, -2.04);
  board.lineTo(2.04, -2.04);
  board.lineTo(2.04, 2.04);
  board.lineTo(-2.04, 2.04);
  board.closePath();
  // Square switch cutouts leave the board visibly open around all 25 sockets.
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = (col - 2) * 0.7;
      const z = (row - 2) * 0.7;
      const hole = new THREE.Path();
      const r = 0.19;
      hole.moveTo(x - r, -z - r);
      hole.lineTo(x - r, -z + r);
      hole.lineTo(x + r, -z + r);
      hole.lineTo(x + r, -z - r);
      hole.closePath();
      board.holes.push(hole);
    }
  }
  const geometry = new THREE.ExtrudeGeometry(board, {
    depth: 0.075,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function wire(
  points: THREE.Vector3[],
  radius: number,
  material: THREE.Material,
) {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 28, radius, 5, false),
    material,
  );
}

/** Build the conceptual, serviceable 5×5 macropad shown in the Signal portfolio. */
export function initMacropadScene(host: HTMLElement): MacropadScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 80);
  const root = new THREE.Group();
  scene.add(root);
  const enclosure = new THREE.Group();
  const bezel = new THREE.Group();
  const switchBoard = new THREE.Group();
  const controller = new THREE.Group();
  const mechanisms = new THREE.Group();
  const keycaps = new THREE.Group();
  root.add(enclosure, bezel, switchBoard, controller, mechanisms, keycaps);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  let disposed = false;
  const material = (
    color: THREE.ColorRepresentation,
    roughness: number,
    metalness: number,
    extra: Partial<THREE.MeshPhysicalMaterialParameters> = {},
  ) => {
    const value = new THREE.MeshPhysicalMaterial({
      color,
      roughness,
      metalness,
      ...extra,
    });
    materials.push(value);
    return value;
  };
  const shell = material("#d5dad6", 0.45, 0.16, {
    clearcoat: 0.18,
    clearcoatRoughness: 0.38,
  });
  const shellEdge = material("#aeb9b3", 0.34, 0.34);
  const graphite = material("#333c3b", 0.4, 0.15, { clearcoat: 0.14 });
  const dark = material("#202928", 0.32, 0.18);
  const keycap = material("#505b58", 0.36, 0.12, {
    clearcoat: 0.23,
    clearcoatRoughness: 0.33,
  });
  const keyAccent = material("#aab8ae", 0.4, 0.12);
  const pcbMaterial = material("#708879", 0.5, 0.1);
  const daughterPcbMaterial = material("#809688", 0.44, 0.12);
  const copper = material("#ad9776", 0.34, 0.56);
  const solder = material("#bdc7c2", 0.27, 0.65);
  const socket = material("#333d3c", 0.39, 0.17);
  const ledMaterial = material("#b0c1ad", 0.34, 0.12, {
    emissive: "#718d68",
    emissiveIntensity: 0.13,
  });
  const ledBlue = material("#9db9b6", 0.34, 0.15, {
    emissive: "#617d7b",
    emissiveIntensity: 0.12,
  });
  const crystal = material("#d2d8d3", 0.24, 0.62);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  room.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).forEach((m) => m.dispose());
    }
  });
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xf7faf8, 0x748078, 1.75));
  const keyLight = new THREE.DirectionalLight(0xfffcf4, 2.35);
  keyLight.position.set(-4.5, 7, 7);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xe5eeea, 1.3);
  fillLight.position.set(6, 3, -5);
  scene.add(fillLight);
  const softLight = new THREE.PointLight(0xf1f5f0, 2.3, 13, 2);
  softLight.position.set(-1, 5, 1);
  scene.add(softLight);

  const add = (
    geometry: THREE.BufferGeometry,
    mat: THREE.Material,
    parent: THREE.Object3D,
    position?: THREE.Vector3,
  ) => {
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    if (position) mesh.position.copy(position);
    parent.add(mesh);
    return mesh;
  };

  // Open lower tray: floor, four walls, screw posts, and a rear opening for USB-C.
  add(
    rounded(4.28, 0.12, 4.28, 0.16),
    shell,
    enclosure,
    new THREE.Vector3(0, -0.55, 0),
  );
  add(
    rounded(0.14, 0.38, 4.24, 0.055),
    shell,
    enclosure,
    new THREE.Vector3(-2.07, -0.3, 0),
  );
  add(
    rounded(0.14, 0.38, 4.24, 0.055),
    shell,
    enclosure,
    new THREE.Vector3(2.07, -0.3, 0),
  );
  add(
    rounded(4.16, 0.38, 0.14, 0.055),
    shell,
    enclosure,
    new THREE.Vector3(0, -0.3, 2.07),
  );
  add(
    rounded(1.54, 0.38, 0.14, 0.05),
    shell,
    enclosure,
    new THREE.Vector3(-1.3, -0.3, -2.07),
  );
  add(
    rounded(1.54, 0.38, 0.14, 0.05),
    shell,
    enclosure,
    new THREE.Vector3(1.3, -0.3, -2.07),
  );
  for (const x of [-1.82, 1.82]) {
    for (const z of [-1.82, 1.82]) {
      add(
        new THREE.CylinderGeometry(0.14, 0.16, 0.3, 12),
        shellEdge,
        enclosure,
        new THREE.Vector3(x, -0.31, z),
      );
      add(
        new THREE.CylinderGeometry(0.065, 0.07, 0.025, 16),
        solder,
        enclosure,
        new THREE.Vector3(x, -0.13, z),
      );
      add(
        new THREE.BoxGeometry(0.07, 0.012, 0.018),
        graphite,
        enclosure,
        new THREE.Vector3(x, -0.11, z),
      );
    }
  }

  // The upper shell is a hollow rim rather than a lid over the internals.
  add(
    rounded(0.13, 0.15, 4.15, 0.045),
    shell,
    bezel,
    new THREE.Vector3(-2.04, 0, 0),
  );
  add(
    rounded(0.13, 0.15, 4.15, 0.045),
    shell,
    bezel,
    new THREE.Vector3(2.04, 0, 0),
  );
  add(
    rounded(4.12, 0.15, 0.13, 0.045),
    shell,
    bezel,
    new THREE.Vector3(0, 0, 2.04),
  );
  add(
    rounded(1.54, 0.15, 0.13, 0.045),
    shell,
    bezel,
    new THREE.Vector3(-1.3, 0, -2.04),
  );
  add(
    rounded(1.54, 0.15, 0.13, 0.045),
    shell,
    bezel,
    new THREE.Vector3(1.3, 0, -2.04),
  );
  // Hinges on the rear and a simple front latch make the enclosure's service path legible.
  for (const x of [-1.18, 1.18]) {
    const hinge = add(
      new THREE.CylinderGeometry(0.09, 0.09, 0.68, 16),
      shellEdge,
      bezel,
      new THREE.Vector3(x, 0.03, -2.12),
    );
    hinge.rotation.z = Math.PI / 2;
  }
  add(
    rounded(0.5, 0.11, 0.18, 0.05),
    shellEdge,
    bezel,
    new THREE.Vector3(0, -0.015, 2.09),
  );
  add(
    rounded(0.25, 0.04, 0.07, 0.02),
    graphite,
    bezel,
    new THREE.Vector3(0, 0.06, 2.12),
  );
  for (const x of [-1.78, 1.78]) {
    for (const z of [-1.78, 1.78]) {
      add(
        new THREE.CylinderGeometry(0.067, 0.07, 0.035, 16),
        shellEdge,
        bezel,
        new THREE.Vector3(x, 0.09, z),
      );
      add(
        new THREE.BoxGeometry(0.055, 0.009, 0.014),
        graphite,
        bezel,
        new THREE.Vector3(x, 0.111, z),
      );
    }
  }

  // Five-by-five open switch board with square cutouts, contacts, sockets, and restrained RGB indicators.
  const board = add(
    switchBoardGeometry(),
    pcbMaterial,
    switchBoard,
    new THREE.Vector3(0, -0.11, 0),
  );
  board.material.side = THREE.DoubleSide;
  const switchLocations: THREE.Vector3[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = (col - 2) * 0.7;
      const z = (row - 2) * 0.7;
      switchLocations.push(new THREE.Vector3(x, 0, z));
      // Copper pads sit at the corners of each plate opening; the middle remains open.
      for (const dx of [-0.245, 0.245]) {
        for (const dz of [-0.245, 0.245]) {
          add(
            new THREE.BoxGeometry(0.12, 0.014, 0.07),
            copper,
            switchBoard,
            new THREE.Vector3(x + dx, -0.023, z + dz),
          );
        }
      }
      add(
        new THREE.TorusGeometry(0.22, 0.014, 5, 24),
        shellEdge,
        switchBoard,
        new THREE.Vector3(x, -0.016, z),
      ).rotation.x = Math.PI / 2;
      add(
        new THREE.BoxGeometry(0.055, 0.023, 0.045),
        row % 2 ? ledMaterial : ledBlue,
        switchBoard,
        new THREE.Vector3(x + 0.245, -0.006, z + 0.21),
      );
    }
  }
  // Fine board traces run through the narrow channels between switch cutouts.
  for (let row = 0; row < 5; row++) {
    const z = (row - 2) * 0.7 - 0.255;
    const trace = add(
      new THREE.BoxGeometry(3.5, 0.012, 0.013),
      copper,
      switchBoard,
      new THREE.Vector3(0, -0.022, z),
    );
    trace.rotation.y = row % 2 ? 0.035 : -0.035;
  }
  for (let col = 0; col < 5; col++) {
    const x = (col - 2) * 0.7 - 0.255;
    add(
      new THREE.BoxGeometry(0.013, 0.012, 3.5),
      shellEdge,
      switchBoard,
      new THREE.Vector3(x, -0.021, 0),
    );
  }

  // Separate RP2040 controller daughterboard at the back edge, with package contacts and support parts.
  controller.position.set(0, 0.14, 0);
  add(
    rounded(1.62, 0.085, 0.52, 0.065),
    daughterPcbMaterial,
    controller,
    new THREE.Vector3(0, 0, -2.02),
  );
  // Board-edge copper pads and a clear row of plated contacts.
  for (let i = -5; i <= 5; i++) {
    add(
      new THREE.BoxGeometry(0.065, 0.014, 0.026),
      copper,
      controller,
      new THREE.Vector3(i * 0.12, 0.052, -1.78),
    );
  }
  // RP2040 package: black square chip with individual gull-wing contacts on four edges.
  add(
    rounded(0.52, 0.105, 0.52, 0.045),
    dark,
    controller,
    new THREE.Vector3(-0.12, 0.095, -2.04),
  );
  add(
    rounded(0.29, 0.022, 0.29, 0.025),
    graphite,
    controller,
    new THREE.Vector3(-0.12, 0.153, -2.04),
  );
  for (let pin = 0; pin < 8; pin++) {
    const along = (pin - 3.5) * 0.052;
    add(
      new THREE.BoxGeometry(0.035, 0.018, 0.014),
      solder,
      controller,
      new THREE.Vector3(-0.12 + along, 0.065, -2.32),
    );
    add(
      new THREE.BoxGeometry(0.035, 0.018, 0.014),
      solder,
      controller,
      new THREE.Vector3(-0.12 + along, 0.065, -1.76),
    );
    add(
      new THREE.BoxGeometry(0.014, 0.018, 0.035),
      solder,
      controller,
      new THREE.Vector3(-0.4, 0.065, -2.04 + along),
    );
    add(
      new THREE.BoxGeometry(0.014, 0.018, 0.035),
      solder,
      controller,
      new THREE.Vector3(0.16, 0.065, -2.04 + along),
    );
  }
  // USB-C receptacle and its shielded shell pass through the rear enclosure opening.
  add(
    rounded(0.48, 0.16, 0.25, 0.055),
    solder,
    controller,
    new THREE.Vector3(0, 0.04, -2.38),
  );
  add(
    rounded(0.28, 0.065, 0.025, 0.025),
    graphite,
    controller,
    new THREE.Vector3(0, 0.035, -2.515),
  );
  add(
    new THREE.BoxGeometry(0.18, 0.012, 0.012),
    shellEdge,
    controller,
    new THREE.Vector3(0, 0.034, -2.532),
  );
  // Quartz crystal, decoupling capacitors, and a small regulator are individually visible.
  add(
    rounded(0.26, 0.07, 0.12, 0.045),
    crystal,
    controller,
    new THREE.Vector3(0.48, 0.075, -2.05),
  );
  add(
    rounded(0.13, 0.065, 0.105, 0.03),
    shellEdge,
    controller,
    new THREE.Vector3(0.51, 0.07, -1.84),
  );
  add(
    rounded(0.12, 0.06, 0.09, 0.025),
    dark,
    controller,
    new THREE.Vector3(-0.54, 0.07, -1.9),
  );
  add(
    new THREE.SphereGeometry(0.04, 12, 10),
    ledMaterial,
    controller,
    new THREE.Vector3(0.61, 0.09, -2.18),
  );
  for (let i = 0; i < 3; i++) {
    const trace = wire(
      [
        new THREE.Vector3(0.25 + i * 0.08, 0.05, -2.28),
        new THREE.Vector3(0.33 + i * 0.08, 0.05, -2.17),
        new THREE.Vector3(0.43, 0.05, -2.08 + i * 0.07),
      ],
      0.008,
      copper,
    );
    controller.add(trace);
    geometries.push(trace.geometry);
  }
  // Two fine harness wires visually join the controller to the switch matrix while assembled.
  for (let i = 0; i < 2; i++) {
    const x = -0.16 + i * 0.12;
    const harness = wire(
      [
        new THREE.Vector3(x, 0.075, -1.78),
        new THREE.Vector3(x, 0.075, -1.58),
        new THREE.Vector3(x, -0.025, -1.48),
        new THREE.Vector3(x, -0.025, -1.27),
      ],
      0.012,
      i ? copper : shellEdge,
    );
    root.add(harness);
    geometries.push(harness.geometry);
  }

  // Individual mechanical switch housings and cross stems remain separate from the socket PCB.
  for (let i = 0; i < switchLocations.length; i++) {
    const { x, z } = switchLocations[i]!;
    add(
      rounded(0.43, 0.18, 0.43, 0.055),
      socket,
      mechanisms,
      new THREE.Vector3(x, 0.075, z),
    );
    add(
      rounded(0.34, 0.065, 0.34, 0.04),
      graphite,
      mechanisms,
      new THREE.Vector3(x, 0.188, z),
    );
    // MX-style cross-shaped stem, distinct from the cap above it.
    add(
      new THREE.BoxGeometry(0.22, 0.105, 0.075),
      dark,
      mechanisms,
      new THREE.Vector3(x, 0.269, z),
    );
    add(
      new THREE.BoxGeometry(0.075, 0.105, 0.22),
      dark,
      mechanisms,
      new THREE.Vector3(x, 0.269, z),
    );
    // Socket contacts are exposed around the housing on the separated switch board.
    for (const dx of [-0.24, 0.24]) {
      add(
        new THREE.CylinderGeometry(0.025, 0.025, 0.018, 8),
        solder,
        switchBoard,
        new THREE.Vector3(x + dx, -0.012, z + 0.12),
      );
    }
    const accent = i % 8 === 0 || i === 12;
    add(
      rounded(0.56, 0.25, 0.56, 0.105),
      accent ? keyAccent : keycap,
      keycaps,
      new THREE.Vector3(x, 0.43, z),
    );
    // A shallow top inset gives each key a gently dished, tactile surface.
    add(
      rounded(0.39, 0.018, 0.39, 0.09),
      accent ? shellEdge : graphite,
      keycaps,
      new THREE.Vector3(x, 0.562, z),
    );
  }

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    pointerEvents: "none",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = false;
  host.append(canvas);
  host.classList.add("macropad-scene-ready");

  // Project the leaders from real layer positions, so they remain attached on tilt.
  const svgNS = "http://www.w3.org/2000/svg";
  const labels = document.createElementNS(svgNS, "svg");
  labels.classList.add("pad-layer-labels");
  labels.setAttribute("aria-hidden", "true");
  const labelSpecs = [
    {
      name: "Keycaps",
      group: keycaps,
      point: new THREE.Vector3(1.7, 0.5, -0.7),
      y: 0.17,
    },
    {
      name: "Top rim",
      group: bezel,
      point: new THREE.Vector3(2.04, 0.05, -0.5),
      y: 0.28,
    },
    {
      name: "Switches",
      group: mechanisms,
      point: new THREE.Vector3(1.65, 0.25, -0.4),
      y: 0.39,
    },
    {
      name: "NeoKey PCB",
      group: switchBoard,
      point: new THREE.Vector3(2, 0, -0.1),
      y: 0.5,
    },
    {
      name: "RP2040",
      group: controller,
      point: new THREE.Vector3(0.15, 0.15, -2.04),
      y: 0.76,
    },
    {
      name: "Case",
      group: enclosure,
      point: new THREE.Vector3(2.07, -0.3, 0.4),
      y: 0.64,
    },
  ];
  // Cache local bounds once; framing a rotated part never traverses every mesh.
  const partCorners = labelSpecs.map(({ group }) => {
    const box = new THREE.Box3().setFromObject(group);
    box.translate(group.position.clone().negate());
    return [box.min.x, box.max.x].flatMap((x) =>
      [box.min.y, box.max.y].flatMap((y) =>
        [box.min.z, box.max.z].map((z) => new THREE.Vector3(x, y, z)),
      ),
    );
  });
  const events = new AbortController();
  const eventOptions = { signal: events.signal };
  const piece = host.closest<HTMLElement>(".desk-piece");
  const note = piece?.querySelector<HTMLElement>("[data-pad-note]");
  const caption = piece?.querySelector<HTMLElement>("#pad-caption");
  const originalCaption = caption?.textContent || "";
  const surface = document.createElement("span");
  surface.className = "pad-rotate-surface";
  surface.tabIndex = 0;
  surface.setAttribute("role", "group");
  surface.setAttribute(
    "aria-label",
    "Rotate macropad. Drag or use the arrow keys. Press Escape to reset.",
  );
  host.append(surface);
  const controls = document.createElement("div");
  controls.className = "pad-inspector-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Macropad view");
  piece?.insertBefore(controls, caption || null);
  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "pad-reset";
  resetButton.textContent = "Reset view";
  resetButton.addEventListener("click", () => reset(), eventOptions);
  for (const [name, glyph, dx, dy] of [
    ["Rotate left", "←", -0.28, 0],
    ["Rotate right", "→", 0.28, 0],
    ["Rotate up", "↑", 0, -0.28],
    ["Rotate down", "↓", 0, 0.28],
  ] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pad-turn";
    button.textContent = glyph;
    button.setAttribute("aria-label", name);
    button.addEventListener("click", () => rotate(dx, dy), eventOptions);
    controls.append(button);
  }
  controls.append(resetButton);
  if (caption) caption.setAttribute("aria-live", "polite");
  const leaders = labelSpecs.map((spec) => {
    const group = document.createElementNS(svgNS, "g");
    const line = document.createElementNS(svgNS, "path");
    const dot = document.createElementNS(svgNS, "circle");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pad-part-label";
    button.textContent = spec.name;
    button.setAttribute("aria-label", `Inspect ${spec.name}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener(
      "click",
      () => selectPart(labelSpecs.indexOf(spec)),
      eventOptions,
    );
    dot.setAttribute("r", "1.8");
    group.append(line, dot);
    labels.append(group);
    host.append(button);
    return { ...spec, line, dot, button, group };
  });
  host.append(labels);

  const viewport = new THREE.Vector2(1, 1);
  const cameraRight = new THREE.Vector3();
  const cameraUp = new THREE.Vector3();
  const center = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const displayedOffset = new THREE.Vector3();
  const userRotation = new THREE.Quaternion();
  const deltaRotation = new THREE.Quaternion();
  const baseRotation = new THREE.Quaternion();
  const baseEuler = new THREE.Euler();
  const projectedCorner = new THREE.Vector3();
  const startRotation = new THREE.Quaternion();
  const startOffset = new THREE.Vector3();
  const cached = { progress: 0, pointerX: 0, pointerY: 0, reduced: false };
  let focused: number | null = null;
  let rotated = false;
  let transitionStart: number | null = null;
  let startHeight = 7.2;
  let transitionFrame = 0;
  let drag: { id: number; x: number; y: number; touch: boolean } | null = null;
  let viewHeight = 7.2;
  const beginTransition = () => {
    startHeight = viewHeight;
    startOffset.copy(root.position);
    startRotation.copy(root.quaternion);
    transitionStart = cached.reduced ? null : performance.now();
  };
  const selectPart = (index: number) => {
    beginTransition();
    focused = focused === index ? null : index;
    // Restore the full assembly at its fitted size before showing its layers.
    if (focused === null) transitionStart = null;
    host.dataset.part = focused === null ? "all" : labelSpecs[focused]!.name;
    if (caption)
      caption.textContent =
        focused === null ? originalCaption : labelSpecs[focused]!.name;
    render(cached);
  };
  const reset = () => {
    transitionStart = null;
    focused = null;
    rotated = false;
    userRotation.identity();
    host.dataset.part = "all";
    if (caption) caption.textContent = originalCaption;
    render(cached);
  };
  const rotate = (dx: number, dy: number) => {
    // Screen-space quaternion rotation has no yaw/pitch clamp or pole lock.
    rotated = true;
    deltaRotation.setFromAxisAngle(cameraUp, dx);
    userRotation.premultiply(deltaRotation);
    deltaRotation.setFromAxisAngle(cameraRight, dy);
    userRotation.premultiply(deltaRotation).normalize();
    render(cached);
  };
  const endDrag = () => {
    const id = drag?.id;
    drag = null;
    host.classList.remove("pad-dragging");
    if (id !== undefined && surface.hasPointerCapture(id))
      surface.releasePointerCapture(id);
  };
  surface.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        touch: event.pointerType === "touch",
      };
      surface.setPointerCapture(event.pointerId);
      host.classList.add("pad-dragging");
      if (event.pointerType === "mouse") {
        event.preventDefault();
        surface.focus({ preventScroll: true });
      }
    },
    eventOptions,
  );
  surface.addEventListener(
    "pointermove",
    (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const scale = (Math.PI * 2) / Math.max(240, viewport.x - 90);
      const dx = (event.clientX - drag.x) * scale;
      const dy = drag.touch ? 0 : (event.clientY - drag.y) * scale;
      drag.x = event.clientX;
      drag.y = event.clientY;
      rotate(dx, dy);
    },
    eventOptions,
  );
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    surface.addEventListener(event, endDrag, eventOptions);
  surface.addEventListener(
    "keydown",
    (event) => {
      const steps: Record<string, [number, number]> = {
        ArrowLeft: [-0.2, 0],
        ArrowRight: [0.2, 0],
        ArrowUp: [0, -0.2],
        ArrowDown: [0, 0.2],
      };
      const step = steps[event.key];
      if (!step) return;
      event.preventDefault();
      rotate(...step);
    },
    eventOptions,
  );
  piece?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        reset();
      }
    },
    eventOptions,
  );
  const render = (state: typeof cached) => {
    if (disposed) return;
    const progress = THREE.MathUtils.clamp(state.progress, 0, 1);
    const spread = state.reduced || focused !== null ? 1 : smooth(progress);
    const mobile = viewport.x <= 420;
    let targetHeight = mobile ? mix(7.5, 9.2, spread) : mix(6.9, 8.8, spread);
    const aspect = viewport.x / Math.max(1, viewport.y);

    enclosure.position.set(-0.28 * spread, -0.5 * spread, 0.05 * spread);
    bezel.position.set(-0.43 * spread, 1.25 * spread, -0.25 * spread);
    bezel.rotation.x = -0.07 * spread;
    bezel.rotation.z = -0.035 * spread;
    switchBoard.position.set(
      0.02 * spread,
      -0.08 + 0.46 * spread,
      0.04 * spread,
    );
    // Seat the switch housings just into the PCB openings before the layer lifts.
    mechanisms.position.set(0, -0.02 + 0.58 * spread, 0);
    keycaps.position.set(-0.06 * spread, 1.12 * spread, 0.03 * spread);
    // Fan the controller toward the camera-facing right edge so its chip and USB-C
    // remain inspectable once the key matrix and case separate.
    controller.position.set(2.45 * spread, 0.14 - 0.55 * spread, 4.1 * spread);

    baseEuler.y =
      state.reduced || rotated || focused !== null
        ? 0
        : state.pointerX * 0.07 + Math.sin(progress * Math.PI) * 0.025;
    baseEuler.x =
      0.07 +
      (state.reduced || rotated || focused !== null
        ? 0
        : state.pointerY * 0.045);
    baseEuler.z =
      state.reduced || rotated || focused !== null
        ? 0
        : -state.pointerX * 0.012;
    baseRotation.setFromEuler(baseEuler);
    root.quaternion.copy(baseRotation).premultiply(userRotation);
    const transition =
      transitionStart === null || state.reduced
        ? 1
        : smooth((performance.now() - transitionStart) / 420);
    if (transition < 1)
      root.quaternion.slerpQuaternions(
        startRotation,
        root.quaternion.clone(),
        transition,
      );
    const camX =
      state.reduced || rotated || focused !== null
        ? 7.8
        : 7.8 + state.pointerX * 0.22;
    const camY =
      state.reduced || rotated || focused !== null
        ? 8.1
        : 8.1 - state.pointerY * 0.18;
    camera.position.set(camX, camY, 12.2);
    camera.lookAt(0, 0.04, 0);
    camera.updateMatrixWorld();
    cameraRight.setFromMatrixColumn(camera.matrixWorld, 0);
    cameraUp.setFromMatrixColumn(camera.matrixWorld, 1);
    center.set(0, 0.05 + 0.25 * spread, 0).applyQuaternion(root.quaternion);
    offset
      .copy(cameraRight)
      .multiplyScalar(-center.dot(cameraRight))
      .addScaledVector(cameraUp, -center.dot(cameraUp));
    root.position.copy(offset);
    root.position.addScaledVector(cameraRight, -0.68 * spread);
    // Focus is a true isolated part. Also hide the two loose harness meshes.
    root.children.forEach((child) => {
      child.visible = focused === null || child === labelSpecs[focused]!.group;
    });
    if (focused !== null || rotated) {
      root.position.set(0, 0, 0);
      root.updateMatrixWorld(true);
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      labelSpecs.forEach((part, index) => {
        if (focused !== null && focused !== index) return;
        partCorners[index]!.forEach((corner) => {
          projectedCorner.copy(corner).applyMatrix4(part.group.matrixWorld);
          const x = projectedCorner.dot(cameraRight);
          const y = projectedCorner.dot(cameraUp);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        });
      });
      const availableWidth = Math.max(100, viewport.x - 112);
      const fitted =
        Math.max(
          (maxY - minY) / 0.8,
          ((maxX - minX) * viewport.y) / availableWidth,
        ) * 1.12;
      targetHeight = focused === null ? Math.max(targetHeight, fitted) : fitted;
      root.position
        .copy(cameraRight)
        .multiplyScalar(-(minX + maxX) / 2 - (44 * targetHeight) / viewport.y)
        .addScaledVector(cameraUp, -(minY + maxY) / 2 + 0.04);
    }
    displayedOffset.copy(root.position);
    if (transition < 1) {
      root.position.lerpVectors(startOffset, displayedOffset, transition);
      viewHeight = mix(startHeight, targetHeight, transition);
    } else {
      viewHeight = targetHeight;
      transitionStart = null;
    }
    camera.left = (-viewHeight * aspect) / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    labels.setAttribute("viewBox", `0 0 ${viewport.x} ${viewport.y}`);
    leaders.forEach((leader, index) => {
      const anchor = leader.point.clone();
      // Object3D reference is kept separately from the SVG grouping element.
      labelSpecs[index]!.group.localToWorld(anchor);
      anchor.project(camera);
      const x = ((anchor.x + 1) * viewport.x) / 2;
      const y = ((1 - anchor.y) * viewport.y) / 2;
      const textX = viewport.x - 82;
      // 44px hit areas remain separate even on a narrow phone viewport.
      const row = [0, 1, 2, 3, 5, 4][index]!;
      const textY = 22 + row * Math.max(44, (viewport.y - 44) / 6);
      leader.line.setAttribute(
        "d",
        `M${x},${y} L${textX - 12},${textY} H${textX - 5}`,
      );
      leader.dot.setAttribute("cx", String(x));
      leader.dot.setAttribute("cy", String(y));
      leader.button.style.top = `${textY - 22}px`;
      leader.button.setAttribute("aria-pressed", String(focused === index));
      leader.group.style.opacity =
        focused === null
          ? String(smooth((progress - 0.25 - index * 0.055) / 0.32))
          : "0";
    });
    if (note)
      note.textContent =
        focused === null
          ? "Drag to rotate · Select a layer"
          : "Drag to rotate · Reset view to return";
    if (transition < 1 && !transitionFrame && !document.hidden)
      transitionFrame = requestAnimationFrame(() => {
        transitionFrame = 0;
        render(cached);
      });
  };

  const resize = () => {
    if (disposed) return;
    const bounds = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    viewport.set(width, height);
    renderer.setSize(width, height, false);
    render(cached);
  };
  const observer =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
  observer?.observe(host);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    endDrag();
    cancelAnimationFrame(transitionFrame);
    transitionFrame = 0;
    host.classList.remove("macropad-scene-ready");
    controls.hidden = true;
  };
  const onContextRestored = () => {
    if (!disposed) {
      host.classList.add("macropad-scene-ready");
      controls.hidden = false;
      render(cached);
    }
  };
  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);
  resize();

  return {
    update(state) {
      if (disposed) return;
      cached.progress = THREE.MathUtils.clamp(state.progress, 0, 1);
      cached.pointerX = THREE.MathUtils.clamp(state.pointerX, -1, 1);
      cached.pointerY = THREE.MathUtils.clamp(state.pointerY, -1, 1);
      cached.reduced = state.reduced;
      render(cached);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      events.abort();
      endDrag();
      cancelAnimationFrame(transitionFrame);
      observer?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((item) => item.dispose());
      scene.environment = null;
      environment.dispose();
      renderer.dispose();
      canvas.remove();
      labels.remove();
      leaders.forEach((leader) => leader.button.remove());
      surface.remove();
      controls.remove();
      if (caption) {
        caption.textContent = originalCaption;
        caption.removeAttribute("aria-live");
      }
      delete host.dataset.part;
      host.classList.remove("macropad-scene-ready");
    },
  };
}
