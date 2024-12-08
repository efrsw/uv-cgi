### How to run

To run this project use:

```shell
npm install
npm run dev
```

### Claim

- [v] T1: Fully implemented.  
- [v] T2: Fully implemented. For some reason, specular component gets "duplicated" on the other side of the object 
    (better seen on the sphere models). Also, when whole scene is rotated, a light "belt" can be seen on sphere surface.
- [v] T3: Fully implemented.
- [v] T4: Fully implemented. Same problems as with T2.
- [v] T5: Fully implemented.
    - [v] a.
    - [v] b. I am not sure if I've correctly implemented light transformations. The assignment says, that we should 
        move light source in respect to global CS, hence I have applied all transformations to the light's model matrix.
        However, when I translate the whole scene (using view matrix), the light source also gets translated.

        Additionally, there is a strange behaviour with the rotation around y-axis: it doesn't produce noticable visual
        effects like its x and z axis counterparts.

### Tested environment

- Fedora Linux 41 (dev + test)
- Firefox 132.0.1 (64-bit)

### Additional and general remarks

- Initial light position is hardcoded in the shaders.
- In order to simplify selection logic, respective shaders have unified interfaces.
- I didn't come up with the way, to shade axis separately.

