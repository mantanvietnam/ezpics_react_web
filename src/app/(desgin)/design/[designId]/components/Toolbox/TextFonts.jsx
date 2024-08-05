import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import useFonts from "../../../../../../hooks/useLoadFont"; // Correct import path

const TextFonts = () => {
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const [font, setFont] = useState(selectedLayer.content.font);
  const [search, setSearch] = useState("");
  const [filteredFonts, setFilteredFonts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      selectedLayer.content.type === "text" &&
      selectedLayer.content.font !== font
    )
      setFont(selectedLayer.content.font);
  }, [selectedLayer, font]);

  // useEffect(() => {
  //   if (selectedLayer.content.font !== font) {
  //     setFont(selectedLayer.content.font);
  //   }
  // }, [selectedLayer, font]);

  useEffect(() => {
    if (selectedLayer.id && font !== selectedLayer.content.font) {
      const data = { font: font };
      dispatch(updateLayer({ id: selectedLayer.id, data }));
    }
  }, [selectedLayer.id, font, dispatch]);

  const { fonts, loading } = useFonts();

  useEffect(() => {
    setFilteredFonts(
      fonts.filter((fontOption) =>
        fontOption.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, fonts]);

  const updateObjectFill = (selectedFont) => {
    setFont(selectedFont);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <div className="relative h-full">
        <h4 className="py-2">Font</h4>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search fonts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="font-list overflow-y-auto p-2 border border-gray-300 rounded h-[calc(100%-80px)]">
          {filteredFonts.map((fontOption, index) => (
            <div
              key={index}
              className="font-item cursor-pointer p-2 hover:bg-gray-200"
              style={{ fontFamily: fontOption.name }}
              onClick={() => updateObjectFill(fontOption.name)}>
              {fontOption.name}
            </div>
          ))}
        </div>
        <input
          type="text"
          className="w-12 h-12 appearance-none bg-transparent border-0 cursor-pointer p-0"
          onChange={(e) => updateObjectFill(e.target.value)}
        />
        <div className="absolute text-white top-[44px] left-[16px] text-[26px] cursor-pointer">
          +
        </div>
      </div>
    </div>
  );
};

export default TextFonts;
