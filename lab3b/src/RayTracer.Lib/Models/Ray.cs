using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Ray
{
	public Ray(Point3 start, Vec3 direction)
	{
		Start = start;
		Direction = direction;
	}

	public Point3 Start { get; }

	public Vec3 Direction { get; }

	public Point3 At(double t) => Start + Direction * t;
}