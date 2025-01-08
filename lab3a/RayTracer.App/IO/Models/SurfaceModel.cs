using RayTracer.Lib.Math;

namespace RayTracer.App.IO.Models;

public abstract record SurfaceModel(MaterialModel Material, List<TransformModel> Transforms)
{
	public record Sphere(double Radius, Point3 Position, MaterialModel Material, List<TransformModel> Transforms)
		: SurfaceModel(Material, Transforms);

	public record Mesh(MaterialModel Material, List<TransformModel> Transforms) : SurfaceModel(Material, Transforms);
}