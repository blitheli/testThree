precision mediump float;
varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

    // float strength = vUv.y;

    // float strength = mod(vUv.y*10.0, 1.0);

    // float strength = step(0.2, mod(vUv.y*10.0, 1.0)); // 产生阶梯状的条纹效果
    // strength += step(0.2, mod(vUv.x*10.0, 1.0)); // 叠加更多的阶梯条纹
    // strength = 1.0-strength; // 反转颜色，使条纹为黑色，背景为白色

    //float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) ;

    //float strength = floor(vUv.y * 10.0) / 10.0; // 将纹理坐标y分成10段，产生阶梯状的条纹效果
    
    //float strength = 0.02 / distance(vUv, vec2(0.5, 0.5)); // 计算纹理坐标与中心点的距离，产生径向渐变效果
    
    float strength = sin(cnoise(vUv * 10.0) * 20.0); // 产生随机噪声效果
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}