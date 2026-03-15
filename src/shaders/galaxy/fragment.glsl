precision mediump float;
varying vec3 vColor; // 从顶点着色器传递过来的颜色

void main() {

    float strength = distance(gl_PointCoord, vec2(0.5)) * 2.0; // 计算点坐标与中心的距离
    strength = 1.0 - strength; 

    vec3 color = mix(vec3(0.0), vColor, strength); // 根据距离混合颜色，使点在中心更亮，在边缘更暗

    gl_FragColor = vec4(color, 1.0);
}