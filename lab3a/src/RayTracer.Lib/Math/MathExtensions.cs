namespace RayTracer.Lib.Math;

public static class MathExtensions
{
	public static Point3 ToPoint(this Vec3 v) => new(v.X, v.Y, v.Z);

	public static Vec3 ToVector(this Point3 p) => new(p.X, p.Y, p.Z);

	public static Vec3 ToVector(this Col3 c) => new(c.R, c.G, c.B);

	public static Col3 ToColor(this Vec3 v) => new(v.X, v.Y, v.Z);

	public static Vec3 ToUnit(this Vec3 v) => v / v.Length();

	public static Col3 ToUnit(this Col3 c) => c / c.Length();

	public static Vec3 Reflect(this Vec3 l, Vec3 normal) => 2 * normal.Dot(l) * normal - l;

	public static Vec3 Cross(this Vec3 v, Vec3 u) => new(
		v.Y * u.Z - v.Z * u.Y,
		v.X * u.Z - v.Z * u.X,
		v.X * u.Y - v.Y * u.X);

	public static double Dot(this Vec3 v, Vec3 u) => v.X * u.X + v.Y * u.Y + v.Z * u.Z;
}