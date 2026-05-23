import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GalaxySceneProps {
  scrollProgress: number;
}

export const GalaxyScene: React.FC<GalaxySceneProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 检查 WebGL 支持
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch (e) {
      setIsSupported(false);
      return;
    }

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000000
    );
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 10000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Stars background
    const createStars = (count: number, size: number, color: number = 0xffffff) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      for (let i = 0; i < count * 3; i += 3) {
        const radius = Math.random() * 50000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        const c = new THREE.Color(color);
        colors[i] = c.r + (Math.random() - 0.5) * 0.3;
        colors[i + 1] = c.g + (Math.random() - 0.5) * 0.3;
        colors[i + 2] = c.b + (Math.random() - 0.5) * 0.3;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9
      });
      
      return new THREE.Points(geometry, material);
    };
    
    const stars = createStars(15000, 2);
    scene.add(stars);
    
    // Earth
    const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2244aa,
      emissive: 0x112244,
      shininess: 100
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Solar system
    const solarSystem = new THREE.Group();
    
    // Sun
    const sunGeometry = new THREE.SphereGeometry(30, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystem.add(sun);
    
    // Planets
    const planetData = [
      { size: 3, distance: 80, color: 0xaaaaaa },
      { size: 4, distance: 120, color: 0xffcc99 },
      { size: 6, distance: 170, color: 0x3366cc },
      { size: 4, distance: 230, color: 0xff4422 },
      { size: 25, distance: 350, color: 0xcc8833 },
      { size: 20, distance: 480, color: 0xffcc88 },
      { size: 18, distance: 600, color: 0x88ccff },
      { size: 17, distance: 720, color: 0x4466ff }
    ];
    
    planetData.forEach(p => {
      const geometry = new THREE.SphereGeometry(p.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: p.color,
        shininess: 50
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = p.distance;
      solarSystem.add(planet);
    });
    
    // Asteroids
    const asteroids = new THREE.Group();
    for (let i = 0; i < 300; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 2 + 0.5, 0);
      const material = new THREE.MeshPhongMaterial({
        color: 0x888888
      });
      const asteroid = new THREE.Mesh(geometry, material);
      const angle = Math.random() * Math.PI * 2;
      const radius = 280 + Math.random() * 40;
      asteroid.position.x = Math.cos(angle) * radius;
      asteroid.position.z = Math.sin(angle) * radius;
      asteroid.position.y = (Math.random() - 0.5) * 25;
      asteroids.add(asteroid);
    }
    solarSystem.add(asteroids);
    
    scene.add(solarSystem);
    
    // Black hole
    const blackHole = new THREE.Group();
    
    // Accretion disk
    const diskGeometry = new THREE.TorusGeometry(60, 15, 32, 100);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: 0x9933ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    blackHole.add(disk);
    
    // Inner disk (hotter)
    const innerDiskGeometry = new THREE.TorusGeometry(35, 8, 32, 100);
    const innerDiskMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const innerDisk = new THREE.Mesh(innerDiskGeometry, innerDiskMaterial);
    blackHole.add(innerDisk);
    
    // Center
    const centerGeometry = new THREE.SphereGeometry(25, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    blackHole.add(center);
    
    scene.add(blackHole);
    
    // Helper functions
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const lerp = (a: number, b: number, t: number): number => {
      return a + (b - a) * t;
    };
    
    const lerpVec = (a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 => {
      return new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
    };
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      const t = easeInOutCubic(scrollProgress);
      
      // Rotate things
      earth.rotation.y += 0.01;
      stars.rotation.y += 0.0001;
      asteroids.rotation.y += 0.002;
      disk.rotation.z += 0.03;
      innerDisk.rotation.z += 0.045;
      
      // Solar system planets
      solarSystem.children.forEach((child, i) => {
        if (i > 0 && child instanceof THREE.Mesh) {
          child.rotation.y += 0.015;
        }
      });
      
      // Camera path
      let camPos: THREE.Vector3;
      let camLook: THREE.Vector3;
      let fov: number;
      
      if (t < 0.15) {
        // Earth
        const localT = t / 0.15;
        camPos = lerpVec(
          new THREE.Vector3(0, 5, 35),
          new THREE.Vector3(0, 80, 400),
          localT
        );
        camLook = new THREE.Vector3(0, 0, 0);
        fov = lerp(60, 75, localT);
        earth.visible = true;
        solarSystem.visible = true;
        blackHole.visible = false;
      } else if (t < 0.35) {
        // Solar system
        const localT = (t - 0.15) / 0.2;
        camPos = lerpVec(
          new THREE.Vector3(0, 80, 400),
          new THREE.Vector3(0, 4000, 18000),
          localT
        );
        camLook = new THREE.Vector3(0, 0, 0);
        fov = lerp(75, 85, localT);
        earth.visible = localT < 0.5;
        solarSystem.visible = true;
        blackHole.visible = false;
      } else if (t < 0.55) {
        // Milky way
        const localT = (t - 0.35) / 0.2;
        camPos = lerpVec(
          new THREE.Vector3(0, 4000, 18000),
          new THREE.Vector3(45000, 18000, 75000),
          localT
        );
        camLook = new THREE.Vector3(0, 0, 0);
        fov = lerp(85, 90, localT);
        earth.visible = false;
        solarSystem.visible = localT < 0.3;
        blackHole.visible = localT > 0.5;
      } else if (t < 0.75) {
        // Approach Andromeda
        const localT = (t - 0.55) / 0.2;
        camPos = lerpVec(
          new THREE.Vector3(45000, 18000, 75000),
          new THREE.Vector3(400, 150, 600),
          localT
        );
        camLook = new THREE.Vector3(0, 0, 0);
        fov = lerp(90, 60, localT);
        earth.visible = false;
        solarSystem.visible = false;
        blackHole.visible = true;
      } else {
        // At black hole
        const localT = (t - 0.75) / 0.25;
        camPos = lerpVec(
          new THREE.Vector3(400, 150, 600),
          new THREE.Vector3(150, 80, 250),
          localT
        );
        camLook = new THREE.Vector3(0, 0, 0);
        fov = lerp(60, 50, localT);
        earth.visible = false;
        solarSystem.visible = false;
        blackHole.visible = true;
      }
      
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scrollProgress]);
  
  if (!isSupported) {
    // Fallback if WebGL not supported
    return (
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(250)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }
  
  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};
