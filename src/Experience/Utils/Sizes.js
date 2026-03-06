import EventEmitter from './EventEmitter.js';

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // 监听窗口大小变化事件
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            //  触发自定义的resize事件，通知其他组件窗口大小发生了变化
            this.trigger('resize');
        });
    }
}