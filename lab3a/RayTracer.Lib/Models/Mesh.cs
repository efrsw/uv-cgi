using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Mesh : ISurface
{
	private Material _material;
	private List<Transformation> _transformations;

	public Mesh(Material material, List<Transformation> transformations)
	{
		_material = material;
		_transformations = transformations;
	}

	public HitModel IsHit(Ray r) => new HitModel(false);
}