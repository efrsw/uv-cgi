using RayTracer.Lib.Math;

namespace RayTracer.App.IO.Models;

public record struct FaceModel(Point3 A, Point3 B, Point3 C, Vec3 Normal)
{
	public FaceModel(Vec3 normal, params Point3[] points)
		:this(points[0], points[1], points[2], normal)
	{
	}
}