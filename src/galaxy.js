import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import galaxyVertexShader from './shaders/galaxy/vertex.glsl?raw'; 
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl?raw';   
import GUI from 'lil-gui';

const gui = new GUI();
const canvas = document.getElementById('three');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//  渲染器
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(window.devicePixelRatio);

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

const parameters = {};
parameters.count = 15000;
parameters.size = 0.06;
parameters.radius = 5;
parameters.spin = 1;
parameters.branches = 3;
parameters.randomness = 0.5;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let geometry = null;
let material = null;
let points = null;
const generateGalaxy = () => {

    //  销毁之前的几何体和材质，释放内存
    if(points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count); 

    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // 生成半径和角度
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)) * parameters.randomness;
        const randomY = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)) * parameters.randomness;
        const randomZ = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)) * parameters.randomness;
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;     // x
        positions[i3 + 1] = randomY;  // y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;     // z

        //  颜色渐变
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);
        colors[i3] = mixedColor.r; // r
        colors[i3 + 1] = mixedColor.g; // g
        colors[i3 + 2] = mixedColor.b; // b

        // 粒子大小
        scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    material = new THREE.ShaderMaterial({
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uSize: {value: 8.0 * window.devicePixelRatio}
        }
    });

    // Points对象
    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

gui.add(parameters, 'count').min(1000).max(100000).step(1000).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.1).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

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
    //galaxy.rotation.y = elapsedTime * 0.02;
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});