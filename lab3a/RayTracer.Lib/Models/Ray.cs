using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Ray
{
	private Point3 _start;
	private Vec3 _direction;

	public Ray(Point3 start, Vec3 direction)
	{
		_start = start;
		_direction = direction;
	}

	public Point3 Start => _start;
	public Vec3 Direction => _direction;

	public Point3 At(double t)
	{
		return _start + _direction * t;
	}
}