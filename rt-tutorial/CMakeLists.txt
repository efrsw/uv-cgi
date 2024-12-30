cmake_minimum_required(VERSION 3.30)
project(rt_tutorial)

set(CMAKE_CXX_STANDARD 20)

add_executable(rt_tutorial main.cpp
        vec3.h
        color.h)
