varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform sampler2D uDayTexture; // 纹理变量
uniform sampler2D uNightTexture; // 纹理变量
uniform sampler2D uSpecularTexture; // 纹理变量
uniform sampler2D uCloudsTexture; // 纹理变量
uniform vec3 uSunDirection; // 太阳方向

void main() {

    // 计算视线方向
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0); // Use UV coordinates for color

    // sun 方向
    //vec3 uSunDirection = vec3(0.0, 0.0, 1.0); // 假设太阳光线来自某个方向
    float sunOrientation = dot(uSunDirection, normal); // 计算法线与太阳光线的夹角

    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    vec3 specularColor = texture2D(uSpecularTexture, vUv).rgb;
    // vec3 cloudsColor = texture2D(uCloudsTexture, vUv).rgb;

    color = mix(nightColor, dayColor, dayMix); // 根据太阳光线的方向混合日夜颜色

        //color = textureColor.rgb * sunOrientation; // 将纹理颜色赋值给最终颜色
    // 最终的颜色计算
    gl_FragColor = vec4(color, 1.0);

    // #include <tonemapping_fragment>
    // #include <encodings_fragment>
}