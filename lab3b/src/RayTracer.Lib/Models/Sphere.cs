using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Sphere : ISurface
{
	private readonly double _radius;
	private readonly Point3 _center;
	private Material _material;
	private List<Transformation> _transformations;

	public Sphere(double radius, Point3 center, Material material, List<Transformation> transformations)
	{
		_radius = radius;
		_center = center;
		_material = material;
		_transformations = transformations;
	}

	public HitModel IsHit(Ray r, double tMin, double tMax)
	{
		var oc = _center - r.Start;
		var a = r.Direction.Dot(r.Direction);
		var b = -2.0 * r.Direction.Dot(oc);
		var c = oc.Dot(oc) - _radius * _radius;
		var d = b * b - 4 * a * c;

		if (d < 0) return new HitModel.Empty();

		var tRoot = (-b - System.Math.Sqrt(d)) / (2.0 * a);
		if(tRoot <= tMin || tRoot >= tMax) 
		{
			tRoot = (-b + System.Math.Sqrt(d)) / (2.0 * a);
			if(tRoot <= tMin || tRoot >= tMax) return new HitModel.Empty();
		}

		var intPoint = r.At(tRoot);
		var normal = (intPoint - _center) / _radius;

		return new HitModel.Hit(normal, r.At(tRoot), tRoot, _material);
	}
}