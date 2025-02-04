using RayTracer.Lib.Models;

namespace RayTracer.Lib.Abstractions;

public interface ISurface
{
	public HitModel IsHit(Ray r, double tMin, double tMax) => new HitModel.Empty();
}