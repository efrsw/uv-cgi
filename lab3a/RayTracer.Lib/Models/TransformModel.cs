using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public abstract record TransformModel
{
	public record Translate(Vec3 V) : TransformModel;

	public record Scale(Vec3 V) : TransformModel;

	public record RotateX(double Theta) : TransformModel;

	public record RotateY(double Theta) : TransformModel;

	public record RotateZ(double Theta) : TransformModel;
}