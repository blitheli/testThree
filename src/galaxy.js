import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

const canvas = document.getElementById('three');

const sizes = { 
    width: window.innerWidth,
    height: window.innerHeight
};

//  渲染器
const renderer = new THREE.WebGLRenderer({ canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(2);
// 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);

// 标准材质需要光照，否则物体会是黑的
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(2, 3, 4);
scene.add(directionalLight);

// 相机(默认视线是朝向-z轴的，所以我们把相机往后移一点)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 1;
// 相机控制器
const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

//=============================================================================

const paramters = {};
paramters.count = 5000;
paramters.size = 0.02;
paramters.radius = 5;
paramters.branches = 3;
paramters.insideColor = '#ff6030';
paramters.outsideColor = '#1b3984';

const geometry = new THREE.BufferGeometry();


const positions = new Float32Array(paramters.count * 3);
const colors = new Float32Array(paramters.count * 3);
const scales = new Float32Array(paramters.count);

const insideColor = new THREE.Color(paramters.insideColor);
const outsideColor = new THREE.Color(paramters.outsideColor);
for (let i = 0; i < paramters.count; i++) {
    const i3 = i * 3;

    // 生成半径和角度
    const radius = Math.random() * paramters.radius;
    const branchAngle = (i % paramters.branches) / paramters.branches * Math.PI * 2;
    
    const randomX = Math.pow(Math.random(), 3) * 0.5;
    const randomY = Math.pow(Math.random(), 3) * 0.5;
    const randomZ = Math.pow(Math.random(), 3) * 0.5;
    positions[i3]     = Math.cos(branchAngle) * radius + randomX;     // x
    positions[i3 + 1] = randomY;  // y
    positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;     // z

    //  颜色渐变
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / paramters.radius);
    colors[i3]     = mixedColor.r; // r
    colors[i3 + 1] = mixedColor.g; // g
    colors[i3 + 2] = mixedColor.b; // b

    // 粒子大小
    scales[i] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

const material = new THREE.PointsMaterial({
    depthWrite: false,
    size: paramters.size,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});
const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

//=============================================================================
const timer = new THREE.Timer();
// 渲染循环
function animate(time) {        
    timer.update(time);
    const elapsedTime = timer.getElapsed();
    //console.log(elapsedTime);
    controls.update();
    renderer.render(scene, camera);

    // 模型旋转
    galaxy.rotation.y = elapsedTime * 0.02;
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});