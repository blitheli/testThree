precision mediump float;
varying vec3 vPosition; // 从顶点着色器传递过来的顶点位置
uniform float uTime; // 从JavaScript传递过来的时间变量
varying vec3 vNormal; // 从顶点着色器传递过来的法线向量

void main() {


    float stripes =  mod((vPosition.y-uTime*0.1) * 20.0, 1.0);
    stripes = pow(stripes, 3.0); // 调整条纹的锐度

    //  frenesel效应：根据视角和法线的夹角调整颜色强度
    vec3 viewDirection = normalize(vPosition - cameraPosition); // 计算视线方向
    float fresnel = dot(vNormal, viewDirection) + 1.0; // 计算Fresnel效应

    gl_FragColor = vec4(1, 1, 1, fresnel); // 使用条纹强度作为颜色和透明度        
    //gl_FragColor = vec4(vNormal, fresnel); // 使用法线向量作为颜色，Fresnel效应作为透明度
}