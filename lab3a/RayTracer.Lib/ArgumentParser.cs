namespace RayTracer.Lib;

public class ArgumentParser
{
  private const string ARGUMENT_PREFIX = "--";

  public static Dictionary<string, string> ParseArguments(string[] args)
  {
    Dictionary<string, string> res = [];

    for (int i = 0; i < args.Length - 1; i++)
    {
      if (args[i].StartsWith(ARGUMENT_PREFIX))
      {
        res.TryAdd(args[i], args[i + 1]);
      }
    }

    return res;
  }
}
