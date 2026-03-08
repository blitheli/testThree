precision mediump float;
varying vec2 vUv; // 从顶点着色器传递过来的纹理坐标
varying float vRandom; // 从顶点着色器传递过来的随机值
uniform vec3 uColor; // 颜色变量
uniform sampler2D uTexture; // 纹理变量
varying float vElevation; // 从顶点着色器传递过来的高度变化值

void main() {

    // 根据纹理坐标采样颜色
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation*2.0 + 0.5; // 根据高度变化调整颜色亮度
    gl_FragColor = textureColor;
}