#ifndef CAMERA_H
#define CAMERA_H

#include "color.h"
#include "hittable.h"
#include "rtweekend.h"

class camera {
public:

  auto render(const hittable& world) -> void {

  }

  private:
  void initialize() {
  }

  auto ray_color(const ray& r, const hittable& world) const {
    hit_record rec;

    if(world.hit(r, interval(0, infinity), rec) {
      return 0.5 * (rec.normal + color(1, 1, 1));
    }
  }

};

#endif //CAMERA_H
