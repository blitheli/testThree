import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import waterVertexShader from './shaders/water/vertex.glsl?raw';
import waterFragmentShader from './shaders/water/fragment.glsl?raw';
import { TextureLoader } from 'three';
import GUI from 'lil-gui';
import { debug } from 'three/tsl';

const canvas = document.getElementById('three');
const gui = new GUI();
const debugObject = {};
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
camera.position.z = 2;
camera.position.y = 2;
// 相机控制器
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//
const textureLoader = new TextureLoader();
// const flagTexture = textureLoader.load('/textures/flag.png');
//=============================================================================
//  水面几何体和材质
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader, 
    //transparent: true,    
    uniforms: {
        uBigWavesElevation: { value: 0.2 }, // 大波浪的高度
        uBigWavesFrequency: { value: new THREE.Vector2(4.0, 1.5) }, // 大波浪频率
        uBigWavesSpeed: { value: 0.75 }, // 大波浪速度
        uTime: { value: 0.0 }, // 时间变量
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) }, // 深水颜色
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) }, // 浅水颜色
    },
    side: THREE.DoubleSide,}
    );
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * .5; // 将水面旋转到水平位置
scene.add(water);

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('大波浪高度');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(20).step(0.1).name('大波浪频率X');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(20).step(0.1).name('大波浪频率Y');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.01).name('大波浪速度');
gui.addColor(debugObject, 'depthColor').name('深水颜色').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, 'surfaceColor').name('浅水颜色').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
//=============================================================================
const timer = new THREE.Timer();
// 渲染循环
function animate(time) {        
    timer.update(time);
    //  距离开始的时间(单位:秒)
    const elapsedTime = timer.getElapsed();
    //console.log(elapsedTime);

    //  更新时间变量
    waterMaterial.uniforms.uTime.value = elapsedTime;

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