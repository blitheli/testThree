uniform float uSize;

attribute float aScale; // 每个点的缩放因子

void main() {

    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale; // 根据缩放因子调整点的大小
}