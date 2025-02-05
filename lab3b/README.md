### Setup

I've used C# for this assignment. In order to do that you need:

1. Install .NET runtime: [link](https://wiki.archlinux.org/title/.NET)
2. Check that everyting works by running `dotnet --list-sdks`. Mine output is:

```sh
ef@fedora:~$ dotnet --list-sdks
8.0.111 [/usr/lib64/dotnet/sdk]
```

3. Then `cd` into `/src/RayTracer.App/`
4. You can check that everything works by using `dotnet run -- -h` command. It will build a project, and output a
    pseudo-man page:

```sh
ef@fedora:~/Documents/uv-cgi/lab3b/src/RayTracer.App$ dotnet run -- -h
Flags description.

-h: print this flag description.
-s: absolute path to the rendered scene.
-o: absolute path to directory for the output (with / at the end).
-d: will print parsed scene to standard output.
-dof: will apply depth of field effect and simulate real camera lens for rendering. Usage: -dof aperture,focalDistance,samplesPerPixel.

Example usage:
./RayTracer.App -s "/home/ef/Documents/univie/uv-cgi/lab3b/src/Scenes/example4.xml" -o "/home/ef/Documents/univie/uv-cgi/lab3b/src/Output" -dof 0.3,5.0,5
```

5. Now, there are multiple ways to test the program:
    - You can use `dotnet run -- ` and provide arguments there
    - Alternatively, it is possible to compile project ahead-of-time. 
        To do that use `dotnet publish -r linux-x64 -c Release`. It will produce one warning, which is fine.
        The binary will be somewhere in `/bin/Release/net8.0/.../native/RayTracer.App`
6. If AOT compiled, binary could be used as a standalone binary like `./RayTracer.App`.
    - Obviously, it is possible to copy it under a better name like `cp RayTracer.App ~/Documents/rt`

### Claim

- [x] T1: Fully implemented. 
    - Remark: When I rendered scene 4, the lightning behind the sphere was a bit off. It seems to illuminate the upper
        part of the sphere instead of the lower. I have no clue, why this happens.
- [x] EF5: Fully implemented. 
    - Remark: To activate depth of field effect you need to pass `-dof` flag, followed by `apertureSize,focalDistance,samplesPerPixel`.
        For instance: `-dof 0.3,10.0,5`. To witness the effect, I have created a scene `example-dof.xml` which is a
        slightly modified version of the `example4.xml`.

### Tested environment

- Fedora Linux 41
- .NET 8.0.111

