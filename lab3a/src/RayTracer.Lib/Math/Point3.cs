namespace RayTracer.Lib.Math;

public record struct Point3(double X, double Y, double Z)
{
	public static Point3 operator +(Point3 p, Vec3 v) => new(p.X + v.X, p.Y + v.Y, p.Z + v.Z);
	public static Point3 operator -(Point3 p, Vec3 v) => new(p.X - v.X, p.Y - v.Y, p.Z - v.Z);
	public static Vec3 operator -(Point3 p, Point3 v) => new(p.X - v.X, p.Y - v.Y, p.Z - v.Z);
}