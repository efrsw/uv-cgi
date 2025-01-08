namespace RayTracer.App.IO;

public static class ArgumentParser
{
	private const string ArgumentPrefix = "--";

	public static Dictionary<string, string> ParseArguments(string[] args)
	{
		Dictionary<string, string> res = [];

		for (int i = 0; i < args.Length - 1; i++)
		{
			if (args[i].StartsWith(ArgumentPrefix))
			{
				res.TryAdd(args[i], args[i + 1]);
			}
		}

		return res;
	}
}