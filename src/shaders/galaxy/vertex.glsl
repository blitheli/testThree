uniform float uTime;
uniform float uSize;

attribute float aScale; // 每个点的缩放因子
varying vec3 vColor; // 传递颜色到片段着色器
attribute vec3 aRandomness; // 每个点的随机偏移


void main() {

    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // 添加旋转动画
    float angle = atan(modelPosition.x, modelPosition.z); // 计算当前点的角度
    float distanceToCenter = length(modelPosition.xz); // 计算点到中心的距离
    float angleOffset = (1.0/distanceToCenter) * uTime * 0.2; // 根据距离计算角度偏移
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // 添加随机偏移
    modelPosition.xyz += aRandomness;
    



    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale; // 根据缩放因子调整点的大小
    gl_PointSize *= (1.0 / -viewPosition.z); // 根据视距调整点的大小，使其在远处看起来更小

    vColor = color; // 将顶点颜色传递给片段着色器
}