using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Sphere : ISurface
{
	private double _radius;
	private Point3 _position;
	private Material _material;
	private List<Transformation> _transformations;

	public Sphere(double radius, Point3 position, Material material, List<Transformation> transformations)
	{
		_radius = radius;
		_position = position;
		_material = material;
		_transformations = transformations;
	}
}