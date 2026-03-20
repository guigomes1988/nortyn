import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FileMinus, BrainCircuit, Zap, Target } from 'lucide-react';

const BrainNetwork: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        // THREE.js Setup
        const scene = new THREE.Scene();
        // Camera positioned to look slightly downward at the brain
        const camera = new PerspectiveCameraWithResize(container, 45, 0.1, 100);
        camera.position.set(0, 0.5, 3.5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const group = new THREE.Group();
        scene.add(group);

        // Utility to generate a fuzzy glowing circle texture for particles
        const createCircleTexture = () => {
            const size = 64;
            const canvas2d = document.createElement('canvas');
            canvas2d.width = size;
            canvas2d.height = size;
            const ctx = canvas2d.getContext('2d');
            if (ctx) {
                const centerX = size / 2;
                const centerY = size / 2;
                const radius = size / 2;
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
                gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            const texture = new THREE.CanvasTexture(canvas2d);
            return texture;
        };

        // Geometry Generation
        const pointsArray: THREE.Vector3[] = [];
        const numPoints = 1200;

        // Brain Dimensions
        const sizeX = 0.9;
        const sizeY = 0.75;
        const sizeZ = 1.1;

        while (pointsArray.length < numPoints) {
            let x = (Math.random() - 0.5) * 2; // -1 to 1
            let y = (Math.random() - 0.5) * 2;
            let z = (Math.random() - 0.5) * 2;

            // Apply anatomical tapering
            // Front (z > 0) is narrower.
            let taper = z > 0 ? 1.0 - z * 0.2 : 1.0;
            let nx = x / taper;
            // Bottom (y < 0) is flatter. 
            let ny = y < 0 ? y * 1.2 : y;

            let mag = Math.sqrt(nx * nx + ny * ny + z * z);
            let isCerebrum = mag <= 1.0 && mag >= 0.4;

            // Cerebellum (bottom back bulge)
            let cx = x / 0.6;
            let cy = (y + 0.6) / 0.5;
            let cz = (z + 0.7) / 0.6;
            let isCerebellum = Math.sqrt(cx * cx + cy * cy + cz * cz) <= 1.0;

            if (!isCerebrum && !isCerebellum) continue;

            // Longitudinal Fissure (Gap between left and right hemispheres)
            if (isCerebrum && Math.abs(nx) < 0.1 && ny > -0.2 && z > -0.5) continue;
            
            // Add high-frequency noise / bumps to simulate gyri and sulci
            const noise = (Math.sin(x * 12) * Math.cos(y * 12) * Math.sin(z * 12)) * 0.04;
            
            // Scale to final brain proportions
            let px = (x + noise) * sizeX;
            let py = (y + noise) * sizeY;
            let pz = (z + noise) * sizeZ;

            pointsArray.push(new THREE.Vector3(px, py, pz));
        }

        // Particle Materials (Teal and Purple mix)
        const colors = new Float32Array(numPoints * 3);
        const sizes = new Float32Array(numPoints);
        
        const colorTeal = new THREE.Color('#00a99d');
        const colorPurple = new THREE.Color('#7c3aed');
        const colorBlue = new THREE.Color('#3b82f6');

        for (let i = 0; i < numPoints; i++) {
            const p = pointsArray[i];
            const mixRatio = (p.y + sizeY) / (sizeY * 2); // Color gradient from bottom to top
            
            let finalColor = colorTeal.clone().lerp(colorPurple, mixRatio);
            if(Math.random() > 0.8) finalColor = colorBlue; // occasional blue accent

            colors[i * 3] = finalColor.r;
            colors[i * 3 + 1] = finalColor.g;
            colors[i * 3 + 2] = finalColor.b;
            
            // Randomize particle sizes
            sizes[i] = Math.random() * 0.04 + 0.01;
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(pointsArray);
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom Shader Material for Points to use different sizes
        const particleShader = {
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                }
            `
        };

        const pointMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: createCircleTexture() }
            },
            vertexShader: particleShader.vertexShader,
            fragmentShader: particleShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        const particleSystem = new THREE.Points(geometry, pointMaterial);
        group.add(particleSystem);

        // Generate lines (synapses)
        const linePositions: number[] = [];
        const lineColors: number[] = [];
        
        const maxDist = 0.28;
        const maxConnections = 4; // limit lines per node for performance

        for (let i = 0; i < numPoints; i++) {
            let connections = 0;
            for (let j = i + 1; j < numPoints; j++) {
                if (connections >= maxConnections) break;
                
                const dist = pointsArray[i].distanceTo(pointsArray[j]);
                
                if (dist < maxDist) {
                    if (Math.random() > 0.5) { // Add density randomness
                        linePositions.push(
                            pointsArray[i].x, pointsArray[i].y, pointsArray[i].z,
                            pointsArray[j].x, pointsArray[j].y, pointsArray[j].z
                        );
                        
                        // Grab color from vertex arrays above
                        lineColors.push(
                            colors[i*3], colors[i*3+1], colors[i*3+2],
                            colors[j*3], colors[j*3+1], colors[j*3+2]
                        );
                        connections++;
                    }
                }
            }
        }

        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const linesMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
        group.add(linesMesh);

        // Animation Loop
        let clock = new THREE.Clock();
        let animationId: number;

        // Base rotation to show the 3D shape nicely
        group.rotation.x = 0.2;
        group.rotation.y = -0.5;

        // Resize handler
        const setSize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(setSize);
        resizeObserver.observe(container);
        setSize();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Gentle floating organic rotation
            group.rotation.y += 0.0015;
            group.position.y = Math.sin(time * 0.5) * 0.05;

            // Pulse opacity slightly
            linesMaterial.opacity = 0.08 + Math.sin(time * 2) * 0.04;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            pointMaterial.dispose();
            linesGeometry.dispose();
            linesMaterial.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center isolate">
            {/* 3D Canvas */}
            <div ref={containerRef} className="absolute inset-0 z-0">
                <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing outline-none" />
            </div>

            {/* Orbiting HUD Data Panels (Aesthetics) */}
            <div className="absolute top-[18%] left-[2%] animate-pulse-slow">
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-[#00a99d]/30 text-[#00a99d] text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,169,157,0.2)]">
                    <FileMinus className="w-4 h-4" />
                    <span>Menos planilhas</span>
                </div>
            </div>

            <div className="absolute bottom-[28%] left-[2%] animate-pulse-slow" style={{ animationDelay: '1s' }}>
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-[#7c3aed]/30 text-[#7c3aed] text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Melhores decisões</span>
                </div>
            </div>

            <div className="absolute top-[38%] right-[2%] animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-[#3b82f6]/30 text-[#3b82f6] text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Zap className="w-4 h-4" />
                    <span>Melhoria na execução</span>
                </div>
            </div>
            
            <div className="absolute bottom-[15%] right-[2%] animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-white/10 text-white/80 text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Target className="w-4 h-4 text-[#00a99d]" />
                    <span>Metas Claras</span>
                </div>
            </div>
        </div>
    );
};

// Helper class to encapsulate Perspective Camera configuration within the component
class PerspectiveCameraWithResize extends THREE.PerspectiveCamera {
    constructor(container: HTMLElement, fov: number, near: number, far: number) {
        super(fov, container.clientWidth / container.clientHeight, near, far);
    }
}

export default BrainNetwork;
