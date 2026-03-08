import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import testVertexShader from './shaders/test2/vertex.glsl?raw';
import testFragmentShader from './shaders/test2/fragment.glsl?raw';
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
camera.position.y = 0;
// 相机控制器
const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

//
const textureLoader = new TextureLoader();
const flagTexture = textureLoader.load('/textures/flag.png');

//  自定义着色器
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const count = geometry.attributes.position.count;

//  添加一个随机属性
const randomPos = new Float32Array(count);
for (let i = 0; i < count; i++) {
    randomPos[i] = Math.random()
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomPos, 1) );
console.log(geometry);

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader, 
    //transparent: true,    
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10.0, 5.0) }, // 波浪频率
        uTime: { value: 0.0 }, // 时间变量
        uColor: { value: new THREE.Color('orange') }, // 颜色变量
        uTexture: {value: flagTexture}, // 纹理变量
    },
    side: THREE.DoubleSide,}
    );
const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = 0.2;
scene.add(mesh);

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.1).name('X Frequency');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.1).name('Y Frequency');



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
    //cube.rotation.y = time / 1000;
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});