using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public class Camera
{
	private readonly Point3 _position;
	private readonly Point3 _lookAt;
	private readonly Vec3 _upVector;
	private readonly double _horizontalFov;
	private readonly int _maxBounces;
	private readonly int _width;
	private readonly int _height;

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

	/// <summary>
	/// Generate viewport array
	/// </summary>
	public Col3[,] Render(List<ISurface> spheres, List<Light> lights, Col3 bgColor)
	{
		var viewport = new Col3[_width, _height];

		var h = System.Math.Tan(_horizontalFov / 2);
		var focalLength = (_position - _lookAt).Length();

		var viewportWidth = 2 * h * focalLength;
		var viewportHeight = Convert.ToDouble(_height) / _width * viewportWidth;

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
			Console.Write($"\rLine {j + 1}/{_height}");
			for (var i = 0; i < _width; i++)
			{
				var viewportPos = viewportOrigin + (dw * i) + (dh * j);
				var rayDir = viewportPos - _position;
				var r = new Ray(_position, rayDir);
				viewport[i, j] = RayColor(r, spheres, lights, bgColor);
			}
		}

		Console.WriteLine();
		Console.WriteLine("Render finished");
		return viewport;
	}

	/// <summary>
	/// Function calculates the color of the ray
	/// </summary>
	private static Col3 RayColor(Ray p, List<ISurface> surfaces, List<Light> lights, Col3 bgColor)
	{
		var intersectionP = p.IsIntersectedBy(surfaces, 0, double.MaxValue);

		if (intersectionP is not HitModel.Hit hm) return bgColor;

		var color = hm.Material.Color ?? new Col3(0, 0, 0);

		// Ambient light
		var ambientLight = lights
			.FirstOrDefault(l => l is Light.Ambient)!; // There is at least one ambient light in the scene
		var ambientComponent = ambientLight.C * hm.Material.Ka;

		var parallelLights = lights
			.Where(l => l is Light.Parallel)
			.Cast<Light.Parallel>()
			.ToList();

		// Aggregated diffuse + specular light
		var phonkComponent = parallelLights.Aggregate(new Col3(0, 0, 0),
			(cur, l) =>
			{
				// If light is on the other side of the surface, then do nothing
				if (hm.HitNormalUnit.Dot(-l.Direction) < 0) return cur;

				var shadowRay = new Ray(hm.P, -l.Direction);
				// 0.001 to prevent shadow acne
				var shadowIntersection = shadowRay.IsIntersectedBy(surfaces, 0.001, double.MaxValue);

				// If light is in shadow, then do not add anything
				if (shadowIntersection is HitModel.Hit) return cur;

				// Calcualte specular component from light source
				var lightVec = l.Direction.ToUnit();
				var eyeVec = -p.Direction.ToUnit();
				var reflectionVec = (-lightVec).Reflect(hm.HitNormalUnit).ToUnit();

				var specularIntensity = System.Math.Pow(System.Math.Max(eyeVec.Dot(reflectionVec), 0.0),
					hm.Material.Exp);
				var specularColor = l.C * hm.Material.Ks * specularIntensity;

				// Calculate diffuse component from light source
				var diffuseIntensity = System.Math.Max(hm.HitNormalUnit.Dot(-lightVec), 0.0);
				var diffuseColor = l.C * hm.Material.Kd * diffuseIntensity;

				return cur + specularColor + diffuseColor;
			});

		var pixelColor = color + ambientComponent + phonkComponent;

		return pixelColor;
	}
}