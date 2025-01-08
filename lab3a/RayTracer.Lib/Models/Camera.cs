using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Camera 
{
	private Point3 _position;
	private Point3 _lookAt;
	private Vec3 _upVector;
	private double _horizontalFov;
	private int _maxBounces;
	private int _width;
	private int _height;

	public Camera(Point3 position, Point3 lookAt, Vec3 up, double horizontalFov, int width, int height, int maxBounces)
	{
		_position = position;
		_lookAt = lookAt;
		_upVector = up;
		_horizontalFov = horizontalFov;
		_width = width;
		_height = height;
		_maxBounces = maxBounces;
	}

	public Col3[,] Render(List<ISurface> spheres)
	{
		var viewport = new Col3[_width, _height];

		Console.WriteLine("Render started");

		for(var j = 0; j < _height; j++)
		{
			Console.WriteLine($"Line {j}/{_height}");
			for(var i = 0; i < _width; i++)
			{
				viewport[i, j] = new Col3(0, 0, 0);
			}
		}

		Console.WriteLine("Render finished");
		return viewport;
	}
}