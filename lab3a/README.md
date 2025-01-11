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
ef@fedora:~/Documents/univie/uv-cgi/lab3a/src/RayTracer.App$ dotnet run -- -h
Flags description.

-h: print this flag description.
-s: absolute path to the rendered scene.
-o: absolute path to directory for the output (with / at the end).
-d: will print parsed scene to standard output.

Example usage:
./RayTracer.App -s "/home/ef/Documents/univie/uv-cgi/lab3a/src/Scenes/example3.xml" -o "/home/ef/Documents/univie/uv-cgi/lab3a/src/Output" -d
```

5. Now, there are multiple ways to test the program:
    - You can use `dotnet run -- ` and provide arguments there
    - Alternatively, it is possible to compile project ahead-of-time. 
        To do that use `dotnet publish -r linux-x64 -c Release`. It will produce one warning, which is fine.
        The binary will be in `/bin/Release/net8.0/native/RayTracer.App`
6. If AOT compiled, binary could be used as a standalone binary like `./RayTracer.App`

### Claim

- [x] T1: Fully implemented. To output black image use the example0.xml in the `/src/Scenes` folder
- [x] T2: Fully implemented. It is possible to use example1.xml to do that.
- [x] T3: Fully implemented.
- [x] T4: Fully implemented.
- [x] T5: Fully implemented.

### Tested environment

- Fedora Linux 41
- .NET 8.0.111

### Additional and general remarks

- I wasn't able to figure out, why my images look different from the example ones (the colors and the position),
    so I have modified scenes a bit: I've moved camera a bit backward and tweaked kd of all shapes, so the specular
    blick could be seen.
- For Neovim (btw), there are multiple language servers available.
    - Omnisharp: easiest to install, however could be slow
    - Roslyn: newer LS, but you need to install the binary and additional plugin. However, it feels much better than O#.

Here is my config for the second one, if you would like to try it:

```lua
-- plugins/roslyn.lua
-- this plugin configures lspconfig for you, but you need to install ls binary manually
return {
    "seblj/roslyn.nvim",
    event = { "BufReadPre", "BufNewFile" },
    keys = {
        {
            "<leader>rr",
            function()
              vim.cmd "Roslyn restart"
            end,
            desc = "[R]estart [R]oslyn",
        },
    },
    opts = {
        filewatching = false,
        broad_search = true,
        config = {
            settings = {
                ["csharp|inlay_hints"] = {
                    csharp_enable_inlay_hints_for_implicit_object_creation = true,
                    csharp_enable_inlay_hints_for_implicit_variable_types = true,
                    csharp_enable_inlay_hints_for_lambda_parameter_types = true,
                    csharp_enable_inlay_hints_for_types = true,
                    dotnet_enable_inlay_hints_for_indexer_parameters = true,
                    dotnet_enable_inlay_hints_for_literal_parameters = true,
                    dotnet_enable_inlay_hints_for_object_creation_parameters = true,
                    dotnet_enable_inlay_hints_for_other_parameters = true,
                    dotnet_enable_inlay_hints_for_parameters = true,
                    dotnet_suppress_inlay_hints_for_parameters_that_differ_only_by_suffix = true,
                    dotnet_suppress_inlay_hints_for_parameters_that_match_argument_name = true,
                    dotnet_suppress_inlay_hints_for_parameters_that_match_method_intent = true,
                },
                ["csharp|code_lens"] = {
                    dotnet_enable_references_code_lens = true,
                },
            },
        },
    },
}
```
