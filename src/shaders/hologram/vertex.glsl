precision mediump float;

varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标
varying vec3 vPosition; // 从顶点着色器传递过来的顶点位置
varying vec3 vNormal; // 从顶点着色器传递过来的法线向量
uniform float uTime; // 从JavaScript传递过来的时间变量

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

    vUv = uv; // 将纹理坐标传递给片段着色器
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // glitch效果：根据时间和位置生成随机扰动
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.5) + sin(glitchTime * 8.5); // 叠加多个正弦波来增加扰动的复杂度
    glitchStrength /=3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength); // 使用smoothstep函数创建一个平滑的过渡效果
    glitchStrength = 0.25*glitchStrength;
    modelPosition.x += (random(modelPosition.xz + uTime)-0.5) * glitchStrength; // 在x轴上添加随机扰动
    modelPosition.z += (random(modelPosition.zx + uTime)-0.5) * glitchStrength; // 在y轴上添加随机扰动
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // 将法线向量从模型空间转换到世界空间(不考虑缩放)
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vPosition = modelPosition.xyz; // 将顶点位置传递给片段着色器
    vNormal = modelNormal.xyz; // 将法线向量传递给片段着色器
}