import React from "react";

export const SVG_TYPES = [
  { type: "circle", name: "Circle" },
  { type: "rect", name: "Rectangle" },
  { type: "star", name: "Star" },
];

export const getSVGDefinitions = (svgType) => {
  switch (svgType) {
    case "circle":
      return (
        <clipPath id="circleView">
          <circle cx="120" cy="120" r="100" />
        </clipPath>
      );
    case "rect":
      return (
        <clipPath id="rectView">
          <rect x="20" y="20" width="200" height="200" />
        </clipPath>
      );
    case "star":
      return (
        <clipPath id="starView">
          <polygon points="120,20 140,80 200,80 150,120 170,180 120,140 70,180 90,120 40,80 100,80" />
        </clipPath>
      );
    default:
      return null;
  }
};

export const getSVGSampleDefinitions = (svgType) => {
  switch (svgType) {
    case "circle":
      return (
        <clipPath id="circleSampleView">
          <circle cx="40" cy="40" r="35" />
        </clipPath>
      );
    case "rect":
      return (
        <clipPath id="rectSampleView">
          <rect x="10" y="10" width="60" height="60" />
        </clipPath>
      );
    case "star":
      return (
        <clipPath id="starSampleView">
          <polygon points="40,10 45,30 60,30 50,40 55,60 40,50 25,60 30,40 20,30 35,30" />
        </clipPath>
      );
    default:
      return null;
  }
};
