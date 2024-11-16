attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_lightViewSpacePosition;
uniform mat3 u_normal;

varying vec4 v_color;

void main() {
    vec4 viewPosition = u_view * u_model * vec4(a_position, 1.0);
    vec3 correctedNormal = u_normal * a_normal;
    vec3 lightPosition = vec3(0.0, 10.0, 0.0);

    vec3 color = vec3(39.0, 23.0, 111.0) / vec3(255.0, 255.0, 255.0);
    vec3 L = normalize(lightPosition - viewPosition.xyz);
    vec3 N = normalize(correctedNormal);

    vec3 ambientColor = color * vec3(0.2, 0.2, 0.2);
    float diffuseIntensity = max(0.0, dot(L, N));
    vec3 diffuseColor = color * diffuseIntensity * vec3(0.5, 0.5, 0.5);

    v_color = vec4(ambientColor + diffuseColor, 1.0);

    gl_Position = u_projection * viewPosition;
}
