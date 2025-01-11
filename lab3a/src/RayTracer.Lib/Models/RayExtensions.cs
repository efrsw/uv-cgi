using RayTracer.Lib.Abstractions;

namespace RayTracer.Lib.Models;

public static class RayExtensions
{
	/// <summary>
	/// Find the closest intersection point between ray and object
	/// </summary>
	public static HitModel IsIntersectedBy(this Ray r, List<ISurface> surfaces, double tMin, double tMax)
	{
		var intersection = surfaces
			.Select(s => s.IsHit(r, tMin, tMax)) // Find all intersections in acceptable interval
			.Where(i => i is HitModel.Hit) // Filter misses out
			.Cast<HitModel.Hit>()
			.OrderBy(h => h.T) // Find the closest T
			.FirstOrDefault();

		// If there is no closest T, then we hit nothing
		return intersection is null ? new HitModel.Empty() : intersection;
	}
}