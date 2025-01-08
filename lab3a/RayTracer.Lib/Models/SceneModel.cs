using System.Text;

using RayTracer.Lib.Math;

namespace RayTracer.Lib.Models;

public record SceneModel(Col3 BackgroundColor, string OutputFile)
{
  public CameraModel? Camera { get; init; }
  public List<LightModel> Lights { get; init; } = [];
  public List<SphereModel> Surfaces { get; init; } = [];

  public override string ToString()
  {
    var sb = new StringBuilder();

    sb.Append($"Output -- {OutputFile}\n");
    sb.Append($"BackgroundColor -- {BackgroundColor}\n");
    sb.Append($"""
              Camera:
                Position -- {Camera?.Position}
                LookAt -- {Camera?.LookAt}
                Up -- {Camera?.Up}
                HorizontalFov -- {Camera?.HorizontalFov}
                Resolution -- h:{Camera?.Resolution.h} w:{Camera?.Resolution.w}
                MaxBounces -- {Camera?.MaxBounces}

              """);

    sb.Append("Lights:\n");
    foreach(var l in Lights) sb.Append($"  {l}\n");

    sb.Append("Surfaces:\n");
    foreach(var s in Surfaces)
    {
      sb.Append($"  Radius -- {s.Radius}\n");
      sb.Append($"  Position -- {s.Position}\n");
      sb.Append($"  Material -- {s.Material}\n");

      if(s.Transforms.Count == 0) continue;

      sb.Append("  Transforms:\n");

      foreach(var t in s.Transforms)
      {
        sb.Append($"    {t}\n");
      }
    }

    sb.AppendLine();

    return sb.ToString();
  }
}