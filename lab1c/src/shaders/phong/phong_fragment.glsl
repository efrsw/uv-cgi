precision mediump float;

varying vec4 v_view;
varying vec4 v_color;
varying vec4 v_light;
varying vec3 v_normal;

void main() {
    vec3 L = normalize(v_light.xyz - v_view.xyz);
    vec3 N = normalize(v_normal);
    vec3 E = normalize(vec3(0.0, 0.0, 0.0) - v_view.xyz);
    vec3 R = normalize(reflect(-L, N));

    vec3 ambientColor = v_color.rgb * vec3(0.1, 0.1, 0.1);

    float diffuseIntensity = max(0.0, dot(L, N));
    vec3 diffuseColor = v_color.rgb * diffuseIntensity * vec3(1.0, 1.0, 1.0);

    float specularIntensity = pow(max(0.0, dot(E, R)), 128.0);
    vec3 specularColor = v_color.rgb * specularIntensity * vec3(1.0, 1.0, 1.0);

    gl_FragColor = vec4(ambientColor + diffuseColor + specularColor, 1.0);
}
