import Sizes from "./Utils/Sizes";
import * as THREE from 'three';
import Camera from "./Camera";
import Renderer from "./Renderer";

//  体验类，负责管理整个应用的状态和行为
//  通过单例模式确保全局只有一个Experience实例
let instance = null;
export default class Experience 
{
    constructor(canvas) {
        //  如果已经存在Experience实例，则直接返回该实例，确保全局只有一个Experience实例
        if(instance) {
            return instance;
        }
        instance = this;

        //  将canvas保存为实例属性，以便在其他方法中使用
        this.canvas = canvas;

        this.scene = new THREE.Scene();        
        
        this.time = new THREE.Timer();

        //  创建Sizes实例
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.renderer = new Renderer();


        this.sizes.on('resize', () => {
            console.log('窗口大小发生了变化，重新调整渲染器和相机的尺寸...');

            this.resize();
        });

    }   

    resize() {
        
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        //this.time.update();
        this.camera.update();
    }   
}