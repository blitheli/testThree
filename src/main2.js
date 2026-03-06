import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import Experience from './Experience/Experience.js';
const canvas = document.getElementById('three');

const experience = new Experience(canvas);

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
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper); 

// HDR 背景图
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/textures/noon_puresky_4k.hdr', (hdrTexture) => {
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = hdrTexture;
    scene.environment = hdrTexture;
});

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

const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/hubble.glb', (gltf) => {
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
});

const timer = new THREE.Timer();

// 渲染循环
function animate(time) {        
    timer.update(time);
    const elapsedTime = timer.getElapsed();
    //console.log(elapsedTime);
    controls.update();
    renderer.render(scene, camera);
    //cube.rotation.y = time / 1000;
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});