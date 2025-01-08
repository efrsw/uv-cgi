using RayTracer.Lib;
using RayTracer.Lib.Models;

namespace RayTracer.App;

internal static class Program
{
	public static int Main(string[] args)
	{
		Dictionary<string, string> argsDict = ArgumentParser.ParseArguments(args);

		SceneParser p = new(argsDict.GetValueOrDefault("--scene-path", ""));
		SceneModel scene = p.ConstructScene();
		Console.WriteLine(scene.ToString());

		return 0;
	}
}