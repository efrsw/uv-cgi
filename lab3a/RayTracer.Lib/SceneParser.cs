using System.Text;
using System.Xml.Linq;

using RayTracer.Lib.Math;
using RayTracer.Lib.Models;

namespace RayTracer.Lib;

public class SceneParser
{
  public SceneParser(string filePath)
  {
    SceneXml = XDocument.Load(filePath);
  }

  public XDocument SceneXml { get; }

  public SceneModel ConstructScene()
  {
    var outputFile = SceneXml.Element("scene")?.Attribute("output_file")?.Value;

    if (outputFile is null)
      throw new ArgumentException(nameof(outputFile), "Wasn't able to parse `outpu_file` attribute");

    var backgroundColorEl = SceneXml.Descendants("background_color").First();
    var (r, g, b) = ExtractTripletFromNode(backgroundColorEl, TripletType.Color);
    var backgroundColor = new Col3(r, g, b);

    var res = new SceneModel(backgroundColor, outputFile)
    {
      Camera = ParseCamera(),
      Lights = ParseLights(),
      Surfaces = ParseMeshes()
    };

    return res;
  }

  /// <summary>
  /// Parses all information related to meshes/geometry of the scene
  /// </summary>
  private List<SphereModel> ParseMeshes()
  {
    var surfacesEl = SceneXml.Descendants("surfaces").First();
    var surfaces = new List<SphereModel>();

    foreach (var surface in surfacesEl.Elements())
    {
      // Parse radius
      var radius = double.TryParse(surface.Attribute("radius")?.Value, out var rad) ? rad : 123;

      // Parse surface position
      var sPositionEl = surface.Descendants("position").First();
      var sPositionData = ExtractTripletFromNode(sPositionEl, TripletType.Position);
      var sPosition = new Point3(sPositionData.x, sPositionData.y, sPositionData.z);

      // Parse surface material
      var sMaterialEl = surface.Descendants("material_solid").FirstOrDefault()
        ?? surface.Descendants("material_textured").First();

      var reflectanceEl = sMaterialEl.Descendants("reflectance").First();
      var reflectance = double.TryParse(reflectanceEl.Attribute("r")?.Value, out var r) ? r : 1.0;

      var transmittanceEl = sMaterialEl.Descendants("transmittance").First();
      var transmittance = double.TryParse(transmittanceEl.Attribute("t")?.Value, out var t) ? t : 1.0;

      var refractionEl = sMaterialEl.Descendants("refraction").First();
      var refraction = double.TryParse(refractionEl.Attribute("iof")?.Value, out var iof) ? iof : 1.0;

      var phongEl = sMaterialEl.Descendants("phong").First();
      var phong = new PhongModel(
          double.TryParse(phongEl.Attribute("ka")?.Value, out var ka) ? ka : 1.0,
          double.TryParse(phongEl.Attribute("kd")?.Value, out var kd) ? kd : 1.0,
          double.TryParse(phongEl.Attribute("ks")?.Value, out var ks) ? ks : 1.0,
          double.TryParse(phongEl.Attribute("exponent")?.Value, out var exp) ? exp : 1.0);

      var transforms = new List<TransformModel>();
      var transformsEl = sMaterialEl.Descendants("transforms").FirstOrDefault(); 

      foreach (var tr in transformsEl?.Elements() ?? [])
      {
        switch (tr.Name.ToString())
        {
          case "translate":
            var (x, y, z) = ExtractTripletFromNode(tr, TripletType.Position);
            transforms.Add(new TransformModel.Translate(new(x, y, z)));
            break;
          case "scale":
            var scaleData = ExtractTripletFromNode(tr, TripletType.Position);
            transforms.Add(new TransformModel.Scale(new(scaleData.x, scaleData.y, scaleData.z)));
            break;
          case "rotateX":
            var thetaX = double.TryParse(tr.Attribute("theta")?.Value, out var rx) ? rx : 0d;
            transforms.Add(new TransformModel.RotateX(thetaX));
            break;
          case "rotateY":
            var thetaY = double.TryParse(tr.Attribute("theta")?.Value, out var ry) ? ry : 0d;
            transforms.Add(new TransformModel.RotateY(thetaY));
            break;
          case "rotateZ":
            var thetaZ = double.TryParse(tr.Attribute("theta")?.Value, out var rz) ? rz : 0d;
            transforms.Add(new TransformModel.RotateZ(thetaZ));
            break;
        }
      }

      if (sMaterialEl.Name.ToString() == "material_solid")
      {
        var colorEl = sMaterialEl.Descendants("color").First();
        var (x, y, z) = ExtractTripletFromNode(colorEl, TripletType.Color);
        var matColor = new Col3(x, y, z);
        var s = new SphereModel(radius,
            sPosition,
            new MaterialModel.Solid(matColor, phong, reflectance, transmittance, refraction),
            transforms);

        surfaces.Add(s);
      }
      else
      {
        var textureEl = sMaterialEl.Descendants("texture").First();
        var texturePath = textureEl.Attribute("name")?.Value ?? "";
        var s = new SphereModel(radius,
            sPosition,
            new MaterialModel.Textured(texturePath, phong, reflectance, transmittance, refraction),
            transforms);

        surfaces.Add(s);
      }
    }

    return surfaces;
  }

  /// <summary>
  /// Parses all information related to lights
  /// </summary>
  private List<LightModel> ParseLights()
  {
    var lightsEl = SceneXml.Descendants("lights").First();
    var lights = new List<LightModel>();

    foreach (var light in lightsEl.Elements())
    {
      var colorEl = light.Descendants("color").First();
      var (r, g, b) = ExtractTripletFromNode(colorEl, TripletType.Color);

      switch (light.Name.ToString())
      {
        case "ambient_light":
          var al = new LightModel.Ambient(new(r, g, b));
          lights.Add(al);
          break;
        case "parallel_light":
          var directionEl = light.Descendants("direction").First();
          var (x, y, z) = ExtractTripletFromNode(directionEl, TripletType.Position);
          var pl = new LightModel.Parallel(new(r, g, b), new(x, y, z));
          lights.Add(pl);
          break;
        case "point_light":
          var positionEl = light.Descendants("position").First();
          var positionData = ExtractTripletFromNode(positionEl, TripletType.Position);
          var pointLight = new LightModel.Point(new(r, g, b),
              new(positionData.x, positionData.y, positionData.z));
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
    var cameraEl = SceneXml.Descendants("camera").First();

    var cameraPosEl = cameraEl?.Descendants("position").First();
    var (x, y, z) = ExtractTripletFromNode(cameraPosEl, TripletType.Position);
    var cameraPos = new Point3(x, y, z);

    var cameraLookAtEl = cameraEl?.Descendants("lookat").First();
    var cameraLookAtData = ExtractTripletFromNode(cameraLookAtEl, TripletType.Position);
    var cameraLookAt = new Point3(cameraLookAtData.x, cameraLookAtData.y, cameraLookAtData.z);

    var cameraUpEl = cameraEl?.Descendants("up").First();
    var cameraUpData = ExtractTripletFromNode(cameraUpEl, TripletType.Position);
    var cameraUp = new Vec3(cameraUpData.x, cameraUpData.y, cameraUpData.z);

    var cameraHorizontalFovEl = cameraEl?.Descendants("horizontal_fov").First();
    var cameraHorizontalFov = int.TryParse(cameraHorizontalFovEl?.Attribute("angle")?.Value, out var fov) ? fov : 90;

    var cameraResolutionEl = cameraEl?.Descendants("resolution").First();
    var resolution = (
        int.TryParse(cameraResolutionEl?.Attribute("vertical")?.Value, out var h) ? h : 768,
        int.TryParse(cameraResolutionEl?.Attribute("horizontal")?.Value, out var w) ? w : 1024);

    var cameraMaxBouncesEl = cameraEl?.Descendants("max_bounces").First();
    var maxBounces = int.TryParse(cameraMaxBouncesEl?.Attribute("n")?.Value, out var mb) ? mb : 100;

    var cam = new CameraModel(cameraPos, cameraLookAt, cameraUp, cameraHorizontalFov, resolution, maxBounces);

    return cam;
  }

  /// <summary>
  /// Allows to extract triplet of values like XYZ/RGB from an XMLNode
  /// </summary>
  private (double x, double y, double z) ExtractTripletFromNode(XElement? element, TripletType type)
  {
    Span<double> res = stackalloc double[3];
    Span<string> attributeNames = type switch
    {
      TripletType.Color => ["r", "g", "b"],
      TripletType.Position => ["x", "y", "z"],
      _ => ["x", "y", "z"]
    };

    if (element is null) return (res[0], res[1], res[2]);

    for (int i = 0; i < res.Length; i++)
    {
      res[i] = double.TryParse(element.Attribute(attributeNames[i])?.Value, out var result) ? result : 0.0;
    }

    return (res[0], res[1], res[2]);
  }
}