attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

uniform mat3 u_normal;
uniform mat4 u_light;

varying vec4 v_color;

void main() {
    vec3 lightSource = vec3(0.0, 10.0, 0.0); // Initial light position

    vec4 viewPosition = u_view * u_model * vec4(a_position, 1.0);
    vec4 lightPosition = u_view * u_light * vec4(lightSource, 1.0);

    vec3 L = normalize(lightPosition.xyz - viewPosition.xyz);
    vec3 N = normalize(u_normal * a_normal);

    vec3 ambientColor = a_color * vec3(0.2, 0.2, 0.2);

    float diffuseIntensity = max(0.0, dot(L, N));
    vec3 diffuseColor = a_color * diffuseIntensity * vec3(0.5, 0.5, 0.5);

    v_color = vec4(diffuseColor + ambientColor, 1.0);

    gl_Position = u_projection * viewPosition;
}
