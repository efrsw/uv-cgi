using RayTracer.App.IO;
using RayTracer.App.IO.Models;
using RayTracer.Lib.Math;
using RayTracer.Lib.Models;

namespace RayTracer.App;

internal static class Program
{
	public static async Task<int> Main(string[] args)
	{
		var argsDict = ArgumentParser.ParseArguments(args);

		if (argsDict.TryGetValue("-h", out _))
		{
			Console.WriteLine("""
			                  Flags description. 

			                  -h: print this flag description.
			                  -s: absolute path to the rendered scene.
			                  -o: absolute path to directory for the output (with / at the end).
			                  -d: will print parsed scene to standard output.
			                  -dof: will apply depth of field effect and simulate real camera lens for rendering. Usage: -dof aperture,focalDistance,samplesPerPixel.

			                  Example usage: 
			                  ./RayTracer.App -s "/home/ef/Documents/univie/uv-cgi/lab3b/src/Scenes/example4.xml" -o "/home/ef/Documents/univie/uv-cgi/lab3b/src/Output" -dof 0.3,5.0,5
			                  """);
			return 0;
		}

		var scenePath = argsDict.GetValueOrDefault("-s", "");
		var outputPath = argsDict.GetValueOrDefault("-o", "");

		var p = new SceneParser(Path.GetFullPath(scenePath));
		var w = new PpmWriter(Path.GetFullPath(outputPath));

		var scene = p.ConstructScene();
		var camera = scene.Camera?.FromModel();

		if (argsDict.ContainsKey("-d")) Console.WriteLine(scene.ToString());

		RenderOptions cameraOptions = new RenderOptions.Default();
		if (argsDict.TryGetValue("-dof", out string? value))
		{
			var options = value.Split(',', StringSplitOptions.RemoveEmptyEntries);

			var isAperture = double.TryParse(options[0], out var aperture);
			var isFocalDist = double.TryParse(options[1], out var focalDistance);
			var isSpp = int.TryParse(options[2], out var spp);

			if (isAperture && isFocalDist && isSpp)
				cameraOptions = new RenderOptions.RealCameraLens(aperture, focalDistance, spp);
		}

		var viewport = camera?.Render(
			[.. scene.Surfaces.Select(s => s.FromModel(Path.GetDirectoryName(scenePath) ?? ""))],
			[.. scene.Lights.Select(l => l.FromModel())],
			scene.BackgroundColor,
			cameraOptions) ?? new Col3[0, 0];

		await w.WriteViewport(viewport, scene.OutputFile);

		return 0;
	}
}