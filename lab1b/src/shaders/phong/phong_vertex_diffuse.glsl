attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_light;
uniform mat3 u_normal;

varying vec4 v_view;
varying vec4 v_color;
varying vec4 v_light;
varying vec3 v_normal;

void main() {
    vec3 lightSource = vec3(0.0, 10.0, 0.0); // Initial light position

    vec4 viewPosition = u_view * u_model * vec4(a_position, 1.0);
    vec4 lightPosition = u_view * u_light * vec4(lightSource, 1.0);

    v_color = vec4(a_color, 1.0);
    v_light = lightPosition;
    v_normal = normalize(u_normal * a_normal);
    v_view = viewPosition;

    gl_Position = u_projection * viewPosition;
}
