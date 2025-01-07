using RayTracer.Lib;

class Program
{
  public static int Main(string[] args)
  {
    var argsDict = ArgumentParser.ParseArguments(args);

    var p = new SceneParser(argsDict.TryGetValue("--scene-path", out var path) ? path : "");
    var scene = p.ConstructScene();
    Console.WriteLine(scene.ToString());

    return 0;
  }
}