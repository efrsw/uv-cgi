using RayTracer.Lib.Models;

namespace RayTracer.Lib.Abstractions;

public interface ISurface
{
	public Hit? IsHit(Ray r, double tMin, double tMax);
}