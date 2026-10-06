import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Adapted from the supplied "3d-gallery-photography" (react-three-fiber) component, converted to JSX and reworked for this site:
//  - per-frame state lives in refs (no React re-render every frame); the parent owns input state and exposes `step(delta)`
//  - input comes from the wrapper (drag / arrow keys / buttons); the mouse wheel is NOT captured, so the page still scrolls
//  - rendering pauses when off-screen (`active`), pixel ratio is capped, spread adapts to the viewport aspect ratio
//  - clicking an artwork opens it in its category lightbox (`onSelect`)
const DEPTH_RANGE = 50;
const MAX_X = 8;
const MAX_Y = 8;
// Pieces are visible from far (blurred, faint) to fairly close, so several are on screen at once.
const FADE = { in: [0.05, 0.25], out: [0.62, 0.72] };
const BLUR = { in: [0.0, 0.14], out: [0.62, 0.72], max: 8.0 };

const clamp01 = (v) => Math.max(0, Math.min(1, v));

function createMaterial(texture) {
  const img = texture.image;
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: texture },
      texel: { value: new THREE.Vector2(1 / (img?.width || 512), 1 / (img?.height || 512)) },
      opacity: { value: 1 },
      blurAmount: { value: 0 },
      scrollForce: { value: 0 },
      time: { value: 0 },
      isHovered: { value: 0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float curveIntensity = scrollForce * 0.3;
        float d = length(pos.xy);
        float curve = d * d * curveIntensity;
        float ripple = (sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02 + sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015) * abs(curveIntensity) * 2.0;
        float flag = 0.0;
        if (isHovered > 0.5) {
          float damp = smoothstep(-0.5, 0.5, pos.x);
          flag = (sin(pos.x * 3.0 + time * 8.0) * 0.1 + sin(pos.x * 5.0 + time * 12.0) * 0.03) * damp;
        }
        pos.z -= (curve + ripple + flag);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform vec2 texel;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec4 acc = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              float w = 1.0 / (1.0 + length(vec2(x, y)));
              acc += texture2D(map, vUv + vec2(x, y) * texel * blurAmount) * w;
              total += w;
            }
          }
          color = acc / total;
        }
        color.rgb += vec3(abs(scrollForce) * 0.005);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
}

function Scene({ images, step, visibleCount, onSelect }) {
  const textures = useLoader(THREE.TextureLoader, images.map((i) => i.src));
  const total = images.length;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const meshes = useRef([]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 32, 32), []);
  const materials = useMemo(() => Array.from({ length: visibleCount }, (_, i) => createMaterial(textures[i % total])), [textures, visibleCount, total]);

  // Spread planes with the golden angle; narrow (portrait) viewports get a tighter spread so artworks stay on screen.
  const spread = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, i) => {
        const ha = (i * 2.618) % (Math.PI * 2);
        const va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
        const side = i % 2 === 0 ? -1 : 1; // alternate left/right so the scene is balanced
        return { x: (Math.abs(Math.sin(ha)) * side * (1 + (i % 3)) * 1.2 * MAX_X) / 4, y: (Math.cos(va) * ((i + 1) % 4) * 0.8 * MAX_Y) / 4 };
      }),
    [visibleCount],
  );

  const planes = useRef([]);
  useEffect(() => {
    planes.current = Array.from({ length: visibleCount }, (_, i) => ({ z: ((DEPTH_RANGE / visibleCount) * i) % DEPTH_RANGE, imageIndex: i % total }));
  }, [visibleCount, total]);

  useEffect(
    () => () => {
      document.body.style.cursor = '';
      materials.forEach((m) => m.dispose());
      geometry.dispose();
      textures.forEach((t) => t.dispose());
    },
    [materials, geometry, textures],
  );

  useFrame((state, delta) => {
    const velocity = step(delta); // owned and updated by the parent (drag, keys, auto-drift, damping)

    const advance = total ? visibleCount % total || total : 0;
    const xScale = Math.max(0.35, Math.min(1, aspect / 1.7));
    const base = aspect < 1 ? 3.1 : 2.5; // artwork height in world units; larger on narrow screens
    const time = state.clock.getElapsedTime();

    planes.current.forEach((plane, i) => {
      let z = plane.z + velocity * delta * 10;
      if (z >= DEPTH_RANGE) {
        const wraps = Math.floor(z / DEPTH_RANGE);
        z -= DEPTH_RANGE * wraps;
        plane.imageIndex = (plane.imageIndex + wraps * advance) % total;
      } else if (z < 0) {
        const wraps = Math.ceil(-z / DEPTH_RANGE);
        z += DEPTH_RANGE * wraps;
        plane.imageIndex = (((plane.imageIndex - wraps * advance) % total) + total) % total;
      }
      plane.z = z;

      const t = z / DEPTH_RANGE;
      let opacity = 1;
      if (t < FADE.in[0] || t > FADE.out[1]) opacity = 0;
      else if (t <= FADE.in[1]) opacity = (t - FADE.in[0]) / (FADE.in[1] - FADE.in[0]);
      else if (t >= FADE.out[0]) opacity = 1 - (t - FADE.out[0]) / (FADE.out[1] - FADE.out[0]);

      let blur = 0;
      if (t < BLUR.in[0] || t > BLUR.out[1]) blur = BLUR.max;
      else if (t <= BLUR.in[1]) blur = BLUR.max * (1 - (t - BLUR.in[0]) / (BLUR.in[1] - BLUR.in[0]));
      else if (t >= BLUR.out[0]) blur = BLUR.max * ((t - BLUR.out[0]) / (BLUR.out[1] - BLUR.out[0]));

      const mesh = meshes.current[i];
      const material = materials[i];
      const texture = textures[plane.imageIndex];
      if (!mesh || !material || !texture) return;
      if (material.uniforms.map.value !== texture) {
        material.uniforms.map.value = texture;
        material.uniforms.texel.value.set(1 / (texture.image?.width || 512), 1 / (texture.image?.height || 512));
      }
      const a = texture.image ? texture.image.width / texture.image.height : 1;
      mesh.scale.set(a > 1 ? base * a : base, a > 1 ? base : base / a, 1);
      mesh.position.set(spread[i].x * xScale, spread[i].y, z - DEPTH_RANGE / 2);
      mesh.visible = clamp01(opacity) > 0.01;
      material.uniforms.opacity.value = clamp01(opacity);
      material.uniforms.blurAmount.value = Math.max(0, Math.min(BLUR.max, blur));
      material.uniforms.scrollForce.value = velocity;
      material.uniforms.time.value = time;
    });
  });

  return materials.map((material, i) => (
    <mesh
      key={i}
      ref={(m) => {
        meshes.current[i] = m;
      }}
      geometry={geometry}
      material={material}
      onPointerOver={(e) => {
        e.stopPropagation();
        material.uniforms.isHovered.value = 1;
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        material.uniforms.isHovered.value = 0;
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        if (e.delta > 6) return; // it was a drag, not a click
        e.stopPropagation();
        const plane = planes.current[i];
        if (plane) onSelect(plane.imageIndex);
      }}
    />
  ));
}

export default function ThreeDGallery({ images, step, active, visibleCount, onSelect }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Scene images={images} step={step} visibleCount={visibleCount} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
