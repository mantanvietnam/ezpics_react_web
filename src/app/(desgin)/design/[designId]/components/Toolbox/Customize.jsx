"use client";
import React, { useState, useEffect } from "react";
import { Button, SIZE } from "baseui/button";
import { Input } from "baseui/input";
import { Modal, ROLE } from "baseui/modal";
import { Block } from "baseui/block";

import { Tabs, Tab } from "baseui/tabs";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import { toast } from "react-toastify";

function checkTokenCookie() {
  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1].replace(/^"|"$/g, "") : null;
}

const colors = [
  "#ffffff",
  "#9B9B9B",
  "#4A4A4A",
  "#000000",
  "#A70C2C",
  "#DA9A15",
  "#F8E71D",
  "#47821A",
  "#4990E2",
];

export default function Customize() {
  const idProduct = useAppSelector((state) => state.token.id);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sessPrice, setsessPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [typeUser, setTypeUser] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDisplay, setSelectedOptionDisplay] = useState("");
  const [selectedFilesBackground, setSelectedFilesBackground] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [listWarehouse, setListWarehouse] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const token = checkTokenCookie();
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckedItems((prev) =>
      checked
        ? [...prev, parseInt(id)]
        : prev.filter((item) => item !== parseInt(id))
    );
  };

  useEffect(() => {
    const getDataCategory = async () => {
      const response = await axios.get(`${network}/getProductCategoryAPI`);
      if (response.data) {
        setCategoryList(response.data.listData);
      }
    };
    getDataCategory();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const response = await axios.post(`${network}/getInfoProductAPI`, {
          id: idProduct,
        });
        if (response.data && response.data.data) {
          setName(response.data.data.name);
          setDescription(response.data.data.description);
          setPrice(response.data.data.sale_price);
          setsessPrice(response.data.data.price);
          setCategoryId(response.data.data.category_id);
          setSelectedOption(response.data.data.status.toString());
          setListWarehouse(response.data.data.listWarehouse);
          setCheckedItems(response.data.data.listWarehouse);
          setTypeUser(response.data.data.type);
          setSelectedOptionDisplay(response.data?.data?.display ? "1" : "0");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const [state, setState] = useState({ backgroundColor: "#000000" });

  useEffect(() => {
    const getDataStorage = async () => {
      const response = await axios.post(
        `${network}/getListWarehouseDesignerAPI`,
        { token }
      );
      if (response.data) {
        setDataStorage(response.data.data);
      }
    };
    getDataStorage();
  }, []);

  const handleSelectChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleChange = (type, value) => {
    setState({ ...state, [type]: value });
    changeBackgroundColor(value);
  };

  const handleSelectChangeStatus = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectChangeStatusDisplay = (event) => {
    setSelectedOptionDisplay(event.target.value);
  };

  const options = [
    { value: "", label: "Chọn trạng thái" },
    { value: "0", label: "Đang chỉnh sửa" },
    { value: "1", label: "Đã hoàn thành" },
  ];

  const optionsDisplay = [
    { value: "", label: "Chọn trạng thái" },
    { value: "1", label: "Hiển thị" },
    { value: "0", label: "Ẩn đi" },
  ];

  const inputFileRef = React.useRef(null);
  const inputFileRefThumn = React.useRef(null);

  const handleChangeInputFileBackground = (event) => {
    const file = event?.target?.files[0];
    if (!file || !/(png|jpg|jpeg)$/i.test(file.name)) {
      setSelectedFilesBackground(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }
    setSelectedFilesBackground(file);
  };

  const handleChangeInputFile = (event) => {
    const file = event?.target?.files[0];
    if (!file || !/(png|jpg|jpeg)$/i.test(file.name)) {
      setSelectedFiles(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }
    setSelectedFiles(file);
  };

  const handleSaveInformation = async () => {
    if (name === "") {
      toast.error("Bạn hãy nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (selectedFiles) {
        formData.append("background", selectedFilesBackground);
      }
      if (selectedFilesBackground) {
        formData.append("thumbnail", selectedFiles);
      }
      formData.append("name", name);
      formData.append("sale_price", price.toString());
      formData.append("price", sessPrice.toString());
      formData.append("category_id", categoryId.toString());
      formData.append("warehouse_id", checkedItems.join(","));
      formData.append("status", selectedOption === "1" ? 1 : 0);
      formData.append("display", selectedOptionDisplay !== "1" ? 0 : 1);
      formData.append("description", description);
      formData.append("token", token);
      formData.append("idProduct", idProduct.toString());

      const response = await axios.post(
        `${network}/updateProductAPI`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data) {
        toast("Lưu thông tin mẫu thiết kế thành công !! 🦄");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu thông tin mẫu thiết kế");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Block className="absolute top-0 left-[108px] h-full w-[300px] pb-[65px] overflow-y-auto">
      <Block className="flex items-center justify-between p-4">
        <h4 className="font-semibold">Chỉnh sửa</h4>
      </Block>

      <ResizeTemplate />
      <div className="p-4">
        <Block className="text-center pt-1">
          <p className="text-sm">1080 x 1920px</p>
        </Block>

        <Block className="mt-4 p-4 bg-gray-100 rounded border border-gray-300">
          <div className="font-medium">Màu nền</div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => handleChange("backgroundColor", color)}
                className={`h-9 rounded border border-gray-400 cursor-pointer`}
                style={{ background: color }}
              />
            ))}
          </div>
        </Block>

        <Block className="mt-4">
          <h4 className="font-semibold">Thông tin thiết kế</h4>
          <div className="space-y-4">
            <div>
              <label className="block">Tên thiết kế</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block">Mô tả mẫu thiết kế</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block">Chế độ hiển thị lên thị trường</label>
              <select
                value={selectedOptionDisplay}
                onChange={handleSelectChangeStatusDisplay}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {optionsDisplay.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {typeUser !== "user_edit" && (
              <>
                <div>
                  <label className="block">Giá bán thị trường</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Giá bán</label>
                  <input
                    type="number"
                    value={sessPrice}
                    onChange={(e) => setsessPrice(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Danh mục</label>
                  <select
                    value={categoryId}
                    onChange={handleSelectChange}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {categoryList.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Ảnh nền</label>
                  <input
                    onChange={handleChangeInputFile}
                    type="file"
                    ref={inputFileRef}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Ảnh minh họa</label>
                  <input
                    onChange={handleChangeInputFileBackground}
                    type="file"
                    ref={inputFileRefThumn}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Trạng thái</label>
                  <select
                    value={selectedOption}
                    onChange={handleSelectChangeStatus}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Bộ sưu tập</label>
                  {dataStorage?.map((item) => (
                    <div key={item.id} className="mb-2">
                      <input
                        type="checkbox"
                        id={`${item.id}`}
                        checked={checkedItems.includes(item.id)}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor={`${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSaveInformation}
                  size={SIZE.compact}
                  className="button-red">
                  Lưu thông tin
                </Button>
              </>
            )}
          </div>
        </Block>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50">
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld">
            <div className="ldio-4qpid53rus9">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Block>
  );
}

function ResizeTemplate() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState("0");
  const [desiredFrame, setDesiredFrame] = React.useState({
    width: 0,
    height: 0,
  });
  const [selectedFrame, setSelectedFrame] = React.useState({
    id: 0,
    width: 0,
    height: 0,
  });

  const applyResize = () => {
    // @ts-ignore
    const size = activeKey === "0" ? selectedFrame : desiredFrame;
    if (editor) {
      editor.frame.resize({
        width: parseInt(size.width),
        height: parseInt(size.height),
      });
      setCurrentDesign({
        ...currentDesign,
        frame: {
          width: parseInt(size.width),
          height: parseInt(size.height),
        },
      });
    }
    setIsOpen(false);
  };

  return (
    // <>
    //   <Button
    //     onClick={() => setIsOpen(true)}
    //     size={SIZE.compact}
    //     overrides={{
    //       Root: {
    //         style: {
    //           width: "100%",
    //         },
    //       },
    //     }}
    //   >
    //     Chỉnh kích thước
    //   </Button>
    //   <Modal
    //     onClose={() => setIsOpen(false)}
    //     closeable={true}
    //     isOpen={isOpen}
    //     animate
    //     autoFocus
    //     size={"auto"}
    //     role={ROLE.dialog}
    //     overrides={{
    //       Dialog: {
    //         style: {
    //           borderTopRightRadius: "8px",
    //           borderEndStartRadius: "8px",
    //           borderEndEndRadius: "8px",
    //           borderStartEndRadius: "8px",
    //           borderStartStartRadius: "8px",
    //         },
    //       },
    //     }}
    //   >
    //     <Block $style={{ padding: "0 1.5rem", width: "640px" }}>
    //       <Block
    //         $style={{
    //           padding: "2rem 1rem 1rem",
    //           textAlign: "center",
    //           fontWeight: 500,
    //         }}
    //       >
    //         Chọn kích thước bạn muốn chỉnh
    //       </Block>
    //       <Tabs
    //         overrides={{
    //           TabContent: {
    //             style: {
    //               paddingLeft: 0,
    //               paddingRight: 0,
    //             },
    //           },
    //           TabBar: {
    //             style: {
    //               alignItems: "center",
    //               display: "flex",
    //               justifyContent: "center",
    //               backgroundColor: "#ffffff",
    //             },
    //           },
    //         }}
    //         activeKey={activeKey}
    //         onChange={({ activeKey }) => {
    //           setActiveKey(activeKey);
    //         }}
    //       >
    //         <Tab title="Kích thước chọn">
    //           <Block $style={{ width: "100%", height: "400px" }}>
    //             <div>
    //               <Block
    //                 $style={{
    //                   display: "grid",
    //                   gridTemplateColumns: "1fr 1fr 1fr",
    //                 }}
    //               >
    //                 {/* {sampleFrames?.map((sampleFrame, index) => (
    //                   <Block
    //                     onClick={() => setSelectedFrame(sampleFrame)}
    //                     $style={{
    //                       padding: "0.5rem",
    //                       backgroundColor:
    //                         selectedFrame.id === sampleFrame.id
    //                           ? "rgb(243,244,245)"
    //                           : "#ffffff",
    //                       ":hover": {
    //                         backgroundColor: "rgb(246,247,248)",
    //                         cursor: "pointer",
    //                       },
    //                     }}
    //                     key={index}
    //                   >
    //                     <Block
    //                       $style={{
    //                         height: "120px",
    //                         display: "flex",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                       }}
    //                     >
    //                       <img
    //                         src={sampleFrame.preview}
    //                         style={{
    //                           width: "100%",
    //                           height: "100%",
    //                           resize: "block",
    //                         }}
    //                       />
    //                     </Block>
    //                     <Block
    //                       $style={{ fontSize: "13px", textAlign: "center" }}
    //                     >
    //                       <Block $style={{ fontWeight: 500 }}>
    //                         {sampleFrame.name}
    //                       </Block>
    //                       <Block $style={{ color: "rgb(119,119,119)" }}>
    //                         {sampleFrame.width} x {sampleFrame.height}px
    //                       </Block>
    //                     </Block>
    //                   </Block>
    //                 ))} */}
    //               </Block>
    //             </div>
    //           </Block>
    //         </Tab>
    //         <Tab title="Kích thước tự chỉnh">
    //           <Block $style={{ padding: "2rem 2rem" }}>
    //             <Block
    //               $style={{
    //                 display: "grid",
    //                 gridTemplateColumns: "1fr 50px 1fr",
    //                 alignItems: "end",
    //                 fontSize: "14px",
    //               }}
    //             >
    //               <Input
    //                 onChange={(e) =>
    //                   setDesiredFrame({
    //                     ...desiredFrame,
    //                     width: e.target.value,
    //                   })
    //                 }
    //                 value={desiredFrame.width}
    //                 startEnhancer="W"
    //                 size={SIZE.compact}
    //               />
    //               <Button
    //                 overrides={{
    //                   Root: {
    //                     style: {
    //                       height: "32px",
    //                     },
    //                   },
    //                 }}
    //                 size={SIZE.compact}
    //                 kind="tertiary"
    //                 onClick={() =>
    //                   setDesiredFrame({
    //                     height: desiredFrame.width,
    //                     width: desiredFrame.height,
    //                   })
    //                 }
    //               >
    //               </Button>
    //               <Input
    //                 onChange={(e) =>
    //                   setDesiredFrame({
    //                     ...desiredFrame,
    //                     height: e.target.value,
    //                   })
    //                 }
    //                 value={desiredFrame.height}
    //                 startEnhancer="H"
    //                 size={SIZE.compact}
    //               />
    //             </Block>
    //           </Block>
    //         </Tab>
    //       </Tabs>
    //     </Block>
    //     <Block
    //       $style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //         paddingBottom: "2rem",
    //       }}
    //     >
    //       <Button onClick={applyResize} style={{ width: "190px" }}>
    //         Chọn
    //       </Button>
    //     </Block>
    //   </Modal>
    // </>
    <div></div>
  );
}
