import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BrandGlow: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        // Shader Source
        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Brand Colors
      const vec3 colorBlue = vec3(0.180, 0.192, 0.573); // #2e3192
      const vec3 colorTeal = vec3(0.000, 0.663, 0.616); // #00a99d
      const vec3 colorBg = vec3(0.004, 0.012, 0.106);  // #01031b

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ; m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
      }

      float viscousPlume(vec2 st, vec2 pos, float radius) {
          float dist = distance(st, pos);
          return exp(-dist * dist / (radius * radius * 0.1));
      }

      void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float aspect = u_resolution.x / u_resolution.y;
          st.x *= aspect;

          vec2 mousePos = u_mouse / u_resolution.xy;
          mousePos.x *= aspect;

          float time_slow = u_time * 0.15;
          
          float noiseDistorcion = snoise(st * 1.3 + time_slow);
          vec2 stDistorted = st + noiseDistorcion * 0.15;

          vec2 pos1 = vec2(0.3 * aspect + sin(time_slow * 0.4) * 0.2, 0.7 + cos(time_slow * 0.3) * 0.2);
          vec2 pos2 = vec2(0.8 * aspect + cos(time_slow * 0.5) * 0.2, 0.3 + sin(time_slow * 0.6) * 0.2);
          
          float influenceBlue = viscousPlume(stDistorted, pos1, 0.9);
          influenceBlue += viscousPlume(stDistorted, mousePos * 0.4 + 0.3, 0.4);

          float influenceTeal = viscousPlume(stDistorted, pos2, 0.8);
          influenceTeal += viscousPlume(stDistorted, mousePos, 0.7);

          float sum = influenceBlue + influenceTeal;
          vec3 finalColor = colorBg;

          if (sum > 0.01) {
              float tBlue = influenceBlue / sum;
              float tTeal = influenceTeal / sum;
              vec3 blendedInk = tBlue * colorBlue + tTeal * colorTeal;
              finalColor = mix(colorBg, blendedInk, smoothstep(0.1, 0.9, sum));
          }

          finalColor += (fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

        // Three.js Setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

        const setSize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            renderer.setPixelRatio(window.devicePixelRatio);
            uniforms.u_resolution.value.set(w * window.devicePixelRatio, h * window.devicePixelRatio);
        };

        const uniforms = {
            u_resolution: { value: new THREE.Vector2() },
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2(-1000, -1000) }
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true
        });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(plane);

        setSize();

        // Variáveis de Inércia do Mouse (A mágica da lentidão)
        let targetX = -1000;
        let targetY = -1000;
        let currentX = -1000;
        let currentY = -1000;

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Aplica a lentidão: currentX vai de encontro ao targetX bem devagar (0.02)
            if (currentX !== -1000) {
                currentX += (targetX - currentX) * 0.02;
                currentY += (targetY - currentY) * 0.02;
                uniforms.u_mouse.value.x = currentX;
                uniforms.u_mouse.value.y = currentY;
            }

            uniforms.u_time.value += 0.005;
            renderer.render(scene, camera);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            // Atualiza apenas o target, não a posição do shader diretamente
            targetX = (e.clientX - rect.left) * window.devicePixelRatio;
            targetY = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio;

            // Na primeira vez que o mouse entra na tela, inicializa o current no target
            // para evitar que a mancha venha arrastando lá do canto
            if (currentX === -1000) {
                currentX = targetX;
                currentY = targetY;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        const resizeObserver = new ResizeObserver(setSize);
        resizeObserver.observe(container);

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            material.dispose();
            plane.geometry.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        >
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
    );
};

export default BrandGlow;