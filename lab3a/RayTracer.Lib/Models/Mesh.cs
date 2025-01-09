using RayTracer.Lib.Abstractions;

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

	public bool IsHit(Ray r, HitModel intersectionPoint) => false;
}