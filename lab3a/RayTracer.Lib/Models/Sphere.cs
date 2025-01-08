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

	public HitModel IsHit(Ray r)
	{
		var oc = _position - r.Start;
		var a = r.Direction.Dot(r.Direction);
		var b = -2.0 * r.Direction.Dot(oc);
		var c = oc.Dot(oc) - _radius * _radius;
		var d = b * b - 4 * a * c;

		if (d < 0) return new HitModel(false);

		var t = (-b - System.Math.Sqrt(d)) / (2.0 * a);
		var point = r.At(t);
		var normal = (point - _position).ToUnit();
		return new HitModel(true) { IntersectionPoint = point, UnitNormal = normal };
	}
}