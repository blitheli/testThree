precision mediump float;
varying vec3 vPosition; // 从顶点着色器传递过来的顶点位置
uniform float uTime; // 从JavaScript传递过来的时间变量
varying vec3 vNormal; // 从顶点着色器传递过来的法线向量
uniform vec3 uColor; // 从JavaScript传递过来的颜色变量

void main() {

    vec3 normal = normalize(vNormal); // 归一化法线向量
    if(!gl_FrontFacing) { // 如果是背面，反转法线
        normal *= -1.0;
    }

    float stripes =  mod((vPosition.y-uTime*0.05) * 20.0, 1.0);
    stripes = pow(stripes, 3.0); // 调整条纹的锐度

    //  frenesel效应：根据视角和法线的夹角调整颜色强度
    vec3 viewDirection = normalize(vPosition - cameraPosition); // 计算视线方向
    float fresnel = dot(normal, viewDirection) + 1.0; // 计算Fresnel效应
    fresnel = pow(fresnel, 2.0); // 调整Fresnel效应的强度

    // falloff效果：根据距离调整颜色强度，使远处更暗
    float falloff = smoothstep(0.8, 0.0, fresnel); // 使用smoothstep函数创建一个平滑的衰减效果

    // hologram效果：结合条纹和Fresnel效应来计算最终颜色
    float holographic = stripes * fresnel; // 将条纹强度和Fresnel效应结合
    holographic += fresnel * 1.25; // 增加Fresnel效应的影响，使边缘更亮
    holographic *= falloff; // 应用距离衰减效果


    gl_FragColor = vec4(uColor, holographic); // 使用条纹强度作为颜色和透明度        
    //gl_FragColor = vec4(vNormal, fresnel); // 使用法线向量作为颜色，Fresnel效应作为透明度
}