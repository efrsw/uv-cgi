attribute vec2 a_position;

uniform mat3 u_translation;

void main() {
    vec2 newPosition = (u_translation * vec3(a_position, 1.)).xy;
    gl_Position = vec4(newPosition, 1., 1.);
}
