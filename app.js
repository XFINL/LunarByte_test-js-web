const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
scene.background = new THREE.Color(0x000000);

const textureLoader = new THREE.TextureLoader();

const createStars = (count, size, distance) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * distance;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        const colorChoice = Math.random();
        if (colorChoice < 0.7) {
            colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1;
        } else if (colorChoice < 0.85) {
            colors[i3] = 1; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.7;
        } else {
            colors[i3] = 0.7; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1;
        }
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

const nearStars = createStars(5000, 0.5, 500);
const midStars = createStars(10000, 1, 2000);
const farStars = createStars(20000, 2, 10000);
scene.add(nearStars, midStars, farStars);

const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd00,
    emissive: 0xffaa00
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, -200);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
sunLight.position.copy(sun.position);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const createPlanet = (size, color, position, textureUrl = null) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    let material;
    
    if (textureUrl) {
        material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(textureUrl)
        });
    } else {
        material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.2
        });
    }
    
    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(position);
    return planet;
};

const earth = createPlanet(1, 0x3399ff, new THREE.Vector3(0, 0, 0));
scene.add(earth);

const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(2, 0.5, 0.5);
scene.add(moon);

const mercury = createPlanet(0.38, 0x8c7853, new THREE.Vector3(-10, 2, -180));
const venus = createPlanet(0.95, 0xffc649, new THREE.Vector3(15, -1, -170));
const mars = createPlanet(0.53, 0xc1440e, new THREE.Vector3(-12, -3, -220));
const jupiter = createPlanet(2.5, 0xd8ca9d, new THREE.Vector3(25, 4, -260));
const saturn = createPlanet(2.1, 0xead6b8, new THREE.Vector3(-20, -2, -300));
const uranus = createPlanet(1.3, 0xd1e7e7, new THREE.Vector3(18, 3, -340));
const neptune = createPlanet(1.2, 0x5b5ddf, new THREE.Vector3(-15, -4, -380));

scene.add(mercury, venus, mars, jupiter, saturn, uranus, neptune);

const saturnRingGeometry = new THREE.RingGeometry(2.5, 4, 64);
const saturnRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xc9b896,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
saturnRing.position.copy(saturn.position);
scene.add(saturnRing);

const createAsteroidBelt = (count, innerRadius, outerRadius, center) => {
    const group = new THREE.Group();
    
    for (let i = 0; i < count; i++) {
        const size = Math.random() * 0.3 + 0.05;
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.1, 0.1, 0.3 + Math.random() * 0.2)
        });
        const asteroid = new THREE.Mesh(geometry, material);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
        const height = (Math.random() - 0.5) * 10;
        
        asteroid.position.set(
            center.x + Math.cos(angle) * radius,
            center.y + height,
            center.z + Math.sin(angle) * radius
        );
        
        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        group.add(asteroid);
    }
    
    return group;
};

const asteroidBelt = createAsteroidBelt(500, 15, 25, new THREE.Vector3(0, 0, -240));
scene.add(asteroidBelt);

const createNebula = (position, size, color) => {
    const group = new THREE.Group();
    
    for (let i = 0; i < 200; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * size + size * 0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.05
        });
        const cloud = new THREE.Mesh(geometry, material);
        
        cloud.position.set(
            position.x + (Math.random() - 0.5) * size * 10,
            position.y + (Math.random() - 0.5) * size * 10,
            position.z + (Math.random() - 0.5) * size * 10
        );
        
        group.add(cloud);
    }
    
    return group;
};

const nebula1 = createNebula(new THREE.Vector3(50, 30, -800), 5, 0x9966ff);
const nebula2 = createNebula(new THREE.Vector3(-60, -40, -1200), 6, 0xff6699);
scene.add(nebula1, nebula2);

const createMilkyWay = () => {
    const group = new THREE.Group();
    
    for (let i = 0; i < 15000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 300 + 50;
        const height = (Math.random() - 0.5) * 30 * (1 - radius / 350);
        
        const starGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.5, 4, 4);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.1 + Math.random() * 0.05, 0.2, 0.7 + Math.random() * 0.3)
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        star.position.set(
            Math.cos(angle) * radius,
            height,
            -1500 + Math.sin(angle) * radius
        );
        
        group.add(star);
    }
    
    return group;
};

const milkyWay = createMilkyWay();
scene.add(milkyWay);

const createBlackHole = () => {
    const group = new THREE.Group();
    
    const coreGeometry = new THREE.SphereGeometry(8, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    const diskGeometry = new THREE.RingGeometry(10, 40, 64);
    const diskMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float dist = length(vUv - 0.5);
                float brightness = 1.0 - dist * 2.0;
                float r = 1.0;
                float g = 0.5 + 0.3 * sin(angle * 5.0 + time);
                float b = 0.2 + 0.1 * cos(angle * 3.0 - time);
                gl_FragColor = vec4(r, g, b, brightness * 0.8);
            }
        `,
        side: THREE.DoubleSide,
        transparent: true
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 3;
    group.add(disk);
    
    const glowGeometry = new THREE.SphereGeometry(45, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    group.position.set(0, 0, -3500);
    
    return { group, diskMaterial };
};

const { group: blackHole, diskMaterial: blackHoleDiskMaterial } = createBlackHole();
scene.add(blackHole);

const cameraKeyframes = [
    { position: new THREE.Vector3(0, 0, 5), lookAt: new THREE.Vector3(0, 0, 0) },
    { position: new THREE.Vector3(10, 5, -50), lookAt: new THREE.Vector3(0, 0, -100) },
    { position: new THREE.Vector3(30, -10, -150), lookAt: new THREE.Vector3(0, 0, -200) },
    { position: new THREE.Vector3(50, 20, -500), lookAt: new THREE.Vector3(0, 0, -800) },
    { position: new THREE.Vector3(100, -50, -1500), lookAt: new THREE.Vector3(0, 0, -2000) },
    { position: new THREE.Vector3(50, 30, -3400), lookAt: new THREE.Vector3(0, 0, -3500) },
    { position: new THREE.Vector3(30, 10, -3450), lookAt: new THREE.Vector3(0, 0, -3500) }
];

const lerpVector = (a, b, t) => {
    return new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
    );
};

let scrollProgress = 0;
let targetScrollProgress = 0;

const updateCamera = (progress) => {
    const totalSegments = cameraKeyframes.length - 1;
    const scaledProgress = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;
    
    const fromKeyframe = cameraKeyframes[segmentIndex];
    const toKeyframe = cameraKeyframes[Math.min(segmentIndex + 1, cameraKeyframes.length - 1)];
    
    camera.position.copy(lerpVector(fromKeyframe.position, toKeyframe.position, segmentProgress));
    const lookAtTarget = lerpVector(fromKeyframe.lookAt, toKeyframe.lookAt, segmentProgress);
    camera.lookAt(lookAtTarget);
};

const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = window.scrollY / scrollHeight;
};

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let time = 0;
const animate = () => {
    requestAnimationFrame(animate);
    time += 0.01;
    
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;
    updateCamera(scrollProgress);
    
    earth.rotation.y += 0.01;
    moon.position.x = 2 * Math.cos(time * 0.5);
    moon.position.z = 2 * Math.sin(time * 0.5);
    moon.position.y = 0.5 * Math.sin(time * 0.3);
    
    sun.material.emissiveIntensity = 1 + 0.1 * Math.sin(time * 2);
    
    asteroidBelt.rotation.y += 0.001;
    
    blackHole.rotation.y += 0.005;
    blackHoleDiskMaterial.uniforms.time.value = time;
    
    nearStars.rotation.y += 0.0001;
    midStars.rotation.y += 0.00005;
    farStars.rotation.y += 0.00002;
    
    renderer.render(scene, camera);
};

document.body.style.height = (cameraKeyframes.length * 100) + 'vh';
handleScroll();
animate();
