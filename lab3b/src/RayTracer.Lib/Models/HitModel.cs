using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public record struct Hit(Vec3 HitNormalUnit, Point3 P, double T, Material Material);

public abstract record HitModel
{
	public record Empty : HitModel;

	public record Hit(Vec3 HitNormalUnit, Point3 P, double T, Material Material) : HitModel;
};