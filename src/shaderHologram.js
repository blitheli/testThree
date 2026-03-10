import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import holoVertexShader from './shaders/hologram/vertex.glsl?raw';
import holoFragmentShader from './shaders/hologram/fragment.glsl?raw';
import { TextureLoader } from 'three';
import GUI from 'lil-gui';

const canvas = document.getElementById('three');
const gui = new GUI();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//  渲染器
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(window.devicePixelRatio);
// 场景
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// 相机(默认视线是朝向-z轴的，所以我们把相机往后移一点)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 1;
// 相机控制器
const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;


//  自定义着色器
//=============================================================================

const materialParameters = {};
materialParameters.color = '#70c1ff';
gui.addColor(materialParameters, 'color').name('Holo Color')
    .onChange((value) => {
    material.uniforms.uColor.value.set(value);
});
const material = new THREE.ShaderMaterial({
    vertexShader: holoVertexShader,
    fragmentShader: holoFragmentShader,
    transparent: true,           
    side: THREE.DoubleSide,       // 双面渲染 
    depthWrite: false,           // 禁止写入深度缓冲区
    blending: THREE.AdditiveBlending, // 使用加法混合模式
    uniforms: {
        uTime: { value: 0.0 },   // 定义一个时间变量
        uColor: { value: new THREE.Color(materialParameters.color) } // 定义一个颜色变量
    }
}
);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.0, 128, 128),
    material
);
sphere.position.x = -1.5;

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
);
torusKnot.position.x = 1.5;
scene.add(sphere, torusKnot);
//=============================================================================

const timer = new THREE.Timer();
// 渲染循环
function animate(time) {
    timer.update(time);
    const elapsedTime = timer.getElapsed();
    //console.log(elapsedTime);

    //  更新时间变量
    material.uniforms.uTime.value = elapsedTime;

    controls.update();

    renderer.render(scene, camera);

    sphere.rotation.y = elapsedTime / 5.0;
    torusKnot.rotation.y = elapsedTime / 5.0;
    //cube.rotation.y = time / 1000;
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});