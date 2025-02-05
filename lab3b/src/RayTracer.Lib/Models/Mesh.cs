using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Math;

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

	public Hit? IsHit(Ray r, double tMin, double tMax)
	{
		var intersection = _geometry
			.Select(p => GetIntersection(r, p, tMin, tMax))
			.Where(p => p is not null)
			.OrderBy(p => p.Value.T)
			.FirstOrDefault();

		return intersection;
	}

	private Hit? GetIntersection(Ray ray, Polygon polygon, double tMin, double tMax)
	{
		var d = polygon.Normal.Dot(ray.Direction);

		// If ray is parallel -> no hit
		if (System.Math.Abs(d) < 1e-8) return null;

		var t = (polygon.A - ray.Start).Dot(polygon.Normal) / d;

		// Check if intersection is inside bounds
		if (t < tMin || t > tMax) return null;

		// Calculate intersection point
		var p = ray.At(t);

		// Check if point is inside triangle
		var v0 = polygon.B - polygon.A;
		var v1 = polygon.C - polygon.A;
		var v2 = p - polygon.A;

		var d00 = v0.Dot(v0);
		var d01 = v0.Dot(v1);
		var d11 = v1.Dot(v1);
		var d20 = v2.Dot(v0);
		var d21 = v2.Dot(v1);

		var denom = d00 * d11 - d01 * d01;
		var v = (d11 * d20 - d01 * d21) / denom;
		var w = (d00 * d21 - d01 * d20) / denom;
		var u = 1.0 - v - w;

		if (v >= 0 && w >= 0 && u >= 0)
			return new Hit(polygon.Normal.ToUnit(), p, t, _material);

		return null;
	}
}