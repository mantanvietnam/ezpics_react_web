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
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { updateDesign } from "@/api/design";

import "@/styles/newloading.css";
import Image from "next/image";

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
  const params = useParams();
  const { designId } = params;
  const idProduct = designId;
  const network = useAppSelector((state) => state.network.ipv4Address);
  const stageData = useSelector((state) => state.stage.stageData);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sessPrice, setsessPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [typeUser, setTypeUser] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDisplay, setSelectedOptionDisplay] = useState(null);
  const [selectedOptionShow, setSelectedOptionShow] = useState(null);
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
          setSelectedOption(response.data.data.display);
          setListWarehouse(response.data.data.listWarehouse);
          setCheckedItems(response.data.data.listWarehouse);
          setTypeUser(response.data.data.type);
          setSelectedOptionDisplay(response.data.data.status);
          setSelectedOptionShow(response.data.data.display ? 1 : 0)
        }
        console.log('🚀 ~ getData ~ response.data.data.display:', response.data.data.display)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const [state, setState] = useState({});

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

  console.log('🚀 ~ Customize ~ selectedOptionShow:', selectedOptionShow)

  useEffect(() => {
    if (stageData.design.status === 1) {
      setSelectedOptionDisplay(1)
    } else {
      setSelectedOptionDisplay(0)
    }
  }, [stageData])

  const handleSelectChange = (event) => {
    setCategoryId(event.target.value);
    handleChange("category_id", event.target.value);
  };

  const handleChange = (type, value) => {
    setState({ ...state, [type]: value });
  };

  const handleSelectChangeStatus = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectChangeStatusDisplay = (event) => {
    setSelectedOptionDisplay(event.target.value);
    handleChange("status", event.target.value);
  };

  const handleSelectChangeStatusShow = (event) => {
    setSelectedOptionShow(event.target.value);
    handleChange("display", event.target.value);
  };

  const optionsDisplay = [
    { value: 0, label: "Đang chỉnh sửa" },
    { value: 1, label: "Đã hoàn thành" },
  ];

  const optionsShow = [
    { value: 0, label: "Riêng tư" },
    { value: 1, label: "Công khai" },
  ];

  const categories = categoryList.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const optionsCategories = [
    { value: 0, label: "Chưa chọn categorie" },
    ...categories,
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
    console.log('🚀 ~ handleChangeInputFile ~ file:', file)
    if (!file || !/(png|jpg|jpeg)$/i.test(file.name)) {
      setSelectedFiles(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }
    setSelectedFiles(file);
    handleChange("thumbnail", file);
  };

  const handleSaveInformation = async () => {
    toast.info("Đang lưu mẫu thiết kế");

    if (!name) {
      toast.error("Vui lòng nhập tên thiết kế");
    } else {
      try {
        // Create FormData object to handle the file upload
        const formData = new FormData();

        // Append necessary fields to formData
        formData.append('token', checkTokenCookie());
        formData.append('idProduct', idProduct);

        // Append the file (thumbnail) if it exists in the state
        if (state.thumbnail) {
          formData.append('thumbnail', state.thumbnail);
        }

        // Append other fields from the state (excluding thumbnail)
        Object.keys(state).forEach((key) => {
          if (key !== 'thumbnail') {
            formData.append(key, state[key]);
          }
        });

        // Make the API call with formData
        const res = await updateDesign(formData);

        if (res.code === 1) {
          toast.success("Bạn đã lưu thông tin mẫu thiết kế thành công", {
            autoClose: 500,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  return (
    <Block className="absolute top-0 left-[108px] h-full w-[300px] pb-[65px] overflow-y-auto">
      <Block className="flex items-center justify-between p-4">
        <h4 className="font-semibold">Chỉnh sửa</h4>
      </Block>

      <ResizeTemplate />
      <div className="p-4">
        {/* <Block className="text-center pt-1">
          <p className="text-sm">1080 x 1920px</p>
        </Block> */}

        <Block className="mt-4 p-4 bg-gray-100 rounded border border-gray-300">
          <div className="font-medium">Màu nền</div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => handleChange("color", color)}
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
                onChange={(e) => {
                  setName(e.target.value);
                  handleChange("name", e.target.value);
                }}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block">Mô tả mẫu thiết kế</label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  handleChange("description", e.target.value);
                }}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {typeUser !== "user_edit" && (
              <>
                <div>
                  <label className="block">
                    Trạng thái chỉnh sửa
                  </label>
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
                <div>
                  <label className="block">
                    Chế độ hiển thị
                  </label>
                  <select
                    value={selectedOptionShow}
                    onChange={handleSelectChangeStatusShow}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {optionsShow.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Giá bán thị trường</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(parseInt(e.target.value));
                      handleChange("price", e.target.value);
                    }}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Giá bán</label>
                  <input
                    type="number"
                    value={sessPrice}
                    onChange={(e) => {
                      setsessPrice(parseInt(e.target.value));
                      handleChange("sale_price", e.target.value);
                    }}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Danh mục</label>
                  <select
                    value={categoryId}
                    onChange={handleSelectChange}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {optionsCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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

                {
                /* <div>
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
                </div> */}
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
              </>
            )}
            <Button
              onClick={handleSaveInformation}
              size={SIZE.compact}
              className="button-red">
              Lưu thông tin
            </Button>
          </div>
        </Block>
      </div>

      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            position: "absolute",
            zIndex: 20000000000,
            top: "-50px",
          }}>
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
            <div className="ldio-4qpid53rus92">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            <Image
              style={{
                position: "absolute",
                top: 30,
                left: 32,
                width: 40,
                height: 40,
                // alignSelf: 'center',
                zIndex: 999999,
              }}
              alt=""
              width={50}
              height={50}
              src="/images/EZPICS.png"
            />
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
