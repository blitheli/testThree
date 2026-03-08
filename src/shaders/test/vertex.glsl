attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency; // 频率控制变量
uniform float uTime; // 时间变量(s)

attribute float aRandom; // 每个顶点的随机值

attribute vec2 uv; // 纹理坐标变量
varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标

//  片段着色器不能直接访问顶点着色器的属性，所以我们需要一个varying变量来传递随机值
varying float vRandom; 
varying float vElevation; // 用于传递高度变化值

void main() {

    vUv = uv; // 将纹理坐标传递给片段着色器
    vRandom = aRandom; // 将随机值传递给片段着色器

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //modelPosition.z += aRandom * 0.1; // 根据随机值添加高度变化
    modelPosition.z = sin(modelPosition.x * uFrequency.x + uTime) * sin(modelPosition.y * uFrequency.y + uTime) * 0.1; // 添加波浪效果

    vElevation = modelPosition.z; // 将高度变化值传递给片段着色器
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}