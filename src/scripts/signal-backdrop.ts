/** A continuous, gently advected pigment field. No scroll interception. */
export function initBackdrop(root: HTMLElement): {
  setPaused(paused: boolean): void;
  dispose(): void;
} {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-liquid-canvas]");
  const controls = [
    ...document.querySelectorAll<HTMLButtonElement>("[data-background-mode]"),
  ];
  const modes: Record<string, number> = {
    pigment: 0,
    satin: 1,
    neutral: 2,
    selective: 3,
    fuller: 4,
    blobs: 5,
    pools: 6,
    jelly: 7,
  };
  const requested =
    new URLSearchParams(location.search).get("background") || "pigment";
  let mode = Object.hasOwn(modes, requested) ? requested : "pigment";
  let variant = modes[mode]!;
  let repaint = () => {};
  const select = (selected: string, updateUrl = false) => {
    mode = Object.hasOwn(modes, selected) ? selected : "pigment";
    variant = modes[mode]!;
    root.dataset.mode = mode;
    controls.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.backgroundMode === root.dataset.mode),
      ),
    );
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("background", root.dataset.mode);
      history.replaceState(null, "", url);
    }
    repaint();
  };
  const choose = (event: Event) =>
    select(
      (event.currentTarget as HTMLButtonElement).dataset.backgroundMode!,
      true,
    );
  controls.forEach((button) => button.addEventListener("click", choose));
  select(mode);
  const cleanupControls = () =>
    controls.forEach((button) => button.removeEventListener("click", choose));
  const inert = { setPaused() {}, dispose: cleanupControls };
  if (!canvas) return inert;
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return inert;
  const vertex = `attribute vec2 position;
    void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment = `precision highp float;
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float time;
    uniform float travel;
    uniform float variant;
    uniform vec4 regions;
    float hash(vec2 p) {
      vec3 q=fract(vec3(p.xyx)*.1031);
      q+=dot(q,q.yzx+33.33);
      return fract((q.x+q.y)*q.z);
    }
    float noise(vec2 p) {
      vec2 i=floor(p), f=fract(p);
      f=f*f*f*(f*(f*6.-15.)+10.);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }
    float field(vec2 p) {
      float n=.58*noise(p);
      p=mat2(.8,-.6,.6,.8)*p*2.03+vec2(7.1,3.4);
      n+=.28*noise(p);
      return n+.14*noise(p*2.01+8.3);
    }
    void main() {
      vec2 uv=gl_FragCoord.xy/resolution;
      if(variant>4.5) {
        // Three shape studies built without the old turbulent noise field.
        float aspect=resolution.x/resolution.y;
        float size=sqrt(min(aspect,1.));
        vec2 pos=(uv-.5)*vec2(aspect,1.)+pointer*.04;
        float t=time*.34;
        float drift=travel*.16;
        vec3 paper=vec3(.978,.982,.965);
        vec3 mint=vec3(.68,.89,.78);
        vec3 blue=vec3(.70,.86,.96);
        vec3 butter=vec3(.99,.91,.68);
        vec3 color=paper;
        if(variant<5.5) {
          // Smooth metaballs merge into solid rounded islands, with clean edges.
          float density=0.;
          vec3 pigment=vec3(0.);
          for(int i=0;i<6;i++) {
            float fi=float(i);
            float a=fi*2.399;
            vec2 center=vec2(sin(a)*.36*aspect,cos(a)*.37);
            center+=vec2(sin(t*.63+fi*1.7+drift)*.13*aspect,
              cos(t*.52+fi*1.3+drift)*.11);
            vec2 d=pos-center;
            float radius=(.26+.035*sin(t*.4+fi))*size;
            d.x*=1.+.12*sin(t*.4+fi);
            float weight=exp(-dot(d,d)/(radius*radius)*2.);
            density+=weight;
            vec3 tint=fi<2. ? mint : (fi<4. ? blue : butter);
            pigment+=tint*weight;
          }
          float inside=smoothstep(.38,.45,density);
          vec3 tint=pigment/max(density,.001);
          color=mix(paper,tint,inside*.67);
          color+=exp(-pow((density-.45)*32.,2.))*.025;
        } else if(variant<6.5) {
          // Wide connected sheets with only a few gently moving liquid boundaries.
          vec2 s=pos/max(size,.6);
          float field=.5+.24*sin(s.x*3.6+.8*sin(s.y*3.+t*.26)+t*.18+drift)
            +.21*cos(s.y*4.-.6*cos(s.x*2.-t*.2)-t*.25);
          float first=smoothstep(.26,.31,field);
          float second=smoothstep(.49,.54,field);
          float third=smoothstep(.72,.77,field);
          color=mix(paper,mix(paper,mint,.62),first);
          color=mix(color,mix(paper,blue,.60),second);
          color=mix(color,mix(paper,butter,.58),third);
          float lip=exp(-pow((field-.305)*75.,2.))
            +exp(-pow((field-.535)*75.,2.));
          color+=lip*.023;
        } else {
          // Separate translucent, softly domed forms; specular rims reveal their volume.
          for(int i=0;i<5;i++) {
            float fi=float(i);
            float a=fi*2.399+.8;
            vec2 center=vec2(sin(a)*.34*aspect,cos(a)*.35);
            center+=vec2(sin(t*.4+fi+drift)*.09*aspect,cos(t*.5+fi*1.9)*.09);
            vec2 d=pos-center;
            float angle=.3*sin(t*.3+fi);
            d=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*d;
            vec2 local=d/(vec2(.24,.19)*size*(1.+.16*sin(fi+t*.3)));
            float radius=length(local);
            float inside=1.-smoothstep(.98,1.02,radius);
            float dome=sqrt(max(0.,1.-radius*radius));
            vec3 tint=fi<2. ? blue : (fi<4. ? mint : butter);
            vec3 body=mix(paper,tint,.40+.22*dome);
            body-=pow(1.-dome,3.)*.055;
            float shine=exp(-dot(local-vec2(-.28,.38),local-vec2(-.28,.38))*19.);
            body+=shine*.14;
            body+=exp(-pow((radius-.91)*35.,2.))*.055;
            color=mix(color,body,inside*.88);
          }
        }
        gl_FragColor=vec4(color,1.);
        return;
      }
      vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*1.75;
      // A soft local eddy bends the pigment around the pointer; scroll advects it.
      vec2 relative=uv-(pointer*.5+.5);
      float influence=exp(-dot(relative,relative)*5.);
      p+=vec2(-relative.y,relative.x)*influence*.32;
      p.y+=travel*.42;
      p+=pointer*.12;
      // Autonomous flow stays legible when the visitor stops scrolling.
      // Keep pigment contrast fixed; motion comes from advection and changing eddies.
      float t=time*.39;
      p+=vec2(.12*sin(t*.85),.10*cos(t*.7));
      if(variant>.5 && variant<1.5) {
        // Long polished folds and fine directional striations, without cloud noise.
        float u=p.x*.8+p.y*.36+.24*sin(p.y*1.3+t*.42)
          +.12*sin(p.x*.9-p.y*.7+t*.3);
        float fold=sin(u*3.2+t*.22);
        float slope=cos(u*3.2+t*.22);
        vec3 paper=vec3(.953,.957,.949);
        vec3 steel=vec3(.67,.76,.75);
        vec3 warm=vec3(.86,.83,.76);
        vec3 color=mix(paper,steel,smoothstep(-.7,.9,fold)*.45);
        color=mix(color,warm,smoothstep(.15,.9,-slope)*.17);
        float edge=exp(-pow((fold-.12)*9.,2.));
        float trough=exp(-pow((fold+.12)*6.,2.));
        color+=edge*.075;
        color-=trough*.045;
        float brush=sin(u*430.+sin(p.y*3.))* .0025;
        color+=brush;
        gl_FragColor=vec4(color,1.);
        return;
      }
      vec2 q=vec2(field(p+vec2(.12*t,-.19*t)),
                  field(p+vec2(4.7+.16*t,2.3+.13*t)));
      vec2 r=vec2(field(p+1.8*q+vec2(1.7,-.22*t)),
                  field(p+1.8*q+vec2(8.3+.18*t,2.8)));
      float f=field(p+2.2*r+vec2(.04*t,-.06*t));
      float pigment=smoothstep(.37,.66,f);
      if(variant>3.5) {
        // Broad cohesive pools: less domain distortion and no fine wispy octaves.
        vec2 broad=p*.78;
        f=.5+.2*sin(broad.x*2.2+.6*sin(broad.y*1.7+t*.12)+t*.1)
          +.12*cos(broad.y*2.3+.6*sin(broad.x*1.4-t*.13)-t*.14);
        pigment=smoothstep(.43,.57,f);
      }
      vec3 paper=vec3(.953,.957,.949);
      vec3 sage=vec3(.57,.73,.64);
      vec3 mist=vec3(.63,.76,.80);
      if(variant>1.5) {
        sage=vec3(.77,.79,.77);
        mist=vec3(.82,.80,.76);
      }
      vec3 ink=mix(sage,mist,smoothstep(.3,.73,r.x));
      vec3 color=mix(paper,ink,pigment*(variant>1.5 ? .60 : .72));
      float ridge=exp(-pow((f-.51)*38.,2.));
      float shade=exp(-pow((f-.535)*24.,2.));
      color+=ridge*(variant>1.5 ? .012 : .04);
      color-=shade*(variant>1.5 ? .008 : .024);
      float veil=1.-smoothstep(.0,.8,length((uv-vec2(.38,.62))*vec2(1.,.8)));
      color=mix(color,paper,veil*.18);
      if(variant>2.5 && variant<3.5) {
        // Keep texture near the opening object and contact area; reading sections rest on paper.
        float y=1.-uv.y;
        float opening=smoothstep(regions.x-.2,regions.x+.16,y)
          *(1.-smoothstep(regions.y-.28,regions.y+.12,y));
        float contact=smoothstep(regions.z-.22,regions.z+.14,y)
          *(1.-smoothstep(regions.w-.08,regions.w+.24,y));
        float edgeBias=mix(.12,1.,smoothstep(.2,.82,uv.x));
        color=mix(paper,color,max(opening,contact*.8)*edgeBias);
      }
      gl_FragColor=vec4(color,1.);
    }`;
  const shaders: WebGLShader[] = [];
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex),
    fs = compile(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vs || !fs || !program) {
    shaders.forEach((s) => gl.deleteShader(s));
    if (program) gl.deleteProgram(program);
    return inert;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    shaders.forEach((s) => gl.deleteShader(s));
    gl.deleteProgram(program);
    return inert;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  gl.useProgram(program);
  const attribute = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const uniforms = {
    resolution: gl.getUniformLocation(program, "resolution"),
    pointer: gl.getUniformLocation(program, "pointer"),
    time: gl.getUniformLocation(program, "time"),
    travel: gl.getUniformLocation(program, "travel"),
    variant: gl.getUniformLocation(program, "variant"),
    regions: gl.getUniformLocation(program, "regions"),
  };
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false,
    disposed = false,
    lost = false,
    frame = 0,
    last = 0;
  let elapsed = 18,
    x = 0,
    y = 0,
    targetX = 0,
    targetY = 0,
    scroll = 0;
  let targetScroll = window.scrollY / Math.max(1, window.innerHeight);
  let regions = [-10, -9, -8, -7];
  const measureRegions = () => {
    const opening = document
      .querySelector(innerWidth <= 760 ? ".desk-piece" : ".intro")
      ?.getBoundingClientRect();
    const contact = document.querySelector("#contact")?.getBoundingClientRect();
    const height = Math.max(1, innerHeight);
    regions = [
      opening ? opening.top / height : -10,
      opening ? opening.bottom / height : -9,
      contact ? contact.top / height : -8,
      contact ? contact.bottom / height : -7,
    ];
  };
  const inactive = () =>
    paused || preference.matches || document.hidden || disposed || lost;
  const render = () => {
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, x, y);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.travel, scroll);
    gl.uniform1f(uniforms.variant, variant);
    gl.uniform4f(
      uniforms.regions,
      regions[0]!,
      regions[1]!,
      regions[2]!,
      regions[3]!,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  repaint = () => {
    if (!disposed && !lost) render();
  };
  const tick = (now: number) => {
    frame = 0;
    if (inactive()) return;
    if (last && now - last < 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    elapsed += delta;
    const blend = 1 - Math.exp(-delta / 0.2);
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    scroll += (targetScroll - scroll) * blend;
    render();
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    root.dataset.still = String(inactive());
    if (!inactive()) frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    measureRegions();
    // Soft pigment needs fewer pixels than typography or the project objects.
    const scale = Math.min(1, 760 / Math.max(innerWidth, innerHeight));
    canvas.width = Math.max(1, Math.round(innerWidth * scale));
    canvas.height = Math.max(1, Math.round(innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (!lost && !disposed) render();
  };
  const onScroll = () => {
    targetScroll = window.scrollY / Math.max(1, innerHeight);
    measureRegions();
    // Reduced motion still follows the document's static reading mask.
    if (preference.matches && !paused && !lost && !disposed) render();
  };
  const onPointer = (event: PointerEvent) => {
    targetX = (event.clientX / innerWidth) * 2 - 1;
    targetY = 1 - (event.clientY / innerHeight) * 2;
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    delete root.dataset.ready;
    sync();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  preference.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  resize();
  document.fonts.ready.then(() => {
    if (!disposed) {
      measureRegions();
      repaint();
    }
  });
  root.dataset.ready = "true";
  sync();
  return {
    setPaused(value) {
      paused = value;
      sync();
    },
    dispose() {
      disposed = true;
      cleanupControls();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      delete root.dataset.ready;
      root.dataset.still = "true";
    },
  };
}
