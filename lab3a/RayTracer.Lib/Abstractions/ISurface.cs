using RayTracer.Lib.Models;

namespace RayTracer.Lib.Abstractions;

public interface ISurface
{
	public bool IsHit(Ray r, HitModel intersectionPoint);
}