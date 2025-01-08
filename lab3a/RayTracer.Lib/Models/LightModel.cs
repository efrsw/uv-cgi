using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public abstract record LightModel(Col3 Color)
{
	public record Ambient(Col3 Color) : LightModel(Color);

	public record Parallel(Col3 Color, Vec3 Direction) : LightModel(Color);

	public record Point(Col3 Color, Point3 Position) : LightModel(Color);
}