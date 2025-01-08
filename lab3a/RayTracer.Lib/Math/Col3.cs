namespace RayTracer.Lib.Math;

public record struct Col3(double R, double G, double B)
{
	public static Col3 operator *(Col3 c, double s) => new(c.R * s, c.G * s, c.B * s);
	public static Col3 operator *(double s, Col3 c) => new(c.R * s, c.G * s, c.B * s);
	public static Col3 operator +(Col3 c, Col3 v) => new(c.R + v.R, c.G + v.G, c.B + v.B);
	public static Col3 operator /(Col3 c, double s) => new(c.R / s, c.G / s, c.B / s);
}