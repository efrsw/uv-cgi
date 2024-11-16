attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_light;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal;
uniform vec3 u_lightPosition;
uniform vec3 u_eye;

varying vec4 v_color;

void main() {
    vec4 viewPosition = u_view * u_model * vec4(a_position, 1.0);

    vec3 color = vec3(255.0, 0.0, 0.0) / vec3(255.0, 255.0, 255.0);
    vec3 L = normalize(u_lightPosition - viewPosition.xyz);
    vec3 N = normalize(u_normal * a_normal);
    vec3 E = normalize(u_eye - viewPosition.xyz);
    vec3 R = normalize(reflect(-L, N));

    vec3 ambientColor = color * vec3(0.2, 0.2, 0.2);

    float diffuseIntensity = max(0.0, dot(L, N));
    vec3 diffuseColor = color * diffuseIntensity * vec3(0.5, 0.5, 0.5);

    float specularIntensity = pow(max(0.0, dot(E,R)), 32.0);
    vec3 specularColor = color * specularIntensity * vec3(0.9, 0.9, 0.9);

    v_color = vec4(specularColor, 1.0);

    gl_Position = u_projection * viewPosition;
}
