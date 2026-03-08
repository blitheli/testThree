varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform sampler2D uDayTexture; // 纹理变量
uniform sampler2D uNightTexture; // 纹理变量
uniform sampler2D uSpecularTexture; // 纹理变量
uniform sampler2D uCloudsTexture; // 纹理变量
uniform vec3 uSunDirection; // 太阳方向
uniform vec3 uAtmosphereDayColor; // 白天颜色
uniform vec3 uAtmosphereTwilightColor; // 晨昏线颜色

void main() {

    // 计算视线方向
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0); // Use UV coordinates for color

    // sun 方向
    //vec3 uSunDirection = vec3(0.0, 0.0, 1.0); // 假设太阳光线来自某个方向
    float sunOrientation = dot(uSunDirection, normal); // 计算法线与太阳光线的夹角

    //  根据太阳光线的方向计算日夜混合因子
    //sunOrientation ≤ -0.25（背面深处）→ 0（全夜晚）
    //sunOrientation ≥ 0.5（正面亮区）→ 1（全白天）
    //-0.25 到 0.5 之间 → 平滑过渡（晨昏线区域）, 数值:  0-1
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);

    //  白天黑夜颜色混合
    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    //  根据太阳光线的方向混合日夜颜色
    //  dayMix = 0 时，color = nightColor（全夜晚）
    //  dayMix = 1 时，color = dayColor（全白天）
    //  dayMix 在 0-1 之间时，color 在 nightColor 和 dayColor 之间平滑过渡
    color = mix(nightColor, dayColor, dayMix); // 根据太阳光线的方向混合日夜颜色
    
    //  云层密度
    //  云层纹理rgb都是一样的，所以取r通道的值来表示云层的亮度    
    float cloudMix = texture2D(uCloudsTexture, vUv).r;
    cloudMix = smoothstep(0.25, 1.0, cloudMix); // 调整云层密度的阈值, 使云层效果更明显
    // 根据云层密度混合云层颜色
    color = mix(color, vec3(1.0), cloudMix* dayMix); // 只有在白天云层才明显，夜晚云层不明显

    //  菲涅尔反射
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0); // 调整菲涅尔反射的强度
    //color = vec3(fresnel);

    // 大气颜色
    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation); // 根据太阳光线的方向计算大气颜色混合因子
    // 根据太阳光线的方向混合大气颜色
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereMix); 
    color = mix(color, atmosphereColor, fresnel*atmosphereMix); // 根据菲涅尔反射和太阳光线的方向混合大气颜色

    //  镜面反射
    //  从镜面反射纹理中获取镜面反射强度
    float specularWight = texture2D(uSpecularTexture, vUv).r;
    vec3 reflectedLight = reflect(-uSunDirection, normal); // 计算反射光线
    //float specular = pow(max(dot(reflectedLight, viewDirection), 0.0), 16.0); // 计算镜面反射强度
    float specular = -dot(reflectedLight, viewDirection);
    specular = pow(max(specular, 0.0), 32.0); // 计算镜面反射强度

    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel); // 根据菲涅尔反射混合镜面反射颜色
    color += specularColor * specular * specularWight; // 根据镜面反射强度和纹理权重添加镜面反射颜色

    gl_FragColor = vec4(color, 1.0);
    

    // #include <tonemapping_fragment>
    // #include <encodings_fragment>
}