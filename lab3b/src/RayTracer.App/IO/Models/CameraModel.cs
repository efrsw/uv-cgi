using RayTracer.Lib.Math;

namespace RayTracer.App.IO.Models;

public record CameraModel(
	Point3 Position,
	Point3 LookAt,
	Vec3 Up,
	int HorizontalFov,
	(int h, int w) Resolution,
	int MaxBounces);