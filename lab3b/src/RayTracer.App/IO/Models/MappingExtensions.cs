using RayTracer.Lib.Abstractions;
using RayTracer.Lib.Models;

namespace RayTracer.App.IO.Models;

public static class MappingExtensions
{
	public static Camera FromModel(this CameraModel model)
		=> new(model.Position, model.LookAt, model.Up, model.HorizontalFov, model.Resolution.w, model.Resolution.h,
			model.MaxBounces);

	public static ISurface FromModel(this SurfaceModel model, string sourcesPath)
	{
		switch (model)
		{
			case SurfaceModel.Sphere sm:
				return new Sphere(sm.Radius, sm.Position, sm.Material.FromModel(),
						[.. model.Transforms.Select(t => t.FromModel())]);

			case SurfaceModel.Mesh mm:
				var faces = ObjectParser.ParsePath(Path.Join(sourcesPath, mm.Name))?.Faces ?? [];

				return new Mesh(mm.Material.FromModel(),
						[.. faces.Select(f => f.FromModel())],
						[.. model.Transforms.Select(t => t.FromModel())]);

			default:
				throw new ArgumentOutOfRangeException(nameof(model), "Error mapping MaterialMode to Material");
		}
	}

	public static Polygon FromModel(this FaceModel model) => new(model.A, model.B, model.C, model.Normal);

	public static Light FromModel(this LightModel model)
		=> model switch
		{
			LightModel.Ambient => new Light.Ambient(model.Color),
			LightModel.Parallel ml => new Light.Parallel(ml.Color, ml.Direction),
			LightModel.Point => new Light.Point(model.Color),
			_ => throw new ArgumentOutOfRangeException(nameof(model))
		};

	private static Material FromModel(this MaterialModel model)
		=> model switch
		{
			MaterialModel.Solid sm => new Material(model.Reflectance, model.Transmittance, model.Refraction,
				model.PhongModel.Ka, model.PhongModel.Kd, model.PhongModel.Ks, model.PhongModel.Exponent)
			{
				Color = sm.Color
			},
			MaterialModel.Textured tm => new Material(model.Reflectance, model.Transmittance, model.Refraction,
				model.PhongModel.Ka, model.PhongModel.Kd, model.PhongModel.Ks, model.PhongModel.Exponent)
			{
				Texture = tm.Texture
			},
			_ => throw new ArgumentOutOfRangeException(nameof(model), "Error mapping MaterialMode to Material"),
		};

	private static Transformation FromModel(this TransformModel model)
		=> model switch
		{
			TransformModel.Scale sm => new Transformation.Scale(sm.V),
			TransformModel.Translate tm => new Transformation.Translation(tm.V),
			TransformModel.RotateX rx => new Transformation.RotationX(rx.Theta),
			TransformModel.RotateY ry => new Transformation.RotationX(ry.Theta),
			TransformModel.RotateZ rz => new Transformation.RotationX(rz.Theta),
			_ => throw new ArgumentOutOfRangeException(nameof(model), "Error mapping TransformModel to Transformation")
		};
}