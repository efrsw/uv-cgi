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
		_horizontalFov = System.Math.PI / 180 * horizontalFov;
		_width = width;
		_height = height;
		_maxBounces = maxBounces;
	}

	public Col3[,] Render(List<ISurface> spheres, List<Light> lights, Col3 bgColor)
	{
		var viewport = new Col3[_width, _height];

		var h = System.Math.Tan(_horizontalFov / 2);
		var focalLength = (_position - _lookAt).Length();

		var viewportWidth = 2 * h * focalLength;
		var viewportHeight = Convert.ToDouble(_width) / _height * viewportWidth;

		var cameraZ = (_position - _lookAt).ToUnit();
		var cameraX = _upVector.Cross(cameraZ).ToUnit();
		var cameraY = cameraZ.Cross(cameraX).ToUnit();

		var viewportWidthVector = cameraX * viewportWidth;
		var viewportHeightVector = -cameraY * viewportHeight;

		var dw = viewportWidthVector / _width;
		var dh = viewportHeightVector / _height;

		var viewportCorner = _position - (cameraZ * focalLength) -
		                     (viewportWidthVector + viewportHeightVector) * 0.5;
		var viewportOrigin = viewportCorner + (dw + dh) * 0.5;

		Console.WriteLine("Render started");

		for (var j = 0; j < _height; j++)
		{
			Console.WriteLine($"Line {j}/{_height}");
			for (var i = 0; i < _width; i++)
			{
				var viewportPos = viewportOrigin + (dw * i) + (dh * j);
				var rayDir = _position - viewportPos;
				var r = new Ray(_position, rayDir);
				viewport[i, j] = RayColor(r, spheres, lights, bgColor);
			}
		}

		Console.WriteLine("Render finished");
		return viewport;
	}

	private Col3 RayColor(Ray p, List<ISurface> surfaces, List<Light> lights, Col3 bgColor)
	{
		var intersectionPoint = surfaces
			.Select(s => s.IsHit(p)) // Get all intersection points for a ray
			.Where(x => x is HitModel.Hit) // Select only that hit
			.Cast<HitModel.Hit>()
			.OrderBy(x => x.T) // Sort them by the closest point
			.FirstOrDefault(); // Take the closest or null

		if (intersectionPoint is null) return bgColor;

		var color = intersectionPoint.Material.Color ?? new Col3(0, 0, 0);

		// Ambient light
		var ambientLight = lights
			.FirstOrDefault(l => l is Light.Ambient)!; // There is at least one ambient light in the scene
		var ambientComponent = ambientLight.C * intersectionPoint.Material.Ka;

		var parallelLights = lights
			.Where(l => l is Light.Parallel)
			.Cast<Light.Parallel>()
			.ToList();

		// Aggregated diffuse + specular light
		var diffuseComponent = parallelLights.Aggregate(new Col3(0, 0, 0),
			(cur, l) =>
			{
				// TODO: If light is in shadow, then do not add anything
				
				// Calcualte specular component from light source
				var viewVec = (_lookAt - _position).ToUnit();
				var lightVec = l.Direction.ToUnit();
				var eyeVec = -p.Direction.ToUnit();
				var reflectionVec = (-lightVec).Reflect(intersectionPoint.HitNormalUnit).ToUnit();

				var specularIntensity = System.Math.Pow(System.Math.Max(eyeVec.Dot(reflectionVec), 0.0),
					intersectionPoint.Material.Exp);
				var specularColor = l.C * intersectionPoint.Material.Ks * specularIntensity;

				// Calculate diffuse component from light source
				var diffuseIntensity = System.Math.Max(intersectionPoint.HitNormalUnit.Dot(-lightVec), 0.0);
				var diffuseColor = l.C * intersectionPoint.Material.Kd * diffuseIntensity;

				return cur + specularColor + diffuseColor;
			});

		var pixelColor = color + ambientComponent + diffuseComponent;

		return pixelColor;
	}
}