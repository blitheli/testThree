varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标
varying vec3 vPosition; // 从顶点着色器传递过来的顶点位置
varying vec3 vNormal; // 从顶点着色器传递过来的法线向量


void main() {

    vUv = uv; // 将纹理坐标传递给片段着色器
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // 将法线向量从模型空间转换到世界空间(不考虑缩放)
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vPosition = modelPosition.xyz; // 将顶点位置传递给片段着色器
    vNormal = modelNormal.xyz; // 将法线向量传递给片段着色器
}