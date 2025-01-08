using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Material
{
	private double _reflectance;
	private double _transmittance;
	private double _refraction;
	private double _ka;
	private double _kd;
	private double _ks;
	private double _exp;

	public Material(double reflectance, double transmittance, double refraction, 
			double ka, double kd, double ks, double exp)
	{
		_reflectance = reflectance;
		_transmittance = transmittance;
		_refraction = refraction;
		_ka = ka;
		_kd = kd;
		_ks = ks;
		_exp = exp;	
	}

	public Col3? Color { get; set; }
	public string? Texture { get; set; }
}