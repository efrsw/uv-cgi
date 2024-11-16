attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_normal; // To initialize

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_lightViewSpacePosition; // To initialize
uniform vec3 u_normal; // To initialize

varying vec4 v_color;

void main() {
    vec4 viewPosition = u_view * u_model * vec4(a_position, 1);

    vec3 L = normalize(u_lightViewSpacePosition - viewPosition.xyz);
    vec3 N = normalize(u_normal * a_normal);

    vec3 ambientColor = a_color.rgb * vec3(0.2, 0.2, 0.2);
    float diffuseIntensity = max(dot(L, N), 0.0);
    vec3 diffuseColor = a_color.rgb * diffuseIntensity * vec3(0.7, 0.7, 0.7); // diffuse coefficient

    vec3 finalColor = ambientColor + diffuseColor;
    v_color = vec4(finalColor, 1.0);

    gl_Position = u_projection * viewPosition;
}
