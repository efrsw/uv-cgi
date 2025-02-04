using RayTracer.App.IO.Models;
using RayTracer.Lib.Math;

namespace RayTracer.App.IO;

public static class ObjectParser
{
	public static ObjectModel? ParsePath(string modelPath)
	{
		if (!File.Exists(modelPath)) return null;

		using var sr = new StreamReader(modelPath);
		var faces = new List<FaceModel>();
		var vertecies = new List<Point3>();
		var normals = new List<Vec3>();

		while (sr.ReadLine() is { } line)
		{
			var comps = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);

			switch (comps[0])
			{
				case "v":
					if (double.TryParse(comps[1], out var vx)
					    && double.TryParse(comps[2], out var vy)
					    && double.TryParse(comps[3], out var vz))
					{
						vertecies.Add(new Point3(vx, vy, vz));
					}

					break;
				case "vn":
					if (double.TryParse(comps[1], out var nx)
					    && double.TryParse(comps[2], out var ny)
					    && double.TryParse(comps[3], out var nz))
					{
						normals.Add(new Vec3(nx, ny, nz));
					}

					break;
				case "f":
					var vert1Info = comps[1].Split("/", StringSplitOptions.TrimEntries);
					var vert2Info = comps[2].Split("/", StringSplitOptions.TrimEntries);
					var vert3Info = comps[3].Split("/", StringSplitOptions.TrimEntries);

					if (int.TryParse(vert1Info[0], out var idxX)
					    && int.TryParse(vert2Info[0], out var idxY)
					    && int.TryParse(vert3Info[0], out var idxZ)
					    && int.TryParse(vert1Info[2], out var idxN))
					{
						faces.Add(new FaceModel(normals[idxN - 1],
							vertecies[idxX - 1],
							vertecies[idxY - 1],
							vertecies[idxZ - 1]));
					}
					break;
				default:
					continue;
			}
		}

		return new ObjectModel(faces);
	}
}