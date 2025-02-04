using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public record struct Polygon(Point3 A, Point3 B, Point3 C, Vec3 Normal);