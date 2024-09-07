const getFontsFromObjects = (objects) => {
  let fonts = [];
  for (const object of objects) {
    if (object.type === "StaticText" || object.type === "DynamicText") {
      fonts.push({
        name: object.fontFamily,
        url: object.fontURL,
      });
    }
    if (object.type === "Group") {
      let groupFonts = getFontsFromObjects(object.objects);
      fonts = fonts.concat(groupFonts);
    }
  }
  return fonts;
};

export const loadTemplateFonts = async (design) => {
  const fonts = getFontsFromObjects(design.layers);
  if (fonts.length > 0) {
    await loadFonts(fonts);
  }
};

export const loadFonts = (fonts) => {
  const promisesList = fonts.map(async (font) => {
    try {
      const loadedFont = await new FontFace(
        font.name,
        `url(${font.url})`
      ).load();
      return loadedFont;
    } catch (err) {
      console.error(`Failed to load font ${font.name}:`, err);
      return null;
    }
  });

  return new Promise((resolve, reject) => {
    Promise.all(promisesList)
      .then((res) => {
        res.forEach((uniqueFont) => {
          if (uniqueFont) {
            document.fonts.add(uniqueFont);
          }
        });
        resolve(true);
      })
      .catch((err) => reject(err));
  });
};

export const loadFontsSelector = (fonts) => {
  const promisesList = fonts.map(async (font) => {
    try {
      const loadedFont = await new FontFace(
        font.name,
        `url(${font.url})`
      ).load();
      return loadedFont;
    } catch (err) {
      console.error(`Failed to load font ${font.name}:`, err);
      return null;
    }
  });

  return new Promise((resolve, reject) => {
    Promise.all(promisesList)
      .then((res) => {
        res.forEach((uniqueFont) => {
          if (uniqueFont instanceof FontFace) {
          }
        });
        resolve(true);
      })
      .catch((err) => reject(err));
  });
};
