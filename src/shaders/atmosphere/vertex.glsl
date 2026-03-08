varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    // Position,世界坐标
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // normal,世界坐标
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // Varyings,传递给片段着色器
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
}