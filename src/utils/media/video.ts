import { IScene, ILayer } from "@layerhub-io/types";

export const loadVideoResource = (
  videoSrc: string
): Promise<HTMLVideoElement> => {
  return new Promise(function (resolve, reject) {
    var video = document.createElement("video");
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.addEventListener("loadedmetadata", function (event) {
      video.currentTime = 1;
    });

    video.addEventListener("seeked", function () {
      resolve(video);
    });

    video.addEventListener("error", function (error) {
      reject(error);
    });
  });
};

export const captureFrame = (video: HTMLVideoElement) => {
  return new Promise(function (resolve) {
    var canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")!
      .drawImage(video, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(video.src);

    const data = canvas.toDataURL();

    fetch(data)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
  });
};

export const captureDuration = (video: HTMLVideoElement) => {
  return new Promise((resolve) => {
    resolve(video.duration);
  });
};

export const loadVideoEditorAssets = async (payload: IScene) => {
  console.log(payload);
  const layers: Partial<ILayer>[] = [];
  for (const layer of payload.layers) {
    console.log(payload.layers);

    layers.push(layer);
  }
  console.log({
    ...payload,
    layers: layers,
  });
  return {
    ...payload,
    layers: layers,
  };
};
