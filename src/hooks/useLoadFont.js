import { useState, useEffect } from "react";
import axios from "axios";

const useFonts = () => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);

  const LoadFonts = async (fonts) => {
    const styleElement = document.createElement("style");
    let fontFaceRules = "";

    fonts.forEach((font) => {
      fontFaceRules += `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.font_woff2}') format('woff2'),
               url('${font.font_woff}') format('woff'),
               url('${font.font_ttf}') format('truetype');
          font-weight: ${font.weight};
          font-style: ${font.style};
        }
      `;
    });

    styleElement.innerHTML = fontFaceRules;
    document.head.appendChild(styleElement);
  };

  const fetchAllFonts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://apis.ezpics.vn/apis/listFont");
      if (response.data.code === 1) {
        setFonts(response.data.data);
        await LoadFonts(response.data.data);
      } else {
        console.error("Failed to fetch fonts:", response.data);
      }
    } catch (error) {
      console.error("Error fetching fonts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFonts();
  }, []);

  return { fonts, loading };
};

export default useFonts;
