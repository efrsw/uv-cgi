namespace RayTracer.Lib.Math;

public static class Vec3Extensions
{
	public static Vec3 ToUnit(this Vec3 v) => v / v.Length();

	public static Vec3 Reflect(this Vec3 l, Vec3 normal) => 2 * normal.Dot(l) * normal - l;

	public static Vec3 Cross(this Vec3 v, Vec3 u) => new(
		v.Y * u.Z - v.Z * u.Y,
		v.X * u.Z - v.Z * u.X,
		v.X * u.Y - v.Y * u.X);

	public static double Dot(this Vec3 v, Vec3 u) => v.X * u.X + v.Y * u.Y + v.Z * u.Z;
}