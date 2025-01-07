using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public record SphereModel(double Radius,
    Point3 Position,
    MaterialModel Material,
    List<TransformModel> Transforms);