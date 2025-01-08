namespace RayTracer.Lib.Math;

public record struct Vec3(double X, double Y, double Z)
{
	public static Vec3 operator *(Vec3 v, double s) => new(v.X * s, v.Y * s, v.Z * s);
	public static Vec3 operator *(double s, Vec3 v) => new(v.X * s, v.Y * s, v.Z * s);
	public static Vec3 operator +(Vec3 v, Vec3 u) => new(v.X + u.X, v.Y + u.Y, v.Z + u.Z);
	public static Vec3 operator -(Vec3 v, Vec3 u) => new(v.X - u.X, v.Y - u.Y, v.Z - u.Z);
	public static Vec3 operator -(Vec3 v) => new(-v.X, -v.Y, -v.Z);
	public static Vec3 operator /(Vec3 v, int s) => new(v.X / s, v.Y / s, v.Z / s);
	public static Vec3 operator /(Vec3 v, double s) => new(v.X / s, v.Y / s, v.Z / s);

	public double Length() => System.Math.Sqrt(X * X + Y * Y + Z * Z);
}