import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('/textures/stone/StoneBricksSplitface001_COL_2K.jpg');
const alphaTexture = textureLoader.load('/textures/stone/StoneBricksSplitface001_OPA_2K.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/stone/StoneBricksSplitface001_AO_2K.jpg');
const heightTexture = textureLoader.load('/textures/stone/StoneBricksSplitface001_DISP_2K.jpg');
const normalTexture = textureLoader.load('/textures/stone/StoneBricksSplitface001_NRM_2K.jpg');
const roughnessTexture = textureLoader.load('/textures/stone/StoneBricksSplitface001_RGH_2K.jpg');


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
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

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

//  材质(标准材质需要光照，否则物体会是黑的)
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.1;
material.roughness = 1;
material.side = THREE.DoubleSide;
material.map = colorTexture;
material.normalMap = normalTexture;
//material.alphaMap = alphaTexture;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 1;
//material.d.displacementMap = heightTexture;

//material.roughnessMap = roughnessTexture;
//material.transparent = true;

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 16, 32),
    material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);


const timer = new THREE.Timer();

// 渲染循环
function animate(time) {        
    timer.update(time);
    const elapsedTime = timer.getElapsed();
    //console.log(elapsedTime);

    sphere.rotation.y = elapsedTime * 0.1;
    plane.rotation.y = elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.1;

    sphere.rotation.x = elapsedTime * 0.15;
    plane.rotation.x = elapsedTime * 0.15;
    torus.rotation.x = elapsedTime * 0.15;

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