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

		var p = new SceneParser(argsDict.GetValueOrDefault("-s", ""));
		var w = new PpmWriter(argsDict.GetValueOrDefault("-o", ""));

		var scene = p.ConstructScene();
		var camera = scene.Camera?.FromModel();

		if(argsDict.ContainsKey("-d")) Console.WriteLine(scene.ToString());

		var viewport = camera?.Render(
			[.. scene.Surfaces.Select(s => s.FromModel())],
			[.. scene.Lights.Select(l => l.FromModel())],
			scene.BackgroundColor) ?? new Col3[0, 0];

		await w.WriteViewport(viewport, scene.OutputFile);

		return 0;
	}
}