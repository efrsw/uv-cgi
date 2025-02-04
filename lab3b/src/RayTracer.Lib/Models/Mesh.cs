using RayTracer.Lib.Abstractions;

namespace RayTracer.Lib.Models;

public class Mesh : ISurface
{
	private Material _material;
	private List<Transformation> _transformations;
	private List<Polygon> _geometry;

	public Mesh(Material material, List<Polygon> geometry, List<Transformation> transformations)
	{
		_material = material;
		_geometry = geometry;
		_transformations = transformations;
	}
}