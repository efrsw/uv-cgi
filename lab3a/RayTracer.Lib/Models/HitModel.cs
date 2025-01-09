using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class HitModel
{
	public Point3 IntersectionPoint { get; set; }
	public Vec3 UnitNormal { get; set; }
	public Material IntersectionMaterial { get; set; }
	public double IntersectionT { get; set; }
};