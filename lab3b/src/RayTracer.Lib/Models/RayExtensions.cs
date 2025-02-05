using RayTracer.Lib.Abstractions;

namespace RayTracer.Lib.Models;

public static class RayExtensions
{
	/// <summary>
	/// Find the closest intersection point between ray and object
	/// </summary>
	public static Hit? IsIntersectedBy(this Ray r, List<ISurface> surfaces, double tMin, double tMax)
	{
		Hit? closestHit = null;

		foreach (var intersection in surfaces.Select(surface => surface.IsHit(r, tMin, tMax)))
		{
			if (intersection is null) continue;

			closestHit ??= intersection;

			// If the interseciton point is closer than previous -> remember it
			if (closestHit.Value.T > intersection.Value.T) closestHit = intersection;
		}

		return closestHit;
	}
}