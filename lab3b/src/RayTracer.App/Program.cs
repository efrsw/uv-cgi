using RayTracer.App.IO;
using RayTracer.App.IO.Models;
using RayTracer.Lib.Math;

namespace RayTracer.App;

internal static class Program
{
	public static async Task<int> Main(string[] args)
	{
		var argsDict = ArgumentParser.ParseArguments(args);

		if(argsDict.TryGetValue("-h", out _))
		{
			Console.WriteLine("""
							  Flags description. 

							  -h: print this flag description.
							  -s: absolute path to the rendered scene.
							  -o: absolute path to directory for the output (with / at the end).
							  -d: will print parsed scene to standard output.

							  Example usage: 
							  ./RayTracer.App -s "/home/ef/Documents/univie/uv-cgi/lab3a/src/Scenes/example3.xml" -o "/home/ef/Documents/univie/uv-cgi/lab3a/src/Output" -d
							  """);
			return 0;
		}

		var scenePath = argsDict.GetValueOrDefault("-s", "");
		var outputPath = argsDict.GetValueOrDefault("-o", "");

		var p = new SceneParser(Path.GetFullPath(scenePath));
		var w = new PpmWriter(Path.GetFullPath(outputPath));

		var scene = p.ConstructScene();
		var camera = scene.Camera?.FromModel();

		if(argsDict.ContainsKey("-d")) Console.WriteLine(scene.ToString());

		var viewport = camera?.Render(
			[.. scene.Surfaces.Select(s => s.FromModel(Path.GetDirectoryName(scenePath) ?? ""))],
			[.. scene.Lights.Select(l => l.FromModel())],
			scene.BackgroundColor) ?? new Col3[0, 0];

		await w.WriteViewport(viewport, scene.OutputFile);

		return 0;
	}
}