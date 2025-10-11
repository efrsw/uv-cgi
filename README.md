# UV-CGI Projects

This repository contains a series of computer graphics projects completed as part of a computer graphics course. The projects progress from basic WebGL rendering to advanced ray tracing techniques.

## Lab 1a: Basic WebGL Rendering & Transformations

**Tech Stack:** TypeScript, WebGL, Vite

[Full Documentation](lab1a/readme.md)

A foundational WebGL project implementing:
- **T1**: Custom 3D primitives (pyramid and cube) with manually defined vertices
- **T2**: Interactive camera controls using mouse movement and arrow keys, with scroll wheel for z-axis movement
- **T3**: Full transformation pipeline (translation, rotation, scaling, axis rendering)
- **T4**: OBJ file parser for loading 3D models

**Key Features:**
- Mouse and keyboard-based camera navigation
- Primitive shape generation from scratch
- Basic model loading capabilities

**Tested on:** Fedora Linux 40, Firefox 131.0.3

---

## Lab 1b: Phong Shading & Lighting

**Tech Stack:** TypeScript, WebGL, Vite

[Full Documentation](lab1b/readme.md)

Building upon Lab 1a with advanced lighting techniques:
- **T1-T2**: Gouraud shading implementation
- **T3-T4**: Phong shading with proper specular highlights
- **T5**: Interactive light source positioning and transformations

**Key Features:**
- Dual shading scheme support (Gouraud and Phong)
- Dynamic light source manipulation in global coordinate system
- Unified shader interfaces for easy switching between shading modes

**Known Issues:** Specular component duplication artifacts on spheres, light belt effect during rotation

**Tested on:** Fedora Linux 41, Firefox 132.0.1

---

## Lab 1c: Pac-Man 3D Game

**Tech Stack:** TypeScript, WebGL, Vite, Blender

[Full Documentation](lab1c/readme.md)

A 3D Pac-Man game implementation with graphical effects:

**Implemented Features:**
- ✅ **T1**: 3D labyrinth created in Blender
- ✅ **T2.1**: Animated mouth opening/closing
- ✅ **Shear View**: Camera perspective with shear transformation
- ✅ **Centered Camera**: Camera follows player

**Tested on:** Fedora Linux 41, Chrome 131.0.6778.85

---

## Lab 3a: Ray Tracer Foundation

**Tech Stack:** C# (.NET 8.0)

[Full Documentation](lab3a/README.md)

A complete ray tracer implementation from scratch in C#:
- **T1**: Basic ray tracing pipeline outputting black images
- **T2**: Primary ray generation and intersection testing
- **T3**: Phong illumination model
- **T4**: Shadow ray implementation
- **T5**: Recursive reflection rays

**Features:**
- XML-based scene description format with DTD validation
- Ahead-of-time (AOT) compilation support for standalone binary
- Command-line interface with multiple output options
- Support for multiple primitive shapes and materials

**Usage:**
```bash
dotnet run -- -s "/path/to/scene.xml" -o "/output/directory/" -d
```

**Tested on:** Fedora Linux 41, .NET 8.0.111

---

## Lab 3b: Advanced Ray Tracing with Depth of Field

**Tech Stack:** C# (.NET 8.0)

[Full Documentation](lab3b/README.md)

Extension of Lab 3a with advanced camera simulation:
- **T1**: All features from Lab 3a (fully implemented)
- **EF5**: Depth of Field effect with realistic camera lens simulation

**Key Features:**
- Configurable aperture size, focal distance, and sampling rate
- Realistic lens blur effect for non-focal objects
- Command-line DOF control: `-dof aperture,focalDistance,samplesPerPixel`
- Example scene demonstrating DOF effects

**Example Usage:**
```bash
./RayTracer.App -s "scene.xml" -o "output/" -dof 0.3,10.0,5
```

**Tested on:** Fedora Linux 41, .NET 8.0.111

---

## Technologies Used

- **WebGL/TypeScript**: Labs 1a, 1b, 1c
- **C#/.NET**: Labs 3a, 3b
- **Build Tools**: Vite (WebGL projects), dotnet CLI (C# projects)
- **3D Modeling**: Blender (Lab 1c)
- **Graphics APIs**: Raw WebGL, custom ray tracing engine
