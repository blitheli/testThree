varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标

void main() {

    vUv = uv; // 将纹理坐标传递给片段着色器
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}