precision mediump float;
uniform vec3 uDepthColor; // 深水颜色
uniform vec3 uSurfaceColor; // 浅水颜色

varying float vElevation; // 从顶点着色器传递过来的顶点高度
varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

    // 计算水面颜色
    float mixStrength = (vElevation + 0.25)*3.0; // 根据顶点高度计算混合强度
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength); // 根据顶点高度混合深水和浅水颜色

    gl_FragColor = vec4(color, 1.0);
}