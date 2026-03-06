import Experience from "../Experience";
import * as THREE from 'three';

export default class World
{
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        
        // 在这里创建和添加你的3D对象到场景中，例如：
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        console.log('World类已创建，并且一个绿色的立方体已添加到场景中');
    }
}