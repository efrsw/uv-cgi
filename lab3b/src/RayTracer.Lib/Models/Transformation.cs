using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public abstract record Transformation
{
	public record Translation(Vec3 V) : Transformation;
	public record Scale(Vec3 V) : Transformation;

	public record RotationX(double Th) : Transformation;
	public record RotationY(double Th) : Transformation;
	public record RotationZ(double Th) : Transformation;
}