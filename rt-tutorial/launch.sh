#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the project using cmake
cmake --build build --config release

# Run the application and save the output to image.ppm
./build/rt_tutorial > image.ppm

# Indicate success
echo "Build and execution complete. Output saved to image.ppm."
