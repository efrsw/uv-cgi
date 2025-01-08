using RayTracer.App.IO;
using RayTracer.App.IO.Models;
using RayTracer.Lib.Math;

namespace RayTracer.App;

internal static class Program
{
	public static async Task<int> Main(string[] args)
	{
		var argsDict = ArgumentParser.ParseArguments(args);

		var p = new SceneParser(argsDict.GetValueOrDefault("--scene-path", ""));
		var w = new PpmWriter(argsDict.GetValueOrDefault("--root-dir", ""));

		var scene = p.ConstructScene();
		var camera = scene.Camera?.FromModel();
		await Task.Delay(1);
		Console.WriteLine(scene.ToString());
		var viewport = camera?.Render([.. scene.Surfaces.Select(s => s.FromModel())]) ?? new Col3[0, 0];
		await w.WrtieViewport(viewport, scene.OutputFile);

		return 0;
	}
}