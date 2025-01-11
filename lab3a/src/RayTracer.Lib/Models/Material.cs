using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Material
{
	public Material(double reflectance, double transmittance, double refraction,
			double ka, double kd, double ks, double exp)
	{
		Reflectance = reflectance;
		Transmittance = transmittance;
		Refraction = refraction;
		Ka = ka;
		Kd = kd;
		Ks = ks;
		Exp = exp;
	}

	public double Reflectance { get; set; }

	public double Transmittance { get; set; }

	public double Refraction { get; set; }

	public double Ka { get; set; }

	public double Kd { get; set; }

	public double Ks { get; set; }

	public double Exp { get; set; }

	public Col3? Color { get; set; }

	public string? Texture { get; set; }
}