using System.Xml.Linq;

using RayTracer.App.IO.Models;
using RayTracer.Lib.Math;

namespace RayTracer.App.IO;

public class SceneParser
{
	public SceneParser(string filePath)
	{
		SceneXml = XDocument.Load(filePath);
	}

	private XDocument SceneXml { get; }

	public SceneModel ConstructScene()
	{
		string? outputFile = SceneXml.Element("scene")?.Attribute("output_file")?.Value;

		if (outputFile is null)
		{
			throw new ArgumentException("Wasn't able to parse `output_file` attribute", nameof(outputFile));
		}

		XElement backgroundColorEl = SceneXml.Descendants("background_color").First();
		(double r, double g, double b) = ExtractTripletFromNode(backgroundColorEl, TripletType.Color);
		Col3 backgroundColor = new(r, g, b);

		SceneModel res = new(backgroundColor, outputFile)
		{
			Camera = ParseCamera(), Lights = ParseLights(), Surfaces = ParseMeshes()
		};

		return res;
	}

	/// <summary>
	/// Parses all information related to meshes/geometry of the scene
	/// </summary>
	private List<SurfaceModel> ParseMeshes()
	{
		XElement surfacesEl = SceneXml.Descendants("surfaces").First();
		List<SurfaceModel> surfaces = [];

		foreach (XElement surface in surfacesEl.Elements())
		{
			// Parse surface material
			XElement? sMaterialEl = surface.Descendants("material_solid").FirstOrDefault()
			                        ?? surface.Descendants("material_textured").FirstOrDefault();
			MaterialModel material = ParseMaterial(sMaterialEl);

			// Parse surface transforms
			XElement? transformsEl = surface.Descendants("transform").FirstOrDefault();
			List<TransformModel> transforms = ParseTransforms(transformsEl);

			// Parse sphere specific data
			if (surface.Name.ToString() == "sphere")
			{
				// Parse radius
				double radius = double.TryParse(surface.Attribute("radius")?.Value, out double rad) ? rad : 123;

				// Parse surface position
				XElement sPositionEl = surface.Descendants("position").First();
				(double x, double y, double z) = ExtractTripletFromNode(sPositionEl, TripletType.Position);
				Point3 sPosition = new(x, y, z);
				surfaces.Add(new SurfaceModel.Sphere(radius, sPosition, material, transforms));
			}
			else
			{
				// Parse obj path
				string path = surface.Attribute("name")?.Value ?? string.Empty;

				surfaces.Add(new SurfaceModel.Mesh(material, path, transforms));
			}
		}

		return surfaces;
	}

	/// <summary>
	/// Parse material information from the geometry element
	/// </summary>
	/// <param name="materialEl"></param>
	/// <returns></returns>
	private static MaterialModel ParseMaterial(XElement? materialEl)
	{
		if (materialEl is null)
		{
			return new MaterialModel.Solid(new Col3(0, 0, 0), new PhongModel(1.0, 1.0, 1.0, 1.0), 1d, 1d, 1d);
		}

		XElement reflectanceEl = materialEl.Descendants("reflectance").First();
		double reflectance = double.TryParse(reflectanceEl.Attribute("r")?.Value, out double r) ? r : 1.0;

		XElement transmittanceEl = materialEl.Descendants("transmittance").First();
		double transmittance = double.TryParse(transmittanceEl.Attribute("t")?.Value, out double t) ? t : 1.0;

		XElement refractionEl = materialEl.Descendants("refraction").First();
		double refraction = double.TryParse(refractionEl.Attribute("iof")?.Value, out double iof) ? iof : 1.0;

		XElement phongEl = materialEl.Descendants("phong").First();
		PhongModel phong = new(
			double.TryParse(phongEl.Attribute("ka")?.Value, out double ka) ? ka : 1.0,
			double.TryParse(phongEl.Attribute("kd")?.Value, out double kd) ? kd : 1.0,
			double.TryParse(phongEl.Attribute("ks")?.Value, out double ks) ? ks : 1.0,
			double.TryParse(phongEl.Attribute("exponent")?.Value, out double exp) ? exp : 1.0);

		if (materialEl.Name.ToString() == "material_solid")
		{
			XElement colorEl = materialEl.Descendants("color").First();
			(double x, double y, double z) = ExtractTripletFromNode(colorEl, TripletType.Color);
			Col3 matColor = new(x, y, z);
			return new MaterialModel.Solid(matColor, phong, reflectance, transmittance, refraction);
		}

		XElement textureEl = materialEl.Descendants("texture").First();
		string texturePath = textureEl.Attribute("name")?.Value ?? "";
		return new MaterialModel.Textured(texturePath, phong, reflectance, transmittance, refraction);
	}

	/// <summary>
	/// Allows to parse transforms on a given element
	/// </summary>
	/// <param name="transformsEl"></param>
	/// <returns></returns>
	private static List<TransformModel> ParseTransforms(XElement? transformsEl)
	{
		List<TransformModel> transformModels = [];
		if (transformsEl is null)
		{
			return transformModels;
		}

		foreach (XElement tr in transformsEl.Elements())
		{
			switch (tr.Name.ToString())
			{
				case "translate":
					(double x, double y, double z) = ExtractTripletFromNode(tr, TripletType.Position);
					transformModels.Add(new TransformModel.Translate(new Vec3(x, y, z)));
					break;
				case "scale":
					(double x, double y, double z) scaleData = ExtractTripletFromNode(tr, TripletType.Position);
					transformModels.Add(new TransformModel.Scale(new Vec3(scaleData.x, scaleData.y, scaleData.z)));
					break;
				case "rotateX":
					double thetaX = double.TryParse(tr.Attribute("theta")?.Value, out double rx) ? rx : 0d;
					transformModels.Add(new TransformModel.RotateX(thetaX));
					break;
				case "rotateY":
					double thetaY = double.TryParse(tr.Attribute("theta")?.Value, out double ry) ? ry : 0d;
					transformModels.Add(new TransformModel.RotateY(thetaY));
					break;
				case "rotateZ":
					double thetaZ = double.TryParse(tr.Attribute("theta")?.Value, out double rz) ? rz : 0d;
					transformModels.Add(new TransformModel.RotateZ(thetaZ));
					break;
			}
		}

		return transformModels;
	}

	/// <summary>
	/// Parses all information related to lights
	/// </summary>
	private List<LightModel> ParseLights()
	{
		XElement lightsEl = SceneXml.Descendants("lights").First();
		List<LightModel> lights = [];

		foreach (XElement light in lightsEl.Elements())
		{
			XElement colorEl = light.Descendants("color").First();
			(double r, double g, double b) = ExtractTripletFromNode(colorEl, TripletType.Color);

			switch (light.Name.ToString())
			{
				case "ambient_light":
					LightModel.Ambient al = new(new Col3(r, g, b));
					lights.Add(al);
					break;
				case "parallel_light":
					XElement directionEl = light.Descendants("direction").First();
					(double x, double y, double z) = ExtractTripletFromNode(directionEl, TripletType.Position);
					LightModel.Parallel pl = new(new Col3(r, g, b), new Vec3(x, y, z));
					lights.Add(pl);
					break;
				case "point_light":
					XElement positionEl = light.Descendants("position").First();
					(double x, double y, double z) positionData =
						ExtractTripletFromNode(positionEl, TripletType.Position);
					LightModel.Point pointLight = new(new Col3(r, g, b),
						new Point3(positionData.x, positionData.y, positionData.z));
					lights.Add(pointLight);
					lights.Add(pointLight);
					break;
			}
		}

		return lights;
	}

	/// <summary>
	/// Parses all information related to camera
	/// </summary>
	private CameraModel ParseCamera()
	{
		XElement cameraEl = SceneXml.Descendants("camera").First();

		XElement cameraPosEl = cameraEl.Descendants("position").First();
		(double x, double y, double z) = ExtractTripletFromNode(cameraPosEl, TripletType.Position);
		Point3 cameraPos = new(x, y, z);

		XElement? cameraLookAtEl = cameraEl?.Descendants("lookat").First();
		(double x, double y, double z) cameraLookAtData = ExtractTripletFromNode(cameraLookAtEl, TripletType.Position);
		Point3 cameraLookAt = new(cameraLookAtData.x, cameraLookAtData.y, cameraLookAtData.z);

		XElement? cameraUpEl = cameraEl?.Descendants("up").First();
		(double x, double y, double z) cameraUpData = ExtractTripletFromNode(cameraUpEl, TripletType.Position);
		Vec3 cameraUp = new(cameraUpData.x, cameraUpData.y, cameraUpData.z);

		XElement? cameraHorizontalFovEl = cameraEl?.Descendants("horizontal_fov").First();
		int cameraHorizontalFov =
			int.TryParse(cameraHorizontalFovEl?.Attribute("angle")?.Value, out int fov) ? fov : 90;

		XElement? cameraResolutionEl = cameraEl?.Descendants("resolution").First();
		(int, int) resolution = (
			int.TryParse(cameraResolutionEl?.Attribute("vertical")?.Value, out int h) ? h : 768,
			int.TryParse(cameraResolutionEl?.Attribute("horizontal")?.Value, out int w) ? w : 1024);

		XElement? cameraMaxBouncesEl = cameraEl?.Descendants("max_bounces").First();
		int maxBounces = int.TryParse(cameraMaxBouncesEl?.Attribute("n")?.Value, out int mb) ? mb : 100;

		CameraModel cam = new(cameraPos, cameraLookAt, cameraUp, cameraHorizontalFov, resolution, maxBounces);

		return cam;
	}

	/// <summary>
	/// Allows to extract triplet of values like XYZ/RGB from an XMLNode
	/// </summary>
	private static (double x, double y, double z) ExtractTripletFromNode(XElement? element, TripletType type)
	{
		Span<double> res = stackalloc double[3];
		Span<string> attributeNames = type switch
		{
			TripletType.Color => ["r", "g", "b"],
			TripletType.Position => ["x", "y", "z"],
			_ => ["x", "y", "z"]
		};

		if (element is null)
		{
			return (res[0], res[1], res[2]);
		}

		for (int i = 0; i < res.Length; i++)
		{
			res[i] = double.TryParse(element.Attribute(attributeNames[i])?.Value, out double result) ? result : 0.0;
		}

		return (res[0], res[1], res[2]);
	}
}