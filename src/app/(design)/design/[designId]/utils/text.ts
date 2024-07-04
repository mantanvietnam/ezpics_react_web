import { IStaticText } from "@layerhub-io/types";
import { groupBy } from "lodash";

export const getTextProperties = (
  object: Required<IStaticText>,
  fonts: any[]
) => {
  const color = object.fill;
  const family = object.fontFamily;
  const selectedFont = fonts.find(
    (sampleFont) => sampleFont.postscript_name === family
  );
  const groupedFonts = groupBy(fonts, "family");
  const selectedFamily = groupedFonts[selectedFont!.family];
  const hasBold = selectedFamily.find((font) =>
    font.postscript_name.includes("-Bold")
  );
  const hasItalic = selectedFamily.find((font) =>
    font.postscript_name.includes("-Italic")
  );
  const styleOptions = {
    hasBold: !!hasBold,
    hasItalic: !!hasItalic,
    options: selectedFamily,
  };
  return {
    color,
    family: selectedFamily[0].family,
    bold: family.includes("Bold"),
    italic: family.includes("Italic"),
    underline: object.underline,
    styleOptions,
    boldURL: {
      URL: "",
      name: "",
    },
  };
};

export const getTextPropertiesClone = (
  object: Required<IStaticText>,
  fonts: any[]
) => {
  const color = object.fill;
  const family = object.fontFamily;
  const selectedFonts = fonts.filter((sampleFont) =>
    sampleFont.name.includes(family)
  );
  console.log(family);
  console.log(selectedFonts);
  console.log(fonts);
  // Group fonts by family
  const groupedFonts = groupBy(fonts, "name");
  const selectedFamily = groupedFonts[family] || [];
  const hasBold = selectedFamily.find((font) => font.name.includes("Bold"));
  const hasItalic = selectedFamily.find((font) => font.name.includes("Italic"));
  const styleOptions = {
    hasBold: !!hasBold,
    hasItalic: !!hasItalic,
    options: selectedFamily,
  };

  return {
    color,
    family: family,
    bold: family.includes("Bold"),
    italic: family.includes("Italic"),
    underline: object.underline,
    styleOptions,
    selectedFont: selectedFonts,
    boldURL: {
      URL: selectedFonts.find((font) => font.name.includes("Bold"))?.url || "",
      name:
        selectedFonts.find((font) => font.name.includes("Bold"))?.name || "",
    },
    font: fonts,
  };
};
