import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GalaxySceneProps {
  scrollProgress: number;
}

export const GalaxyScene: React.FC<GalaxySceneProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number>();
  const starsRef = useRef<THREE.Points | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const planetsRef = useRef<THREE.Group | null>(null);
  const asteroidsRef = useRef<THREE.Group | null>(null);
  const blackHoleRef = useRef<THREE.Group | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const lerp = (start: number, end: number, t: number): number => {
    return start + (end - start) * t;
  };

  const lerpVector3 = (start: THREE.Vector3, end: THREE.Vector3, t: number): THREE.Vector3 => {
    return new THREE.Vector3(
      lerp(start.x, end.x, t),
      lerp(start.y, end.y, t),
      lerp(start.z, end.z, t)
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // 检测 WebGL 支持
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000000
      );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 10000);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = Math.random() * 50000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
      } else if (colorChoice < 0.85) {
        colors[i] = 0.7;
        colors[i + 1] = 0.8;
        colors[i + 2] = 1;
      } else {
        colors[i] = 1;
        colors[i + 1] = 0.7;
        colors[i + 2] = 0.9;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      shininess: 100
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    earthRef.current = earth;

    const planets = new THREE.Group();
    
    const sunGeometry = new THREE.SphereGeometry(50, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    planets.add(sun);

    const planetColors = [0x888888, 0xffcc99, 0x2244ff, 0xff4422, 0xcc6600, 0xffcc88, 0x88ccff, 0x4466ff];
    const planetSizes = [3, 5, 6, 4, 25, 20, 18, 17];
    const planetDistances = [100, 150, 200, 280, 400, 550, 700, 850];

    for (let i = 0; i < 8; i++) {
      const pGeometry = new THREE.SphereGeometry(planetSizes[i], 32, 32);
      const pMaterial = new THREE.MeshPhongMaterial({
        color: planetColors[i],
        shininess: 50
      });
      const planet = new THREE.Mesh(pGeometry, pMaterial);
      planet.position.x = planetDistances[i];
      planets.add(planet);
    }

    scene.add(planets);
    planetsRef.current = planets;

    const asteroids = new THREE.Group();
    for (let i = 0; i < 500; i++) {
      const aGeometry = new THREE.IcosahedronGeometry(Math.random() * 2 + 0.5, 0);
      const aMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666
      });
      const asteroid = new THREE.Mesh(aGeometry, aMaterial);
      const angle = Math.random() * Math.PI * 2;
      const radius = 320 + Math.random() * 50;
      asteroid.position.x = Math.cos(angle) * radius;
      asteroid.position.z = Math.sin(angle) * radius;
      asteroid.position.y = (Math.random() - 0.5) * 30;
      asteroids.add(asteroid);
    }
    scene.add(asteroids);
    asteroidsRef.current = asteroids;

    const blackHole = new THREE.Group();
    const bhGeometry = new THREE.TorusGeometry(80, 20, 32, 100);
    const bhMaterial = new THREE.MeshBasicMaterial({
      color: 0x8800ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const accretionDisk = new THREE.Mesh(bhGeometry, bhMaterial);
    blackHole.add(accretionDisk);

    const bhCoreGeometry = new THREE.SphereGeometry(30, 32, 32);
    const bhCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    const bhCore = new THREE.Mesh(bhCoreGeometry, bhCoreMaterial);
    blackHole.add(bhCore);

    blackHole.position.set(0, 0, 0);
    blackHole.visible = false;
    scene.add(blackHole);
    blackHoleRef.current = blackHole;

    let time = 0;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      const t = easeInOutCubic(scrollProgress);

      if (earthRef.current) {
        earthRef.current.rotation.y += 0.01;
      }

      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001;
      }

      if (planetsRef.current) {
        planetsRef.current.children.forEach((child, index) => {
          if (index === 0) return;
          child.rotation.y += 0.02;
        });
      }

      if (asteroidsRef.current) {
        asteroidsRef.current.rotation.y += 0.002;
      }

      if (blackHoleRef.current) {
        blackHoleRef.current.children[0].rotation.z += 0.02;
      }

      let cameraPos: THREE.Vector3;
      let cameraLookAt: THREE.Vector3;
      let cameraFov: number;

      if (t < 0.2) {
        const localT = t / 0.2;
        cameraPos = lerpVector3(
          new THREE.Vector3(0, 5, 30),
          new THREE.Vector3(0, 100, 500),
          localT
        );
        cameraLookAt = new THREE.Vector3(0, 0, 0);
        cameraFov = lerp(60, 75, localT);
      } else if (t < 0.4) {
        const localT = (t - 0.2) / 0.2;
        cameraPos = lerpVector3(
          new THREE.Vector3(0, 100, 500),
          new THREE.Vector3(0, 5000, 20000),
          localT
        );
        cameraLookAt = new THREE.Vector3(0, 0, 0);
        cameraFov = lerp(75, 85, localT);
      } else if (t < 0.6) {
        const localT = (t - 0.4) / 0.2;
        cameraPos = lerpVector3(
          new THREE.Vector3(0, 5000, 20000),
          new THREE.Vector3(50000, 20000, 80000),
          localT
        );
        cameraLookAt = new THREE.Vector3(0, 0, 0);
        cameraFov = lerp(85, 90, localT);
      } else if (t < 0.8) {
        const localT = (t - 0.6) / 0.2;
        cameraPos = lerpVector3(
          new THREE.Vector3(50000, 20000, 80000),
          new THREE.Vector3(500, 200, 800),
          localT
        );
        cameraLookAt = new THREE.Vector3(0, 0, 0);
        cameraFov = lerp(90, 60, localT);
      } else {
        const localT = (t - 0.8) / 0.2;
        cameraPos = lerpVector3(
          new THREE.Vector3(500, 200, 800),
          new THREE.Vector3(200, 100, 300),
          localT
        );
        cameraLookAt = new THREE.Vector3(0, 0, 0);
        cameraFov = lerp(60, 50, localT);
      }

      if (cameraRef.current) {
        cameraRef.current.position.copy(cameraPos);
        cameraRef.current.lookAt(cameraLookAt);
        cameraRef.current.fov = cameraFov;
        cameraRef.current.updateProjectionMatrix();
      }

      if (blackHoleRef.current) {
        blackHoleRef.current.visible = t > 0.7;
      }

      if (planetsRef.current) {
        planetsRef.current.visible = t < 0.45;
      }

      if (earthRef.current) {
        earthRef.current.visible = t < 0.35;
      }

      if (asteroidsRef.current) {
        asteroidsRef.current.visible = t < 0.45;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

      animate();

      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        if (rendererRef.current) {
          rendererRef.current.dispose();
          if (containerRef.current && rendererRef.current.domElement) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing GalaxyScene:', error);
      setHasWebGL(false);
    }
  }, [scrollProgress]);

  if (!hasWebGL) {
    return (
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
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
