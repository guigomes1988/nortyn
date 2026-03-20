import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { FileMinus, BrainCircuit, Zap, Target } from 'lucide-react';

const BrandNetwork: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;
        const container = containerRef.current;
        const canvas = canvasRef.current;

        // THREE.js Setup
        const scene = new THREE.Scene();
        const camera = new PerspectiveCameraWithResize(container, 45, 0.1, 100);
        camera.position.set(0, 0, 3.5);
        
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const group = new THREE.Group();
        scene.add(group);

        const materialsToDispose: THREE.Material[] = [];
        const geometriesToDispose: THREE.BufferGeometry[] = [];

        // Creating the glowing texture for the traveling signal dot
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
            return new THREE.CanvasTexture(canvas2d);
        };
        const pointTexture = createCircleTexture();
        materialsToDispose.push(pointTexture as any); 

        const signals: { mesh: THREE.Points, points: THREE.Vector3[], speed: number, offset: number }[] = [];

        const loader = new SVGLoader();
        loader.load('/nsvg.svg', (data) => {
            const paths = data.paths;
            const points3DArray: THREE.Vector3[][] = [];
            const boundingBox = new THREE.Box3();

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const shapes = SVGLoader.createShapes(path);
                for (let j = 0; j < shapes.length; j++) {
                    // getSpacedPoints(400) generates equidistant points across the entire shape,
                    // guaranteeing that straight lines and curves have the same physical distance between points,
                    // which means the traversing signal will move at a perfectly constant speed everywhere.
                    const points = shapes[j].getSpacedPoints(400);
                    // Invert Y to match 3D coordinates vs SVG coordinates
                    const pts3D = points.map(p => new THREE.Vector3(p.x, -p.y, 0));
                    pts3D.forEach(p => boundingBox.expandByPoint(p));
                    points3DArray.push(pts3D);
                }
            }

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            // Calculate scale to fit in the view completely
            // At Z=3.5 with 45deg fov, the visible height is ~2.9. 
            // So scaling max dimension to 2.2 keeps it safely within bounds
            const maxDim = Math.max(size.x, size.y);
            const scale = 2.2 / (maxDim || 1);

            const baseMaterial = new THREE.LineBasicMaterial({
                color: 0x00a99d,
                transparent: true,
                opacity: 0.2,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            materialsToDispose.push(baseMaterial);

            const colors = [0x7c3aed, 0x3b82f6, 0x00a99d];

            points3DArray.forEach(pts => {
                // Center and scale points smoothly
                const centeredScaledPts = pts.map(p => p.clone().sub(center).multiplyScalar(scale));

                const geometry = new THREE.BufferGeometry().setFromPoints(centeredScaledPts);
                geometriesToDispose.push(geometry);

                const baseLine = new THREE.Line(geometry, baseMaterial);
                group.add(baseLine);

                // Add traveling signal dot
                const signalColor = colors[Math.floor(Math.random() * colors.length)];
                
                // One single point geometry for the traveling signal particle
                const particleGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0)]);
                geometriesToDispose.push(particleGeo);

                const particleMat = new THREE.PointsMaterial({
                    color: signalColor,
                    size: 0.15, // size of glowing dot
                    map: pointTexture,
                    transparent: true,
                    opacity: 1,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                materialsToDispose.push(particleMat);

                const particle = new THREE.Points(particleGeo, particleMat);
                // initial pos
                particle.position.copy(centeredScaledPts[0]);
                particle.position.z = 0.05; // Slightly forward so it overlaps the base line cleanly
                group.add(particle);

                signals.push({
                    mesh: particle,
                    points: centeredScaledPts,
                    speed: 25 + Math.random() * 15, // constant traversing speed across equidistant indices
                    offset: Math.random() * centeredScaledPts.length // random start position along the path
                });
            });
        });

        // Animation Loop
        let clock = new THREE.Clock();
        let animationId: number;

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
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Rotate logo slowly globally
            group.rotation.y = Math.sin(time * 0.3) * 0.4;
            group.rotation.x = Math.sin(time * 0.2) * 0.1;
            group.position.y = Math.sin(time * 0.5) * 0.05;

            // Animate fiber signal points smoothly along paths
            signals.forEach(sig => {
                sig.offset += sig.speed * delta;
                
                const totalPts = sig.points.length;
                if(totalPts === 0) return;

                const floatIndex = sig.offset % totalPts;
                const index = Math.floor(floatIndex);
                const nextIndex = (index + 1) % totalPts;
                
                const p1 = sig.points[index];
                const p2 = sig.points[nextIndex];
                
                // Interpolate for perfectly smooth sliding
                sig.mesh.position.copy(p1).lerp(p2, floatIndex - index);
                sig.mesh.position.z = 0.05; // Overlapping
            });

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometriesToDispose.forEach(g => g.dispose());
            materialsToDispose.forEach(m => {
                m.dispose();
                if ((m as any).map) (m as any).map.dispose(); 
            });
        };
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center isolate min-h-[400px]">
            {/* 3D Canvas */}
            <div ref={containerRef} className="absolute inset-0 z-0">
                <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing outline-none" />
            </div>

            {/* Orbiting HUD Data Panels (Aesthetics) */}
            <div className="absolute top-[8%] left-[2%] animate-pulse-slow">
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-[#00a99d]/30 text-[#00a99d] text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,169,157,0.2)]">
                    <FileMinus className="w-4 h-4" />
                    <span>Menos planilhas</span>
                </div>
            </div>

            <div className="absolute bottom-[18%] left-[2%] animate-pulse-slow" style={{ animationDelay: '1s' }}>
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-[#7c3aed]/30 text-[#7c3aed] text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Melhores decisões</span>
                </div>
            </div>

            <div className="absolute top-[28%] right-[2%] animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-[#3b82f6]/30 text-[#3b82f6] text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Zap className="w-4 h-4" />
                    <span>Melhoria na execução</span>
                </div>
            </div>
            
            <div className="absolute bottom-[20%] right-[2%] animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
                <div className="bg-[#0B091E]/60 backdrop-blur-md border border-white/10 text-white/80 text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Target className="w-4 h-4 text-[#00a99d]" />
                    <span>Metas Claras</span>
                </div>
            </div>
        </div>
    );
};

class PerspectiveCameraWithResize extends THREE.PerspectiveCamera {
    constructor(container: HTMLElement, fov: number, near: number, far: number) {
        super(fov, container.clientWidth / container.clientHeight, near, far);
    }
}

export default BrandNetwork;
