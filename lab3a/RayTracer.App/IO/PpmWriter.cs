using RayTracer.Lib.Math;

namespace RayTracer.App.IO;

public class PpmWriter
{
	private readonly string _rootDir;

	public PpmWriter(string rootDir)
	{
		_rootDir = rootDir;
	}

	public async Task WrtieViewport(Col3[,] viewport, string fileName)
	{
		(int w, int h) = (viewport.GetLength(0), viewport.GetLength(1));
		var path = Path.Combine(Path.Combine(_rootDir, fileName));

		Console.WriteLine("Started writing to file");

		await using var sw = new StreamWriter(path,
			new FileStreamOptions { Mode = FileMode.Create, Access = FileAccess.Write });

		await sw.WriteLineAsync("P3");
		await sw.WriteLineAsync($"{w} {h}");
		await sw.WriteLineAsync("255");

		for (var j = 0; j < h; j++)
		{
			for (var i = 0; i < w; i++)
			{
				var c = viewport[i, j];
				await sw.WriteLineAsync(
					$"{Convert.ToInt32(c.R * 255)} {Convert.ToInt32(c.G * 255)} {Convert.ToInt32(c.B * 255)}");
			}
		}

		Console.WriteLine($"Finished writing. Output file: {path}");
	}
}