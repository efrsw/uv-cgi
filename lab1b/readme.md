### How to run

To run this project use:

```shell
npm install
npm run dev
```

### Claim

- [v] T1: Fully implemented. Vertex position could be found inside the 
    `#createPyramid` and `#createCube` methods of the `Shape` class. 
- [v] T2: Fully implemented. I've added movement on mouse and arrow keys. 
    Additionally, it is possible to use scrollwheel to move alongside `z`
    axis.
    Caveats: 
        1. Mouse movement feels weird, as it supposedly moves the scene
        to a greater distance, than actual mouse traveled.
        2. Mouse movement doesn't change, based on the current scene's
        rotation (i.e. mouse input always applied as is)
- [v] T3: Fully implemented.
    - [v] a 
    - [v] b: Scaling also affects model's axis (like other transformation),
            but this particular looks suspicious.
    - [v] c
    - [v] d
- [v] T4: Fully implemented. Caveat: paths to files are hardcoded in the
        `Parser` class.

### Tested environment

- Fedora Linux 40 (dev + test)
- Firefox 131.0.3 (64-bit)

### Additional and general remarks

Unfortunately, I've noticed too late that it is not recommended to put 
world's transformations inside the view matrix.

