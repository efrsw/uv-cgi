using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public abstract record HitModel
{
	public record Empty : HitModel;

	public record Hit(Vec3 HitNormal, double T, Material Material) : HitModel;
};