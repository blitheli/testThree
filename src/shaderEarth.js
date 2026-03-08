import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import earthVertexShader from './shaders/earth/vertex.glsl?raw';
import earthFragmentShader from './shaders/earth/fragment.glsl?raw';
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl?raw'; 
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl?raw';      
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
renderer.setClearColor('#000011');

console.log(renderer.capabilities.getMaxAnisotropy()); // 输出最大各向异性过滤级别
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

//  纹理加载器
const textureLoader = new TextureLoader();
const earthDayTexture = textureLoader.load('/textures/earth/8k_earth_daymap.jpg');
earthDayTexture.colorSpace = THREE.SRGBColorSpace; // 设置颜色空间为sRGB
earthDayTexture.anisotropy = 8; // 设置各向异性过滤级别
const earthNightTexture = textureLoader.load('/textures/earth/8k_earth_nightmap.jpg');
earthNightTexture.colorSpace = THREE.SRGBColorSpace; // 设置颜色空间为sRGB
earthNightTexture.anisotropy = 8; // 设置各向异性过滤级别
const earthSpecularTexture = textureLoader.load('/textures/earth/8k_earth_specular_map.jpg');
const earth_cloudsTexture = textureLoader.load('/textures/earth/8k_earth_clouds.jpg');

//  地球大气参数
const earthParameters = {}
earthParameters.atmosphereDayColor = '#00aaff';
earthParameters.atmosphereTwilightColor = '#ff6600';

gui.addColor(earthParameters, 'atmosphereDayColor').name('Atmosphere Day Color')
    .onChange((value) => {
    earthMaterial.uniforms.uAtmosphereDayColor.value.set(value);
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(value);
});
gui.addColor(earthParameters, 'atmosphereTwilightColor').name('Atmosphere Twilight Color')
    .onChange((value) => {
    earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(value);
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(value);
});

//  自定义着色器,地球
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader, 
    //transparent: true,    
    //  uniforms是传递给着色器的变量，可以在着色器中使用这些变量来控制渲染效果
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10.0, 5.0) }, // 波浪频率
        uTime: { value: 0.0 }, // 时间变量
        uDayTexture: {value: earthDayTexture}, // 纹理变量
        uNightTexture: {value: earthNightTexture}, // 纹理变量
        uSpecularTexture: {value: earthSpecularTexture}, // 纹理变量
        uCloudsTexture: {value: earth_cloudsTexture}, // 纹理变量
        uSunDirection: {value: new THREE.Vector3(0.0, 1.0, 0.0)}, // 太阳方向
        uAtmosphereDayColor: {value: new THREE.Color(earthParameters.atmosphereDayColor)}, // 大气颜色
        uAtmosphereTwilightColor: {value: new THREE.Color(earthParameters.atmosphereTwilightColor)}, // 大气颜色
    }}
    );
const mesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(mesh);

//  球体，模拟地球大气层
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    side: THREE.BackSide, // 只渲染背面
    transparent: true, // 启用透明度,
    //  uniforms是传递给着色器的变量，可以在着色器中使用这些变量来控制渲染效果
    uniforms: {
        uSunDirection: {value: new THREE.Vector3(0.0, 1.0, 0.0)}, // 太阳方向
        uAtmosphereDayColor: {value: new THREE.Color(earthParameters.atmosphereDayColor)}, // 大气颜色
        uAtmosphereTwilightColor: {value: new THREE.Color(earthParameters.atmosphereTwilightColor)}, // 大气颜色
    }}
);
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.02, 1.02, 1.02); // 稍微放大一点，包裹住地球
scene.add(atmosphere);

//  太阳
const sunSpherical = new THREE.Spherical(1, Math.PI*0.5, 0.0); // 半径、极角、方位角
const sunDirection = new THREE.Vector3();

//  调试用的太阳位置可视化
const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial({ color: 'yellow' })
);
scene.add(debugSun);

const updateSun = () => {
    sunDirection.setFromSpherical(sunSpherical);

    debugSun.position.copy(sunDirection).multiplyScalar(5); // 将太阳位置放大到场景中

    //  更新着色器中的太阳方向
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
}
updateSun();

gui.add(sunSpherical, 'phi').min(0).max(Math.PI).step(0.01).name('Sun Phi').onChange(updateSun);
gui.add(sunSpherical, 'theta').min(0).max(2 * Math.PI).step(0.01).name('Sun Theta').onChange(updateSun);

gui.add(earthMaterial.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.1).name('X Frequency');
gui.add(earthMaterial.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.1).name('Y Frequency');



const timer = new THREE.Timer();
// 渲染循环
function animate(time) {        
    timer.update(time);
    const elapsedTime = timer.getElapsed();
    //console.log(elapsedTime);

    //  更新时间变量
    earthMaterial.uniforms.uTime.value = elapsedTime;

    controls.update();
    renderer.render(scene, camera);
    mesh.rotation.y = time * 0.00003;
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});