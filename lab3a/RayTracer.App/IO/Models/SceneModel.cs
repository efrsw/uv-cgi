using System.Text;

using RayTracer.Lib.Math;

namespace RayTracer.App.IO.Models;

public record SceneModel(Col3 BackgroundColor, string OutputFile)
{
	public CameraModel? Camera { get; init; }
	public List<LightModel> Lights { get; init; } = [];
	public List<SurfaceModel> Surfaces { get; init; } = [];

	public override string ToString()
	{
		StringBuilder sb = new();

		sb.AppendLine($"Output -- {OutputFile}");
		sb.AppendLine($"BackgroundColor -- {BackgroundColor}");
		sb.AppendLine($"""
		               Camera:
		                 Position -- {Camera?.Position}
		                 LookAt -- {Camera?.LookAt}
		                 Up -- {Camera?.Up}
		                 HorizontalFov -- {Camera?.HorizontalFov}
		                 Resolution -- h:{Camera?.Resolution.h} w:{Camera?.Resolution.w}
		                 MaxBounces -- {Camera?.MaxBounces}
		               """);

		sb.AppendLine("Lights:");
		foreach (LightModel l in Lights)
		{
			sb.AppendLine($"  {l}");
		}

		sb.AppendLine("Surfaces:");
		foreach (SurfaceModel s in Surfaces)
		{
			if (s is SurfaceModel.Sphere sm)
			{
				sb.AppendLine($"  Type -- Sphere");
				sb.AppendLine($"  Radius -- {sm.Radius}");
				sb.AppendLine($"  Position -- {sm.Position}");
			}
			else
			{
				sb.AppendLine($"  Type -- Mesh");
			}

			sb.AppendLine($"  Material -- {s.Material}");

			if (s.Transforms.Count == 0)
			{
				continue;
			}

			sb.AppendLine("  Transforms:");

			foreach (TransformModel t in s.Transforms)
			{
				sb.AppendLine($"    {t}");
			}
		}

		sb.AppendLine();

		return sb.ToString();
	}
}