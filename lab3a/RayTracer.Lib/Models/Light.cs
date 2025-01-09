using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public abstract record Light(Col3 C)
{
	public record Ambient(Col3 C) : Light(C)
	{
	}

	public record Parallel(Col3 C) : Light(C)
	{
	}

	public record Point(Col3 C) : Light(C)
	{
	}
}