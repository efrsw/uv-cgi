namespace RayTracer.Lib.Models;

public abstract record RenderOptions
{
	public record Default : RenderOptions;
	public record RealCameraLens(double Aperture, double FocalDistance, int SamplePerPixel) : RenderOptions;
}