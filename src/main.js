import * as THREE from 'three';

const canvas = document.getElementById('three');

const sizes = { 
    width: window.innerWidth,
    height: window.innerHeight
};

//  渲染器
const renderer = new THREE.WebGLRenderer({ canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animate);

// 场景
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);
// 立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'red' });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(1, 1, 0);
scene.add(cube);

// 相机(默认视线是朝向-z轴的，所以我们把相机往后移一点)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 1;

camera.lookAt(cube.position);

// 渲染循环
function animate(time) {    
    console.log(time);
    cube.rotation.x = time * 0.001;
    cube.rotation.y = time * 0.001;
    renderer.render(scene, camera);
}
