import { nanoid } from "nanoid";

export const defaultTemplate = {
  id: nanoid(),
  frame: {
    width: 1200,
    height: 1200,
  },
  layers: [
    {
      id: "background",
      name: "Initial Frame",
      left: 0,
      top: 0,
      width: 1200,
      height: 1200,
      type: "Background",
      fill: "#ffffff",
      metadata: {},
    },
  ],
  metadata: {},
};

export const getDefaultTemplate = ({ width, height }) => {
  return {
    id: nanoid(),
    frame: {
      width,
      height,
    },
    layers: [
      {
        id: "background",
        name: "Initial Frame",
        left: 0,
        top: 0,
        width,
        height,
        type: "Background",
        fill: "#ffffff",
        metadata: {},
      },
    ],
    metadata: {},
  };
};
