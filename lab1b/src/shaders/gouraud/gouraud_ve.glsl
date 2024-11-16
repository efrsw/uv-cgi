attribute vec3 a_position;
attribute vec3 a_normal; 

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_lightViewSpacePosition; 
uniform mat3 u_normal; 

varying vec4 v_color;

void main() {
    vec4 viewPosition = u_view * u_model * vec4(a_position, 1);
    vec3 correctedNormals = u_normal * a_normal; // TODO: For some reason, if I use corrected values, normals zero out.

    v_color = vec4(normalize(a_normal), 1.0);

    gl_Position = u_projection * viewPosition;
}
