import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type CpuScene = {
  update(progress: number, reduced: boolean): void;
  setActive(active: boolean): void;
  dispose(): void;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** Build an illustrative exposed processor package with die lanes and wire bonds. */
export function initCpuScene(host: HTMLElement): CpuScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
      premultipliedAlpha: false,
    });
  } catch {
    return null;
  }

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  let disposed = false;
  const trackGeometry = <T extends THREE.BufferGeometry>(geometry: T) => {
    geometries.push(geometry);
    return geometry;
  };
  const material = (
    color: THREE.ColorRepresentation,
    roughness: number,
    metalness: number,
    extra: Partial<THREE.MeshPhysicalMaterialParameters> = {},
  ) => {
    const surface = new THREE.MeshPhysicalMaterial({
      color,
      roughness,
      metalness,
      ...extra,
    });
    materials.push(surface);
    return surface;
  };
  const addMesh = (
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    surface: THREE.Material,
    position: THREE.Vector3,
  ) => {
    const mesh = new THREE.Mesh(trackGeometry(geometry), surface);
    mesh.position.copy(position);
    parent.add(mesh);
    return mesh;
  };

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.5, 3.5, 2.33, -2.33, 0.1, 60);
  const assembly = new THREE.Group();
  scene.add(assembly);

  // Room reflections give the small polished die and bond wires legible highlights.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.035).texture;
  scene.environment = environment;
  room.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    node.geometry.dispose();
    (Array.isArray(node.material) ? node.material : [node.material]).forEach(
      (surface) => surface.dispose(),
    );
  });
  pmrem.dispose();

  const sageBoard = material("#71877a", 0.4, 0.24, {
    clearcoat: 0.18,
    clearcoatRoughness: 0.38,
  });
  const boardEdge = material("#3e5149", 0.34, 0.36);
  const boardTop = material("#82978a", 0.42, 0.18);
  const silicon = material("#52635f", 0.2, 0.31, {
    clearcoat: 0.84,
    clearcoatRoughness: 0.18,
    specularIntensity: 0.76,
  });
  const siliconDark = material("#303e3c", 0.25, 0.36, { clearcoat: 0.45 });
  const cellLight = material("#9aada0", 0.29, 0.31, { clearcoat: 0.26 });
  const cellPale = material("#d4dbd2", 0.32, 0.2, { clearcoat: 0.3 });
  const copper = material("#b69a70", 0.24, 0.78, { clearcoat: 0.22 });
  const copperDark = material("#806a4c", 0.32, 0.68);
  const wireGold = material("#d3b47e", 0.19, 0.86, { clearcoat: 0.42 });
  const wirePale = material("#d9c69d", 0.22, 0.82);
  const routeInk = material("#c0a06b", 0.25, 0.66);
  const pulseMaterial = material("#f0d49b", 0.18, 0.55, {
    emissive: "#b9945d",
    emissiveIntensity: 0.32,
    clearcoat: 0.45,
  });

  // Thin carrier board: one substrate, one exposed die, and no cover stack.
  addMesh(
    assembly,
    new THREE.BoxGeometry(4.3, 0.14, 3.1),
    boardEdge,
    new THREE.Vector3(0, -0.02, 0),
  );
  addMesh(
    assembly,
    new THREE.BoxGeometry(4.18, 0.035, 2.98),
    sageBoard,
    new THREE.Vector3(0, 0.067, 0),
  );
  addMesh(
    assembly,
    new THREE.BoxGeometry(3.95, 0.012, 2.72),
    boardTop,
    new THREE.Vector3(0, 0.091, 0),
  );

  // Fine package pins are visible beneath the board at the oblique end of the orbit.
  for (let index = 0; index < 17; index++) {
    const x = -1.86 + index * 0.2325;
    for (const z of [-1.35, 1.35]) {
      addMesh(
        assembly,
        new THREE.BoxGeometry(0.065, 0.14, 0.065),
        copperDark,
        new THREE.Vector3(x, -0.13, z),
      );
    }
  }
  for (let index = 0; index < 11; index++) {
    const z = -1.2 + index * 0.24;
    for (const x of [-2.0, 2.0]) {
      addMesh(
        assembly,
        new THREE.BoxGeometry(0.065, 0.14, 0.065),
        copperDark,
        new THREE.Vector3(x, -0.13, z),
      );
    }
  }

  // Perimeter bond pads sit around the die, slightly inset from the substrate edge.
  const packagePads: THREE.Vector3[] = [];
  const diePads: THREE.Vector3[] = [];
  const padRow = (
    side: -1 | 1,
    count: number,
    start: number,
    step: number,
    zStart: number,
  ) => {
    for (let index = 0; index < count; index++) {
      const z = zStart + index * step;
      const x = side * start;
      addMesh(
        assembly,
        new THREE.BoxGeometry(0.095, 0.016, 0.055),
        copper,
        new THREE.Vector3(x, 0.112, z),
      );
      packagePads.push(new THREE.Vector3(x, 0.125, z));
      const dx = side * 1.32;
      const wireZ = -0.89 + index * (1.78 / Math.max(1, count - 1));
      diePads.push(new THREE.Vector3(dx, 0.37, wireZ));
    }
  };
  padRow(-1, 16, 1.92, 0.15, -1.13);
  padRow(1, 16, 1.92, 0.15, -1.13);
  const endPadRow = (side: -1 | 1, count: number) => {
    for (let index = 0; index < count; index++) {
      const x = -1.35 + index * (2.7 / (count - 1));
      const z = side * 1.36;
      addMesh(
        assembly,
        new THREE.BoxGeometry(0.06, 0.016, 0.09),
        copper,
        new THREE.Vector3(x, 0.112, z),
      );
      packagePads.push(new THREE.Vector3(x, 0.125, z));
      diePads.push(new THREE.Vector3(x * 0.68, 0.37, side * 0.91));
    }
  };
  endPadRow(-1, 13);
  endPadRow(1, 13);

  // One thin exposed silicon die with a polished top surface.
  addMesh(
    assembly,
    new THREE.BoxGeometry(2.82, 0.19, 1.94),
    silicon,
    new THREE.Vector3(0, 0.245, 0),
  );
  const dieTopY = 0.343;
  // Edge seal and tiny repeated bond fingers make the die boundary read at this scale.
  const edgeSeal = addMesh(
    assembly,
    new THREE.BoxGeometry(2.78, 0.008, 1.9),
    siliconDark,
    new THREE.Vector3(0, dieTopY + 0.006, 0),
  );
  edgeSeal.material = siliconDark;
  for (let index = 0; index < 15; index++) {
    const z = -0.88 + index * 0.126;
    addMesh(
      assembly,
      new THREE.BoxGeometry(0.045, 0.012, 0.028),
      wirePale,
      new THREE.Vector3(-1.34, dieTopY + 0.015, z),
    );
    addMesh(
      assembly,
      new THREE.BoxGeometry(0.045, 0.012, 0.028),
      wirePale,
      new THREE.Vector3(1.34, dieTopY + 0.015, z),
    );
  }
  for (let index = 0; index < 13; index++) {
    const x = -1.2 + index * 0.2;
    addMesh(
      assembly,
      new THREE.BoxGeometry(0.028, 0.012, 0.045),
      wirePale,
      new THREE.Vector3(x, dieTopY + 0.015, -0.91),
    );
    addMesh(
      assembly,
      new THREE.BoxGeometry(0.028, 0.012, 0.045),
      wirePale,
      new THREE.Vector3(x, dieTopY + 0.015, 0.91),
    );
  }

  // Asymmetric banks of register/memory cells sit flush on the die surface.
  const cellGeometry = new THREE.BoxGeometry(0.078, 0.018, 0.052);
  trackGeometry(cellGeometry);
  const cellBanks = [
    { x: -1.0, z: -0.68, cols: 7, rows: 4, mat: cellLight },
    { x: 0.2, z: -0.72, cols: 10, rows: 3, mat: cellPale },
    { x: 0.84, z: -0.22, cols: 5, rows: 6, mat: cellLight },
    { x: -0.92, z: 0.34, cols: 6, rows: 5, mat: cellPale },
    { x: -0.12, z: 0.68, cols: 8, rows: 3, mat: cellLight },
    { x: 0.9, z: 0.58, cols: 4, rows: 4, mat: cellPale },
  ];
  const dummy = new THREE.Object3D();
  for (const bank of cellBanks) {
    const cells = new THREE.InstancedMesh(
      cellGeometry,
      bank.mat,
      bank.cols * bank.rows,
    );
    cells.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    let cell = 0;
    for (let row = 0; row < bank.rows; row++) {
      for (let col = 0; col < bank.cols; col++) {
        dummy.position.set(
          bank.x + col * 0.09,
          dieTopY + 0.025,
          bank.z + row * 0.065,
        );
        dummy.rotation.set(0, (((row + col) % 3) - 1) * 0.018, 0);
        dummy.updateMatrix();
        cells.setMatrixAt(cell++, dummy.matrix);
      }
    }
    cells.instanceMatrix.needsUpdate = true;
    cells.castShadow = false;
    assembly.add(cells);
  }

  // A rectangular bit-slice field, crossed by narrow etched lanes rather than a logo.
  const aluBase = addMesh(
    assembly,
    new THREE.BoxGeometry(0.82, 0.018, 0.96),
    siliconDark,
    new THREE.Vector3(-0.02, dieTopY + 0.018, -0.005),
  );
  aluBase.material = siliconDark;
  const route = (
    points: THREE.Vector3[],
    radius: number,
    surface: THREE.Material,
    parent: THREE.Object3D = assembly,
  ) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(
      curve,
      Math.max(12, points.length * 10),
      radius,
      5,
      false,
    );
    return addMesh(parent, geometry, surface, new THREE.Vector3());
  };
  // Fine bus lanes meander between uneven cell banks and the central arithmetic field.
  const etchedY = dieTopY + 0.032;
  const busPaths = [
    [
      [-1.28, -0.28],
      [-1.14, -0.28],
      [-1.02, -0.13],
      [-0.48, -0.13],
    ],
    [
      [-1.26, 0.28],
      [-1.08, 0.28],
      [-0.94, 0.4],
      [-0.48, 0.4],
    ],
    [
      [-0.64, -0.79],
      [-0.64, -0.59],
      [-0.38, -0.37],
      [-0.38, -0.31],
    ],
    [
      [0.27, -0.8],
      [0.27, -0.57],
      [0.16, -0.42],
      [0.16, -0.31],
    ],
    [
      [0.83, -0.47],
      [0.68, -0.32],
      [0.48, -0.31],
    ],
    [
      [0.86, 0.4],
      [0.65, 0.4],
      [0.48, 0.29],
    ],
    [
      [-0.62, 0.76],
      [-0.62, 0.59],
      [-0.39, 0.39],
    ],
    [
      [0.22, 0.79],
      [0.22, 0.56],
      [0.12, 0.38],
    ],
  ];
  busPaths.forEach((path, index) => {
    route(
      path.map(
        ([x, z]) => new THREE.Vector3(x, etchedY + (index % 2) * 0.002, z),
      ),
      0.006,
      index % 3 === 0 ? routeInk : copperDark,
    );
  });
  // Repeated narrow lines over the arithmetic field read as a cut silicon lane array.
  for (let index = 0; index < 11; index++) {
    const z = -0.42 + index * 0.083;
    const startX = -0.39 + (index % 2) * 0.035;
    route(
      [
        new THREE.Vector3(startX, dieTopY + 0.043, z),
        new THREE.Vector3(0.34 - (index % 3) * 0.025, dieTopY + 0.043, z),
      ],
      0.005,
      index % 3 === 0 ? wirePale : routeInk,
    );
  }

  // Hundreds of tiny vias are implied by precise pad dots, not printed text or icons.
  const viaMaterial = material("#c8b17f", 0.22, 0.78);
  const viaGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8);
  trackGeometry(viaGeometry);
  const viaLocations: THREE.Vector3[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 14; col++) {
      const x = -0.56 + col * 0.082;
      const z = -0.28 + row * 0.08;
      if ((row + col) % 3 === 0)
        viaLocations.push(new THREE.Vector3(x, dieTopY + 0.026, z));
    }
  }
  const vias = new THREE.InstancedMesh(
    viaGeometry,
    viaMaterial,
    viaLocations.length,
  );
  viaLocations.forEach((position, index) => {
    dummy.position.copy(position);
    dummy.rotation.set(Math.PI / 2, 0, 0);
    dummy.updateMatrix();
    vias.setMatrixAt(index, dummy.matrix);
  });
  assembly.add(vias);

  // Fine arched bond wires bridge each die finger to a surrounding package pad.
  const wireCurveFor = (
    from: THREE.Vector3,
    to: THREE.Vector3,
    lift: number,
  ) => {
    const middle = from.clone().lerp(to, 0.5);
    return [
      from,
      from
        .clone()
        .lerp(middle, 0.48)
        .add(new THREE.Vector3(0, lift * 0.7, 0)),
      middle.add(new THREE.Vector3(0, lift, 0)),
      to
        .clone()
        .lerp(from, 0.22)
        .add(new THREE.Vector3(0, lift * 0.55, 0)),
      to,
    ];
  };
  packagePads.forEach((pad, index) => {
    const diePad = diePads[index]!;
    const sideLift = 0.3 + (index % 4) * 0.035;
    route(
      wireCurveFor(diePad, pad, sideLift),
      0.009,
      index % 5 === 0 ? wirePale : wireGold,
    );
  });

  // A single subdued signal pulse follows the illustrative route across the die.
  const signalPoints = [
    new THREE.Vector3(-1.03, dieTopY + 0.07, -0.67),
    new THREE.Vector3(-0.66, dieTopY + 0.07, -0.48),
    new THREE.Vector3(-0.24, dieTopY + 0.07, -0.23),
    new THREE.Vector3(0.18, dieTopY + 0.07, 0.04),
    new THREE.Vector3(0.63, dieTopY + 0.07, 0.35),
    new THREE.Vector3(1.02, dieTopY + 0.07, 0.6),
  ];
  const signalCurve = new THREE.CatmullRomCurve3(signalPoints);
  route(signalPoints, 0.007, routeInk);
  const pulse = addMesh(
    assembly,
    new THREE.SphereGeometry(0.035, 14, 10),
    pulseMaterial,
    signalCurve.getPointAt(0),
  );
  const pulseHalo = addMesh(
    assembly,
    new THREE.SphereGeometry(0.062, 12, 8),
    material("#d7bd8a", 0.3, 0.2, {
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    }),
    signalCurve.getPointAt(0),
  );

  scene.add(new THREE.HemisphereLight(0xf7faf8, 0x748078, 1.75));
  const keyLight = new THREE.DirectionalLight(0xfffcf4, 2.35);
  keyLight.position.set(-4.5, 7, 7);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xe5eeea, 1.3);
  fillLight.position.set(6, 3, -5);
  scene.add(fillLight);
  const softLight = new THREE.PointLight(0xf1f5f0, 1.7, 13, 2);
  softLight.position.set(-1, 5, 1);
  scene.add(softLight);

  const canvas = renderer.domElement;
  canvas.className = "signal-cpu-canvas";
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
  host.classList.add("has-webgl");

  let progress = 0;
  let reducedMotion = false;
  let active = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let contextLost = false;
  const tick = (now: number) => {
    frame = 0;
    if (!active || reducedMotion || disposed || contextLost) return;
    elapsed += previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    update(progress, reducedMotion);
    frame = requestAnimationFrame(tick);
  };
  const setActive = (value: boolean) => {
    active = value;
    if (!active || reducedMotion || contextLost) {
      cancelAnimationFrame(frame);
      frame = previous = 0;
    } else if (!frame && !disposed) {
      frame = requestAnimationFrame(tick);
    }
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    const aspect = width / height;
    const viewHeight = aspect < 1.2 ? 4.85 : 4.5;
    camera.left = (-viewHeight * aspect) / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setSize(width, height, false);
    update(progress, reducedMotion);
  };
  const resizeObserver =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
  resizeObserver?.observe(host);
  if (!resizeObserver)
    window.addEventListener("resize", resize, { passive: true });

  const update = (amount: number, reduced: boolean) => {
    if (disposed) return;
    reducedMotion = reduced;
    progress = clamp(amount);
    const p = reduced ? 1 : progress;
    const orbit = ease(p);
    assembly.rotation.set(
      0.035 +
        (1 - orbit) * 0.055 +
        (reduced ? 0 : Math.sin(elapsed * 0.4) * 0.065),
      -0.11 +
        (1 - orbit) * 0.13 +
        (reduced ? 0 : Math.sin(elapsed * 0.3) * 0.38),
      (1 - orbit) * -0.022,
    );
    camera.position.set(
      mix(7.1, 2.8, orbit),
      mix(5.6, 7.8, orbit),
      mix(8.2, 10.5, orbit),
    );
    camera.lookAt(0, 0.21, 0);
    camera.updateMatrixWorld();
    const pulsePoint = signalCurve.getPointAt(
      reduced ? 1 : (ease(p) * 0.85 + elapsed * 0.18) % 1,
    );
    pulse.position.copy(pulsePoint);
    pulseHalo.position.copy(pulsePoint);
    pulse.visible = true;
    pulseHalo.visible = true;
    renderer.render(scene, camera);
  };
  resize();
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    setActive(active);
    host.classList.remove("has-webgl");
  };
  const onContextRestored = () => {
    if (disposed) return;
    contextLost = false;
    host.classList.add("has-webgl");
    update(progress, reducedMotion);
    setActive(active);
  };
  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  return {
    update,
    setActive,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((surface) => surface.dispose());
      scene.environment = null;
      environment.dispose();
      renderer.dispose();
      canvas.remove();
      host.classList.remove("has-webgl");
    },
  };
}
