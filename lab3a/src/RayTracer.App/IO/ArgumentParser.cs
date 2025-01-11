namespace RayTracer.App.IO;

public static class ArgumentParser
{
	private const string ArgumentPrefix = "-";

	public static Dictionary<string, string> ParseArguments(string[] args)
	{
		Dictionary<string, string> res = [];

		for (int i = 0; i < args.Length; i++)
		{
			if (!args[i].StartsWith(ArgumentPrefix)) continue;

			if (args[i] != "-h" && args[i] != "-d") res.TryAdd(args[i], args[i + 1]);
			else res.TryAdd(args[i], string.Empty);
		}

		return res;
	}
}