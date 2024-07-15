"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button, SIZE } from "baseui/button";
import { HexColorPicker } from "react-colorful";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { Plus } from "baseui/icon";
import { Input } from "baseui/input";
import { useEditor, useFrame } from "@layerhub-io/react";
import { Modal, ROLE } from "baseui/modal";
import { Block } from "baseui/block";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/Scrollable";
import { sampleFrames } from "@/constants/editor";
import Scrollbar from "@layerhub-io/react-custom-scrollbar";
import ezlogo from "./EZPICS (converted)-03.png";

import SwapHorizontal from "@/components/Icons/SwapHorizontal";
import { Tabs, Tab } from "baseui/tabs";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import "./Form.css";
import axios from "axios";
import "../../Preview/newloading.css";
import { useAppSelector } from "@/hooks/hook";
import { toast } from "react-toastify";

function checkTokenCookie() {
  var allCookies = document.cookie;

  var cookiesArray = allCookies.split("; ");

  var tokenCookie;
  for (var i = 0; i < cookiesArray.length; i++) {
    var cookie = cookiesArray[i];
    var cookieParts = cookie.split("=");
    var cookieName = cookieParts[0];
    var cookieValue = cookieParts[1];

    if (cookieName === "token") {
      tokenCookie = cookieValue;
      break;
    }
  }

  if (tokenCookie) {
    // console.log('Giá trị của cookie "token" là:', tokenCookie);
    return tokenCookie.replace(/^"|"$/g, "");
  } else {
    console.log('Không tìm thấy cookie có tên là "token"');
  }
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

interface State {
  backgroundColor: string;
}
interface CheckedItems {
  [key: string]: boolean;
}
export default function Customize() {
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const idProduct = useAppSelector((state) => state.token.id);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sessPrice, setsessPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [typeUser, setTypeUser] = useState("");
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDisplay, setSelectedOptionDisplay] = useState("");

  const [selectedFilesBackground, setSelectedFilesBackground] =
    useState<File | null>(null);
  const [selectedOptionStorage, setSelectedOptionStorage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File | null>(null);
  const [selectedFilesSecond, setSelectedFilesSecond] =
    useState<FileList | null>(null);
  const [listWarehouse, setListWarehouse] = useState<any>([]);
  const [display, setDisplay] = useState<any>(false);

  const [dataStorage, setDataStorage] = useState<any>([]);
  const token = checkTokenCookie();
  const [checkedItems, setCheckedItems] = useState<any[]>([]);

  // Hàm xử lý sự kiện khi checkbox thay đổi trạng thái
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    console.log(id, !checked);
    setCheckedItems((prev) => {
      if (checked) {
        // If checked, add the ID to the array
        console.log([...prev, parseInt(id)]);
        return [...prev, parseInt(id)];
      } else {
        return prev.filter((item) => item !== parseInt(id));
      }
    });
  };
  useEffect(() => {
    const getDataCategory = async () => {
      const response = await axios.get(`${network}/getProductCategoryAPI`);
      if (response.data) {
        setCategoryList(response.data.listData);
        console.log(response.data.listData);
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
          setSelectedOptionStorage(response.data.data.id);
          setListWarehouse(response.data.data.listWarehouse);
          setCheckedItems(response.data.data.listWarehouse);
          setTypeUser(response.data.data.type);
          setDisplay(response.data?.data?.display);
          setSelectedOptionDisplay(response.data?.data?.display ? "1" : "0");
          console.log(response.data?.data?.display);
          // https://apis.ezpics.vn/apis/getInfoProductAPI
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      console.log(listWarehouse);
    };
    getData();
  }, []);

  const [state, setState] = React.useState<State>({
    backgroundColor: "#000000",
  });

  const changeBackgroundColor = (color: string) => {
    if (editor) {
      editor.frame.setBackgroundColor(color);
    }
  };
  useEffect(() => {
    const getDataStorage = async () => {
      const response = await axios.post(
        `${network}/getListWarehouseDesignerAPI`,
        {
          token: token,
        }
      );
      if (response.data) {
        setDataStorage(response.data.data);
      }
    };
    getDataStorage();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10); // Chuyển đổi giá trị sang kiểu number với cơ số 10
    if (!isNaN(value)) {
      // Kiểm tra nếu giá trị chuyển đổi hợp lệ
      setCategoryId(value);
    }
  };

  const handleChange = (type: string, value: any) => {
    setState({ ...state, [type]: value });
    changeBackgroundColor(value);
  };
  const handleSelectChangeStatus = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
  };
  const handleSelectChangeStatusDisplay = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionDisplay(event.target.value);
    console.log(event.target.value);
  };

  const handleSelectChangeStatusStorage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOptionStorage(event.target.value);
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
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const inputFileRefThumn = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSecondFile, setSelectedSecondFile] = useState(null);

  const handleInputFileRefClickBackground = () => {
    inputFileRef.current?.click();
  };
  const handleInputFileRefClickThumn = () => {
    inputFileRefThumn.current?.click();
  };
  const handleChangeInputFileBackground = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files!;
    const file: File = files[0];

    if (!file) {
      setSelectedFilesBackground(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }

    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      setSelectedFilesBackground(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
    } else {
      setSelectedFilesBackground(file);
    }
  };
  const handleChangeInputFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files!;
    const file: File = files[0];

    if (!file) {
      setSelectedFiles(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }

    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      setSelectedFiles(null);
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
    } else {
      setSelectedFiles(file);
    }
  };

  const handleSaveInformation = async () => {
    console.log(checkedItems.join(","));
    if (typeUser !== "user_edit") {
      if (name === "") {
        toast.error("Bạn hãy nhập đầy đủ thông tin", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(categoryId);
      } else {
        if (price === 0 || sessPrice === 0) {
          setLoading(true);

          try {
            const formData = new FormData();
            if (selectedFilesBackground) {
              formData.append("background", selectedFilesBackground);
            }

            if (selectedFiles) {
              formData.append("thumbnail", selectedFiles);
            }
            formData.append("name", name);
            formData.append("sale_price", price.toString());
            formData.append("price", sessPrice.toString());
            formData.append("category_id", categoryId.toString());
            formData.append("warehouse_id", checkedItems.join(","));
            formData.append("status", selectedOption === "1" ? "1" : "0");
            formData.append(
              "display",
              selectedOptionDisplay !== "1" ? "0" : "1"
            );
            formData.append("description", description);
            if (token) {
              formData.append("token", token);
            }

            formData.append("idProduct", idProduct.toString());

            const response = await axios.post(
              `${network}/updateProductAPI`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.data) {
              console.log(response.data);
              setLoading(false);
              toast("Lưu thông tin mẫu thiết kế thành công !! 🦄", {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
          } catch (error) {
            console.log(error);
            toast.error("Lỗi khi lưu thông tin mẫu thiết kế", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setLoading(false);
          }
        } else {
          setLoading(true);

          try {
            const formData = new FormData();
            if (selectedFiles) {
              formData.append("background", selectedFiles);
            }

            if (selectedFilesBackground) {
              formData.append("thumbnail", selectedFilesBackground);
            }
            console.log(selectedOption);
            formData.append("name", name);
            formData.append("sale_price", price.toString());
            formData.append("price", sessPrice.toString());
            formData.append("category_id", categoryId.toString());
            formData.append("warehouse_id", checkedItems.join(","));
            formData.append("status", selectedOption === "1" ? "1" : "0");
            formData.append("description", description);
            if (token) {
              formData.append("token", token);
            }
            formData.append("idProduct", idProduct.toString());

            const response = await axios.post(
              `${network}/updateProductAPI`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.data) {
              console.log(response.data);
              setLoading(false);
              toast("Lưu thông tin mẫu thiết kế thành công !! 🦄", {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
          } catch (error) {
            console.log(error);
            toast.error("Lỗi khi lưu thông tin mẫu thiết kế", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setLoading(false);
          }
        }
      }
    } else {
      if (name === "") {
        toast.error("Bạn hãy nhập đầy đủ thông tin", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(categoryId);
      } else {
        setLoading(true);

        try {
          const formData = new FormData();

          if (token) {
            formData.append("name", name);
            formData.append("description", description);
            formData.append("token", token);
          }

          const response = await axios.post(
            `${network}/updateProductAPI`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data) {
            console.log(response.data);
            setLoading(false);
            toast("Lưu thông tin mẫu thiết kế thành công !! 🦄", {
              position: "top-left",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Lỗi khi lưu thông tin mẫu thiết kế", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setLoading(false);
        }
      }
    }
  };

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}>
        <Block>
          <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            Chỉnh sửa
          </h4>
        </Block>

        <Block
          onClick={() => setIsSidebarOpen(false)}
          $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          <Block>
            <ResizeTemplate />
            <Block
              $style={{
                fontSize: "14px",
                textAlign: "center",
                paddingTop: "0.35rem",
              }}>
              1080 x 1920px
            </Block>
          </Block>

          <Block paddingTop={"0.5rem"}>
            <div
              style={{
                background: "#fafafa",
                borderRadius: "8px",
                border: "1px solid #ececf5",
                padding: "0.45rem 1rem",
                fontSize: "14px",
              }}>
              <div>Màu nền</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                  paddingTop: "0.25rem",
                }}>
                {/* <StatefulPopover
                  placement={PLACEMENT.bottomLeft}
                  content={
                    <div
                      style={{
                        padding: "1rem",
                        background: "#ffffff",
                        width: "200px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <HexColorPicker
                        onChange={(v) => handleChange("backgroundColor", v)}
                      />
                      <Input
                        overrides={{
                          Input: { style: { textAlign: "center" } },
                        }}
                        value={state.backgroundColor}
                        onChange={(e) =>
                          handleChange(
                            "backgroundColor",
                            (e.target as any).value
                          )
                        }
                        placeholder="#000000"
                        clearOnEscape
                      />
                    </div>
                  }
                  accessibilityType={"tooltip"}
                >
                  <div>
                    <div
                      style={{
                        height: "40px",
                        width: "40px",
                        backgroundSize: "100% 100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundImage:
                          'url("https://static.canva.com/web/images/788ee7a68293bd0264fc31f22c31e62d.png")',
                      }}
                    >
                      <div
                        style={{
                          height: "32px",
                          width: "32px",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                        }}
                      >
                        <Plus size={24} />
                      </div>
                    </div>
                  </div>
                </StatefulPopover> */}

                {colors.map((color) => (
                  <div
                    onClick={() => handleChange("backgroundColor", color)}
                    key={color}
                    style={{
                      background: color,
                      borderRadius: "4px",
                      border: "1px solid #d7d8e3",
                      height: "34px",
                      cursor: "pointer",
                    }}></div>
                ))}
              </div>
            </div>
          </Block>
          <Block paddingTop={"0.5rem"}>
            <div className="container">
              <div className="row">
                <h4 style={{ fontFamily: "Arial" }}>Thông tin thiết kế</h4>
                <div className="input-group">
                  <p style={{ fontFamily: "Arial" }}>Tên thiết kế</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <p style={{ fontFamily: "Arial" }}>Mô tả mẫu thiết kế</p>

                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <p style={{ fontFamily: "Arial" }}>
                    Chế độ hiển thị lên thị trường
                  </p>
                  <select
                    value={selectedOptionDisplay}
                    onChange={handleSelectChangeStatusDisplay}
                    // onChange={(e) => console.log(e.target.value)}
                  >
                    {optionsDisplay.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {typeUser !== "user_edit" && (
                  <>
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Giá bán thị trường</p>

                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Giá bán</p>

                      <input
                        type="number"
                        value={sessPrice}
                        onChange={(e) => setsessPrice(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Danh mục</p>

                      <select
                        value={categoryId}
                        onChange={(e) => handleSelectChange(e)}>
                        {categoryList &&
                          categoryList.map((category: any) => (
                            <option
                              key={category.id}
                              value={category.id}
                              style={{ color: "black" }}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Ảnh nền</p>

                      <input
                        onChange={(e) => handleChangeInputFile(e)}
                        type="file"
                        id="file"
                        ref={inputFileRef}
                        style={{}}
                      />
                      {/* onChange={changeHandler} */}
                    </div>
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Ảnh minh họa</p>

                      <input
                        onChange={(e) => handleChangeInputFileBackground(e)}
                        type="file"
                        id="file"
                        ref={inputFileRefThumn}
                        style={{}}
                      />
                      {/* onChange={changeHandler} */}
                    </div>
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Trạng thái</p>

                      <select
                        value={selectedOption}
                        onChange={handleSelectChangeStatus}>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="input-group">
                  <p style={{ fontFamily: "Arial" }}>Chọn kho thiết kế</p>

                  <select
                    value={selectedOptionStorage}
                    onChange={handleSelectChangeStatusStorage}
                  >
                    {dataStorage &&
                      dataStorage.map((option: any) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}

                  </select> */}
                    <div className="input-group">
                      <p style={{ fontFamily: "Arial" }}>Bộ sưu tập</p>

                      {dataStorage &&
                        dataStorage.map((item: any, index: any) => (
                          <div key={item.id} style={{ marginBottom: "15px" }}>
                            <input
                              type="checkbox"
                              id={`${item.id}`}
                              checked={checkedItems.includes(item.id)}
                              onChange={handleCheckboxChange}
                            />
                            <label
                              htmlFor={`${item.id}`}
                              style={{ marginTop: "10px" }}>
                              {item.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </>
                )}
                {/* </div> */}

                <Button
                  onClick={() => handleSaveInformation()}
                  size={SIZE.compact}
                  overrides={{
                    Root: {
                      style: {
                        width: "100%",
                        marginBottom: "30px",
                      },
                    },
                  }}>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </Block>
        </Block>
      </Scrollable>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "absolute",
            zIndex: 20000000000,
          }}>
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld">
            <div className="ldio-4qpid53rus9">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            <img
              style={{
                position: "absolute",
                top: "12%",
                left: "16%",
                width: 40,
                height: 40,
              }}
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
  const [activeKey, setActiveKey] = React.useState<string | number>("0");
  const { currentDesign, setCurrentDesign } = useDesignEditorContext();
  const editor = useEditor();
  const [desiredFrame, setDesiredFrame] = React.useState({
    width: 0,
    height: 0,
  });
  const [selectedFrame, setSelectedFrame] = React.useState<any>({
    id: 0,
    width: 0,
    height: 0,
  });
  const frame = useFrame();

  React.useEffect(() => {
    if (frame) {
      setDesiredFrame({
        width: frame.width,
        height: frame.height,
      });
    }
  }, [frame]);

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
  // const isEnabled =
  //   // @ts-ignore
  //   activeKey === "0" &&
  //   selectedFrame.id !== 0 &&
  //   // @ts-ignore
  //   activeKey === "1" &&
  //   !!parseInt(desiredFrame?.width) &&
  //   !!parseInt(desiredFrame?.height);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size={SIZE.compact}
        overrides={{
          Root: {
            style: {
              width: "100%",
            },
          },
        }}>
        Chỉnh kích thước
      </Button>
      <Modal
        onClose={() => setIsOpen(false)}
        closeable={true}
        isOpen={isOpen}
        animate
        autoFocus
        size={"auto"}
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: {
              borderTopRightRadius: "8px",
              borderEndStartRadius: "8px",
              borderEndEndRadius: "8px",
              borderStartEndRadius: "8px",
              borderStartStartRadius: "8px",
            },
          },
        }}>
        <Block $style={{ padding: "0 1.5rem", width: "640px" }}>
          <Block
            $style={{
              padding: "2rem 1rem 1rem",
              textAlign: "center",
              fontWeight: 500,
            }}>
            Chọn kích thước bạn muốn chỉnh
          </Block>
          <Tabs
            overrides={{
              TabContent: {
                style: {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
              },
              TabBar: {
                style: {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                },
              },
            }}
            activeKey={activeKey}
            onChange={({ activeKey }) => {
              setActiveKey(activeKey as string | number);
            }}>
            <Tab title="Kích thước chọn">
              <Block $style={{ width: "100%", height: "400px" }}>
                <Scrollbar>
                  <Block
                    $style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                    }}>
                    {sampleFrames.map((sampleFrame, index) => (
                      <Block
                        onClick={() => setSelectedFrame(sampleFrame)}
                        $style={{
                          padding: "0.5rem",
                          backgroundColor:
                            selectedFrame.id === sampleFrame.id
                              ? "rgb(243,244,245)"
                              : "#ffffff",
                          ":hover": {
                            backgroundColor: "rgb(246,247,248)",
                            cursor: "pointer",
                          },
                        }}
                        key={index}>
                        <Block
                          $style={{
                            height: "120px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <img
                            src={sampleFrame.preview}
                            style={{
                              width: "100%",
                              height: "100%",
                              resize: "block",
                            }}
                          />
                        </Block>
                        <Block
                          $style={{ fontSize: "13px", textAlign: "center" }}>
                          <Block $style={{ fontWeight: 500 }}>
                            {sampleFrame.name}
                          </Block>
                          <Block $style={{ color: "rgb(119,119,119)" }}>
                            {sampleFrame.width} x {sampleFrame.height}px
                          </Block>
                        </Block>
                      </Block>
                    ))}
                  </Block>
                </Scrollbar>
              </Block>
            </Tab>
            <Tab title="Kích thước tự chỉnh">
              <Block $style={{ padding: "2rem 2rem" }}>
                <Block
                  $style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 50px 1fr",
                    alignItems: "end",
                    fontSize: "14px",
                  }}>
                  <Input
                    onChange={(e: any) =>
                      setDesiredFrame({
                        ...desiredFrame,
                        width: e.target.value,
                      })
                    }
                    value={desiredFrame.width}
                    startEnhancer="W"
                    size={SIZE.compact}
                  />
                  <Button
                    overrides={{
                      Root: {
                        style: {
                          height: "32px",
                        },
                      },
                    }}
                    size={SIZE.compact}
                    kind="tertiary"
                    onClick={() =>
                      setDesiredFrame({
                        height: desiredFrame.width,
                        width: desiredFrame.height,
                      })
                    }>
                    <SwapHorizontal size={24} />
                  </Button>
                  <Input
                    onChange={(e: any) =>
                      setDesiredFrame({
                        ...desiredFrame,
                        height: e.target.value,
                      })
                    }
                    value={desiredFrame.height}
                    startEnhancer="H"
                    size={SIZE.compact}
                  />
                </Block>
              </Block>
            </Tab>
          </Tabs>
        </Block>
        <Block
          $style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "2rem",
          }}>
          <Button onClick={applyResize} style={{ width: "190px" }}>
            Chọn
          </Button>
        </Block>
      </Modal>
    </>
  );
}
