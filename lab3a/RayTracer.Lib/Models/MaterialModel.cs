using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public abstract record MaterialModel(PhongModel PhongModel, double Reflectance, double Transmittance, double Refraction)
{
  public record Solid(Col3 Color, PhongModel PhongModel, double Reflectance, double Transmittance, double Refraction)
    : MaterialModel(PhongModel, Reflectance, Transmittance, Refraction);

  public record Textured(string Texture, PhongModel PhongModel, double Reflectance, double Transmittance, double Refraction)
    : MaterialModel(PhongModel, Reflectance, Transmittance, Refraction);
}

public record PhongModel(double Ka, double Kd, double Ks, double Exponent);