
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uSunDirection; // 太阳方向
uniform vec3 uAtmosphereDayColor; // 白天颜色
uniform vec3 uAtmosphereTwilightColor; // 晨昏线颜色

void main() {

    // 计算视线方向
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0); // Use UV coordinates for color

    // sun 方向
    // 计算法线与太阳光线的夹角
    float sunOrientation = dot(uSunDirection, normal); 

    // 大气颜色
    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation); // 根据太阳光线的方向计算大气颜色混合因子
    // 根据太阳光线的方向混合大气颜色
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereMix); 
    color += atmosphereColor; // 根据太阳光线的方向混合大气颜色

    // 透明度
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha); // 调整边缘透明度的阈值
    
    // 
    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation); // 根据太阳光线的方向计算日夜混合因子

    float alpha = edgeAlpha * dayAlpha; // 综合边缘透明度和日夜混合因子

    gl_FragColor = vec4(color, alpha); // 设置颜色和透明度
    

    // #include <tonemapping_fragment>
    // #include <encodings_fragment>
}