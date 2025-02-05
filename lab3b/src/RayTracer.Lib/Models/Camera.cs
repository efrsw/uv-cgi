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
	public Col3[,] Render(List<ISurface> surfaces, List<Light> lights, Col3 bgColor, RenderOptions renderOptions)
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

		var ambientLight = (Light.Ambient)lights.Find(l => l is Light.Ambient)!;
		var otherLights = lights.Where(l => l is not Light.Ambient).ToList();

		Console.WriteLine("Render started");

		for (var j = 0; j < _height; j++)
		{
			Console.Write($"\rLine {j + 1}/{_height}");
			for (var i = 0; i < _width; i++)
			{
				switch (renderOptions)
				{
					case RenderOptions.RealCameraLens rcl:
						var pixelColor = new Col3(0, 0, 0);

						for (var s = 0; s < rcl.SamplePerPixel; s++)
						{
							var viewportPosFocal = viewportOrigin + (dw * i) + (dh * j);

							// Calculate point on focal plane
							var baseRayDir = (viewportPosFocal - _position).ToUnit();
							var focalPoint = _position + baseRayDir * rcl.FocalDistance;

							// Generate random point on lens
							var randomPointOnLens = GetRandomPointOnLens(cameraX, cameraY, rcl.Aperture);
							var rayOrigin = _position + randomPointOnLens;
							var rayDirFocal = (focalPoint - rayOrigin).ToUnit();

							var rFocal = new Ray(rayOrigin, rayDirFocal);
							pixelColor += RayColor(rFocal, surfaces, ambientLight, otherLights, bgColor);
						}

						viewport[i, j] = pixelColor / rcl.SamplePerPixel;
						break;
					default:
						var viewportPos = viewportOrigin + (dw * i) + (dh * j);
						var rayDir = viewportPos - _position;
						var r = new Ray(_position, rayDir);
						viewport[i, j] = RayColor(r, surfaces, ambientLight, otherLights, bgColor);
						break;
				}
			}
		}

		Console.WriteLine();
		Console.WriteLine("Render finished");
		return viewport;
	}

	/// <summary>
	/// Function calculates the color of the ray
	/// </summary>
	private static Col3 RayColor(Ray p, List<ISurface> surfaces, Light.Ambient aLight, List<Light> pLights, Col3 bgColor)
	{
		var intersectionP = p.IsIntersectedBy(surfaces, 0, double.MaxValue);
		if (intersectionP is null) return bgColor;

		var materialColor = intersectionP.Value.Material.Color ?? new Col3(0, 0, 0);

		var ambientComponent = aLight.C * intersectionP.Value.Material.Ka;

		var phongColor = new Col3();

		foreach (var light in pLights)
		{
			Vec3 lightDir;

			switch (light)
			{
				case Light.Parallel parallelLight:
					lightDir = -parallelLight.Direction;
					break;
				case Light.Point pointLight:
					lightDir = (pointLight.Position - intersectionP.Value.P).ToUnit();
					break;
				default:
					continue;
			}

			// If light is on the other side of the surface, then do nothing
			if (intersectionP.Value.HitNormalUnit.Dot(lightDir) < 0) continue;

			var shadowRay = new Ray(intersectionP.Value.P, lightDir);
			var maxDist = light is Light.Point pl ? (pl.Position - intersectionP.Value.P).Length() : double.MaxValue;

			// 0.001 to prevent shadow acne
			var shadowIntersection = shadowRay.IsIntersectedBy(surfaces, 0.001, maxDist);

			if (shadowIntersection is not null) continue;

			// Calculate specular component from light source
			var eyeVec = -p.Direction.ToUnit();
			var reflectionVec = lightDir.Reflect(intersectionP.Value.HitNormalUnit).ToUnit();
			var specularIntensity = System.Math.Pow(System.Math.Max(eyeVec.Dot(reflectionVec), 0.0),
				intersectionP.Value.Material.Exp);
			var specularColor = light.C * intersectionP.Value.Material.Ks * specularIntensity;

			// Calculate diffuse component from light source
			var diffuseIntensity = System.Math.Max(intersectionP.Value.HitNormalUnit.Dot(lightDir), 0.0);
			var diffuseColor = light.C * intersectionP.Value.Material.Kd * diffuseIntensity;

			phongColor = phongColor + specularColor + diffuseColor;
		}

		var finalColor = (ambientComponent + phongColor) * materialColor;
		return finalColor;
	}

	private static Vec3 GetRandomPointOnLens(Vec3 cameraX, Vec3 cameraY, double apertureSize)
	{
		// Generate random point in a disk for circular aperture
		var r = System.Math.Sqrt(Random.Shared.NextDouble()) * apertureSize;
		var theta = Random.Shared.NextDouble() * 2 * System.Math.PI;

		var x = r * System.Math.Cos(theta);
		var y = r * System.Math.Sin(theta);

		return (cameraX * x) + (cameraY * y);
	}
}