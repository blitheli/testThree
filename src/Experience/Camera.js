import Experience from "./Experience";
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

//  相机类，负责创建和管理相机实例
//  通过单例模式确保全局只有一个Camera实例
let instance = null;
export default class Camera
{
    constructor(){        
        // 获取Experience实例，并从中获取Sizes、Scene和Canvas等属性
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        //  创建相机实例，并将其添加到场景中
        this.setInstance();

        this.setOrbitControls();
    }

    setInstance(){
        this.instance = new THREE.PerspectiveCamera(
            75, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            1000);
        this.instance.position.set(6, 4, 8);
        //  将相机实例添加到场景中，这样我们就可以在渲染循环中使用它来渲染场景了
        this.scene.add(this.instance);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        //  在窗口大小发生变化时，更新相机的宽高比和投影矩阵，以确保渲染器能够正确地渲染场景
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        //  在渲染循环中更新相机的状态，例如更新控制器的状态等
        this.controls.update();
    }
}