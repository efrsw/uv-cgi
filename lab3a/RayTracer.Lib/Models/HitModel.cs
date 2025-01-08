using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public record HitModel(bool IsHit)
{
	public Point3 IntersectionPoint { get; init; }
	public Vec3 UnitNormal { get; set; }
};