// Star Nest volumetric field by Pablo Roman Andrioli (Kali), Shadertoy XlfGRj,
// CC BY-NC-SA 3.0. Observatory hero grading, motion and integration for this site.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {


    const hero = document.querySelector('.hero');
    const canvas = hero && hero.querySelector('canvas.warp-cv');
    if (!canvas) throw new Error('Observatory warp canvas missing');
    const sizes = { w: hero.clientWidth, h: hero.clientHeight };
    const DPR = Math.min(innerWidth < 760 ? 1 : 1.5, devicePixelRatio); // R3-B: lower cap for integrated GPUs

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setSize(sizes.w, sizes.h);
    renderer.setPixelRatio(DPR);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // -----------------------------------------------------------------------
    //  PASS 1 — the warp field (refined Star Nest).
    //  Same fractal raymarch (Kali, XlfGRj) but re-parameterised for DEPTH and
    //  SPARSENESS: fewer volume steps, longer step (reaches deeper per step),
    //  tighter tile + faster distfading so crowded regions thin to a clean
    //  corridor. Mouse steers via rot1/rot2; uVel scales forward velocity.
    //  Output graded warm-core -> cool-edge over a rich near-black.
    // -----------------------------------------------------------------------
    const REST_VEL = 0.06; // R3-B: ~half of r2's 0.12 — meditative resting drift

    const warpUniforms = {
      iResolution: { value: new THREE.Vector2(sizes.w, sizes.h) },
      iTime:       { value: 0 },
      uSteer:      { value: new THREE.Vector2(0, 0) },
      uTravel:     { value: 0 },
      uVel:        { value: REST_VEL },
      uWarm:       { value: 1 }
    };

    const warpFrag = /* glsl */`
      precision highp float;
      uniform vec2  iResolution;
      uniform float iTime;
      uniform vec2  uSteer;
      uniform float uTravel;
      uniform float uVel;
      uniform float uWarm;
      varying vec2 vUv;

      // --- Star Nest constants (Kali, XlfGRj) — re-tuned for a DEEP, SPARSE corridor ---
      #define iterations 16
      #define formuparam 0.530
      #define volsteps   12        // fewer steps -> sparser, cleaner, cheaper
      #define stepsize   0.150     // longer step -> reaches deeper through the volume
      #define zoom       0.760     // slightly pulled back for more depth
      #define tile       0.620     // tighter tiling -> structure repeats, reads as corridor
      #define brightness 0.0013
      #define darkmatter 0.420     // more dark matter -> empties the busy middle
      #define distfading 0.700     // faster fade -> distant clutter recedes (depth)
      #define saturation 0.720

      void main(){
        vec2 uv = vUv - 0.5;
        uv.y *= iResolution.y / iResolution.x;
        vec3 dir = vec3(uv * zoom, 1.0);

        // steering: drive the original rotation matrices with the mouse (gentler)
        float a1 = 0.5 + uSteer.x * 1.3;
        float a2 = 0.8 + uSteer.y * 1.3;
        mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
        mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
        dir.xz *= rot1;
        dir.xy *= rot2;

        // forward drift: 'from' advances along the accumulated warp distance
        vec3 from = vec3(1.0, 0.5, 0.5);
        from += vec3(uTravel * 2.0, uTravel, uTravel * 4.0);
        from.xz *= rot1;
        from.xy *= rot2;

        // --- volumetric fractal accumulation (Kali) ---
        float s = 0.1, fade = 1.0;
        vec3 v = vec3(0.0);
        for (int r = 0; r < volsteps; r++){
          vec3 p = from + s * dir * 0.5;
          p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));
          float pa, a = pa = 0.0;
          for (int i = 0; i < iterations; i++){
            p = abs(p) / dot(p, p) - formuparam;
            a += abs(length(p) - pa);
            pa = length(p);
          }
          float dm = max(0.0, darkmatter - a * a * 0.001);
          a *= a * a;
          if (r > 3) fade *= 1.0 - dm;
          v += fade;
          v += vec3(s, s*s, s*s*s*s) * a * brightness * fade;
          fade *= distfading;
          s += stepsize;
        }
        v = mix(vec3(length(v)), v, saturation);
        vec3 col = v * 0.0060;

        // ------- PREMIUM GRADE: rich near-black -> terracotta -> warm core,
        //          melting at the cool edge to night-blue. warm->cool by uWarm. -------
        // warm road-trip palette
        vec3 warmLo  = vec3(0.010, 0.006, 0.005);      // rich near-black, warm-biased
        vec3 warmMid = vec3(0.88, 0.46, 0.27);         // terracotta #e0894c
        vec3 warmHi  = vec3(1.00, 0.85, 0.63);         // warm core #ffd9a0
        // cool arrival palette
        vec3 coolLo  = vec3(0.005, 0.009, 0.014);      // rich near-black, cool-biased
        vec3 coolMid = vec3(0.24, 0.39, 0.60);
        vec3 coolHi  = vec3(0.62, 0.78, 0.96);         // cool blue #6f9fd6 brightened

        float l = clamp((col.r + col.g + col.b) / 3.0, 0.0, 1.0);
        l = pow(l, 1.7);                                // deepen the blacks (more depth)

        vec3 warm = l < 0.5
          ? mix(warmLo, warmMid, l * 2.0)
          : mix(warmMid, warmHi, (l - 0.5) * 2.0);
        vec3 cool = l < 0.5
          ? mix(coolLo, coolMid, l * 2.0)
          : mix(coolMid, coolHi, (l - 0.5) * 2.0);
        vec3 graded = mix(cool, warm, clamp(uWarm, 0.0, 1.0));

        // radial warm-core -> cool-edge melt: warm holds the centre, cools to the rim
        float rad = clamp(length(uv) * 1.25, 0.0, 1.0);
        graded = mix(graded, mix(graded, coolMid, 0.30 * rad), smoothstep(0.30, 1.0, l));

        // keep a hint of raw fractal energy only in the brightest cores (restraint)
        graded = mix(graded, graded + col * 0.45, smoothstep(0.55, 1.0, l));

        gl_FragColor = vec4(graded, 1.0);
      }
    `;

    const warpMat = new THREE.ShaderMaterial({
      uniforms: warpUniforms,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: warpFrag,
      depthWrite: false, depthTest: false
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), warpMat));

    // -----------------------------------------------------------------------
    //  POST — EffectComposer chain
    //  1) render the warp field
    //  2) radial zoom-blur + chromatic aberration (the SPEED). R3-B: very short
    //     at rest; reach comes almost entirely from interaction.
    //  3) UnrealBloom — tighter + lower (restraint, no white-out)
    // -----------------------------------------------------------------------
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(DPR);
    composer.setSize(sizes.w, sizes.h);
    composer.addPass(new RenderPass(scene, camera));

    const StreakShader = {
      uniforms: {
        tDiffuse: { value: null },
        uCenter:  { value: new THREE.Vector2(0.5, 0.5) },
        uStrength:{ value: 0.0 },
        uChroma:  { value: 0.0 },
        uAspect:  { value: sizes.w / sizes.h }
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: /* glsl */`
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform vec2  uCenter;
        uniform float uStrength;
        uniform float uChroma;
        uniform float uAspect;
        varying vec2 vUv;

        void main(){
          vec2 dir = vUv - uCenter;
          float edge = clamp(length(dir * vec2(uAspect, 1.0)) * 1.6, 0.0, 1.0);

          const int N = 12;
          vec3 acc = vec3(0.0);
          float wsum = 0.0;
          float c = uChroma * edge;
          for (int i = 0; i < N; i++){
            float t = float(i) / float(N - 1);
            float w = 1.0 - t;
            vec2 p = vUv - dir * uStrength * t;
            float r = texture2D(tDiffuse, p + dir * c).r;
            float g = texture2D(tDiffuse, p).g;
            float b = texture2D(tDiffuse, p - dir * c).b;
            acc += vec3(r, g, b) * w;
            wsum += w;
          }
          gl_FragColor = vec4(acc / wsum, 1.0);
        }
      `,
    };
    const streakPass = new ShaderPass(StreakShader);
    composer.addPass(streakPass);

    // R3-B: tighter, lower bloom — strength 0.40, radius 0.45, higher threshold 0.28
    const bloom = new UnrealBloomPass(new THREE.Vector2(sizes.w, sizes.h), 0.40, 0.45, 0.28);
    composer.addPass(bloom);

    // -----------------------------------------------------------------------
    //  INTERACTION — mouse steers, hover/scroll boosts velocity, eases back calm
    // -----------------------------------------------------------------------
    let steerTX = 0, steerTY = 0, steerX = 0, steerY = 0;
    let velTarget = REST_VEL;
    let vel = REST_VEL;
    const speedScale = 0.07;  // LOCKED resting-drift multiplier (1.0 = R3-B base). User-chosen 2026-06-03.
    let hoverBoost = 0;
    let scrollBoost = 0;

    addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      steerTX = (e.clientX - r.left) / r.width - 0.5;
      steerTY = (e.clientY - r.top) / r.height - 0.5;
      hoverBoost = Math.max(hoverBoost, 0.26); // gentle lift
    }, { passive: true });

    addEventListener('wheel', e => {
      scrollBoost = Math.min(0.80, scrollBoost + Math.min(0.32, Math.abs(e.deltaY) * 0.0011));
    }, { passive: true });

    // -----------------------------------------------------------------------
    //  CHOREOGRAPHY — gentle jump -> very calm meditative drift
    //  R3-B: even softer launch, then a long settle into the half-speed baseline.
    // -----------------------------------------------------------------------
    const intro = { vel: 0.0, warm: 1.0, exposure: 1.0 };
    if (window.gsap) gsap.timeline()
      .to(intro, { vel: 0.52, duration: 1.7, ease: 'power2.inOut' }, 0)
      .to(intro, { vel: REST_VEL, duration: 4.2, ease: 'power2.out' }, 1.7)
      .to(intro, { warm: 0.30, duration: 4.0, ease: 'sine.inOut' }, 1.9);

    // -----------------------------------------------------------------------
    //  LOOP
    // -----------------------------------------------------------------------
    const clock = new THREE.Clock();
    let travel = 0;
    function tick(){
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;

      steerX += (steerTX - steerX) * 0.045;
      steerY += (steerTY - steerY) * 0.045;
      warpUniforms.uSteer.value.set(steerX, steerY);

      // velocity = intro baseline + hover + scroll boost, all smoothed; eases to calm
      hoverBoost  *= 0.955;
      scrollBoost *= 0.962;
      velTarget = Math.min(1.0, intro.vel + hoverBoost + scrollBoost);
      vel += (velTarget - vel) * 0.045;
      warpUniforms.uVel.value = vel;

      // forward warp distance — R3-B: half of r2 at rest (base 0.015, coeff 0.50)
      const fwd = (0.015 + vel * 0.50) * speedScale;
      travel += fwd * dt;
      warpUniforms.uTravel.value = travel;
      warpUniforms.iTime.value = t;
      warpUniforms.uWarm.value = intro.warm;

      // steerable vanishing point
      streakPass.uniforms.uCenter.value.set(0.5 + steerX * 0.5, 0.5 - steerY * 0.5);
      // R3-B: barely-there streak at rest; reach scales with velocity
      streakPass.uniforms.uStrength.value = 0.012 + vel * 0.24;
      streakPass.uniforms.uChroma.value   = 0.0008 + vel * 0.007;

      // restrained bloom that breathes with velocity
      bloom.strength = 0.18 + vel * 0.36;
      renderer.toneMappingExposure = intro.exposure;

      if (hero.getBoundingClientRect().bottom > 0) composer.render();
      requestAnimationFrame(tick);
    }
    tick();

    // -----------------------------------------------------------------------
    //  RESIZE
    // -----------------------------------------------------------------------
    addEventListener('resize', () => {
      sizes.w = hero.clientWidth; sizes.h = hero.clientHeight;
      renderer.setSize(sizes.w, sizes.h);
      composer.setSize(sizes.w, sizes.h);
      renderer.setPixelRatio(DPR);
      composer.setPixelRatio(DPR);
      warpUniforms.iResolution.value.set(sizes.w, sizes.h);
      streakPass.uniforms.uAspect.value = sizes.w / sizes.h;
      bloom.setSize(sizes.w, sizes.h);
    });

}
