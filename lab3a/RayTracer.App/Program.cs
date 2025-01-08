using RayTracer.Lib;

namespace RayTracer.App;

static class Program
{
  public static int Main(string[] args)
  {
    var argsDict = ArgumentParser.ParseArguments(args);

    var p = new SceneParser(argsDict.GetValueOrDefault("--scene-path", ""));
    var scene = p.ConstructScene();
    Console.WriteLine(scene.ToString());

    return 0;
  }
}