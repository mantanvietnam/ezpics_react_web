import { checkFavoriteAPI, deleteFavoriteAPI, saveFavoriteAPI } from "@/api/product";
import { checkAvailableLogin, checkTokenCookie } from "@/utils";
import { capitalizeFirstLetter } from "@/utils/format";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Skeleton, Space, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Share_Social from "./Share_Social";
import { SkeletonCustom } from "./Slide/CustomSlide";
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function ProductInfoPrinted(props) {
  const { data, user, isLoading, dataLayer, id_param } = props;
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [previews, setPreviews] = useState({});
  const [previewsImageAfter, setPreviewsImageAfter] = useState();
  const [checkModalContent, setCheckModalContent] = useState(false)
  const [loadingCreateImg, setLoadingCreateImg] = useState(false)
  const handleInputChange = (e, index) => {
    const variableLabel = dataFilter[index]?.content?.variableLabel;
    setInputValues((prevValues) => ({
      ...prevValues,
      [variableLabel]: e.target.value,
    }));
  };

  const handleFileInputChange = (e, index) => {
    const variableLabel = dataFilter[index]?.content?.variableLabel;
    const file = e.target.files[0];

    if (file) {
      // Lưu file gốc vào inputValues
      setInputValues((prevValues) => ({
        ...prevValues,
        [variableLabel]: file,
      }));

      // Tạo preview URL chỉ để hiển thị
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prevPreviews) => ({
        ...prevPreviews,
        [variableLabel]: previewUrl,
      }));
    }
  };

  const handleRemoveImage = (variableLabel) => {
    // Xóa file khỏi inputValues
    setInputValues((prevValues) => {
      const newValues = { ...prevValues };
      delete newValues[variableLabel];
      return newValues;
    });

    // Xóa preview và giải phóng bộ nhớ
    setPreviews((prevPreviews) => {
      const newPreviews = { ...prevPreviews };
      if (newPreviews[variableLabel]) {
        URL.revokeObjectURL(newPreviews[variableLabel]);
        delete newPreviews[variableLabel];
      }
      return newPreviews;
    });
  };
  const showModal = async () => {
    setIsModalOpen(true);
    const dataPrint = dataLayer.filter((layer) => {
      return (
        layer?.content?.variable !== "" &&
        layer?.content?.variableLabel !== ""
      );
    });
    if (dataPrint) {
      setDataFilter(dataPrint);
    }
  };
  const handleClickNavigate = async () => {
    try {
      setLoadingCreateImg(true)
      const filteredInputValues = Object.fromEntries(
        Object.entries(inputValues).filter(([_, value]) => value !== "")
      );
      console.log(filteredInputValues);
      // const response = await createImageSeriesAPI({ idProduct: id_param, full_name: filteredInputValues["Họ tên"], avatar: previews })
      // if (response) {
      //   setPreviewsImageAfter(response.data?.dataImage);
      //   setCheckModalContent(true)
      //   setLoadingCreateImg(false)
      // }
    } catch (error) {
      console.error("Error during processing:", error);
    } finally {
      setLoadingCreateImg(false)
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setInputValues({});
    setPreviews({});
    Object.values(previews).forEach(url => {
      URL.revokeObjectURL(url);
    });
  };
  const isAuthenticated = checkAvailableLogin();

  const [loadingFavorite, setLoadingFavorite] = useState(true)
  const [isFavorited, setIsFavorited] = useState(0)
  const handleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/sign-in')
    } else {
      if (isFavorited === 1) {
        try {
          setLoadingFavorite(true)
          await deleteFavoriteAPI({
            product_id: data.id,
            token: checkTokenCookie()
          })
          setIsFavorited(0)
          toast.success('Xóa khỏi danh sách yêu thích')
          setLoadingFavorite(false)
        } catch (error) {
          console.log(error)
          setLoadingFavorite(false)
          toast.error('Vui lòng thử lại!')
        }
      } else {
        try {
          setLoadingFavorite(true)
          await saveFavoriteAPI({
            product_id: data.id,
            token: checkTokenCookie()
          })
          toast.success('Thêm vào danh sách yêu thích')
          setIsFavorited(1)
          setLoadingFavorite(false)
        } catch (error) {
          console.log(error)
          setLoadingFavorite(false)
          toast.error('Vui lòng thử lại!')
        }

      }
    }
  }
  useEffect(() => {
    const checkFavorited = async () => {
      setLoadingFavorite(true)
      if (data && data.id) {
        const response = await checkFavoriteAPI({
          product_id: data.id,
          token: checkTokenCookie()
        })
        setIsFavorited(response.code)
        setLoadingFavorite(false)
      }
    }
    checkFavorited()
  }, [data])
  return (
    <div className="flex flex-col xl:flex-row w-full h-full mt-[100px] gap-8">
      <div className="xl:w-[50%] w-full h-full flex flex-col items-center justify-center gap-8">
        {isLoading ? (
          <SkeletonCustom>
            <Skeleton.Image
              className="w-full h-[100%] flex items-center justify-center"
              active="true"
            />
          </SkeletonCustom>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              className="object-contain h-[100%]"
              src={data?.image}
              alt="product"
            />
          </div>
        )}
        <div className="flex items-center w-[100%] justify-around">
          {isLoading ? (
            <Skeleton.Input active="true" />
          ) : (
            <Share_Social id_param={id_param} data_image={data?.image} />
          )}
          {isLoading ? (
            <Skeleton.Input active="true" />
          ) : (
            <div className="flex items-center justify-center gap-1 border-l-2 border-slate-300 pl-1">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 25,
                  height: 25,
                  borderRadius: "50%",
                  fill: "currentColor",
                }}>
                <path
                  d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                  style={{
                    color: "rgb(255, 66, 78)",
                  }}></path>
              </svg>
              <span className="text-sm font-semibold">
                Đã thích ({data?.favorites || 0})
              </span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-5">
          <Skeleton.Input active />
          <Skeleton.Input active />
          <Skeleton.Input active />
          <Skeleton.Input active />
          <div className="flex gap-5">
            <Skeleton.Input active />
            <Skeleton.Input active />
          </div>
        </div>
      ) : (
        <div className="flex xl:w-1/2 w-full h-full flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/crown.svg" alt="" />
            <span className="text-xl font-semibold">{data?.name}</span>
          </div>
          <div className="flex items-center gap-5 bg-slate-100 p-5">
            <div className="text-3xl text-red-500">
              {data?.sale_price ? VND.format(data?.sale_price) : "Miễn Phí"}
            </div>
            <div className="line-through text-slate-400 rounded-sm">
              {data?.price ? VND.format(data?.sale_price) : ""}
            </div>
            <div className="bg-red-500 text-white p-2 font-semibold rounded-sm">
              {data?.sale_price
                ? `Giảm ${100 - (data?.sale_price / data?.price) * 100}%`
                : "Miễn Phí"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm product-details-e">Lượt Tạo :</div>
            <div>
              {data?.sale_price
                ? `Lên đến ${100 - (data?.sale_price / data?.price) * 100}%`
                : "Miễn Phí"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="product-details-e">Tác giả</div>
            <div className="w-[35px] h-[35px]">
              <img
                className="object-cover rounded-full"
                src={user?.avatar}
                alt=""
              />
            </div>
            <div>
              <span>{data?.author}</span>
            </div>
          </div>
          {data?.color && <div className="flex items-center gap-3">
            <div className="product-details-e">Màu chủ đạo</div>
            <div
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: `${data?.color}`,
              }}></div>
          </div>}
          <div className="flex items-center gap-3">
            <div className="product-details-e">Lượt xem:</div>
            <div>
              <span>{data?.views}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              style={{
                backgroundColor: "rgb(255, 245, 241)",
                border: "1px solid rgb(255, 66, 78)",
                color: "rgb(255, 66, 78)",
                width: "200px",
                cursor: "pointer",
                animation:
                  "2s linear 0s infinite normal none running thumbs-up",
              }}
              className="flex items-center justify-center py-2"
              onClick={handleFavorite}
            >
              {
                isFavorited === 1 ? (
                  <>
                    {
                      loadingFavorite ? <div><Space>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 30, color: "rgb(255, 66, 78)" }} spin />} />
                      </Space></div> :
                        <>
                          <svg
                            style={{
                              color: "rgb(255, 66, 78)",
                              width: "30px",
                              height: "30px",
                              fill: "currentColor",
                            }}>
                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                          </svg>
                          <div>Đã yêu thích</div>
                        </>
                    }
                  </>
                ) :
                  (<>
                    {
                      loadingFavorite ? <div><Space>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 30, color: "rgb(255, 66, 78)" }} spin />} />
                      </Space></div> :
                        <>
                          <svg
                            style={{
                              color: "rgb(255, 66, 78)",
                              width: "30px",
                              height: "30px",
                              fill: "currentColor",
                            }}>
                            <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                          </svg>
                          <div>Thêm vào yêu thích</div>
                        </>
                    }
                  </>)
              }
            </button>
            <button
              onClick={showModal}
              style={{
                backgroundColor: "rgb(255, 66, 78)",
                color: "white",
                cursor: "pointer",
                width: "200px",
                paddingTop: "11.5px",
                paddingBottom: "11.5px",
              }}>
              Tạo ảnh
            </button>
            <Modal open={isModalOpen} footer={false} closeIcon={false}>
              {!checkModalContent ? <>
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: "bold",
                    paddingBottom: "10px",
                    textAlign: "center"
                  }}
                >
                  Tạo ảnh hàng loạt
                </p>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    padding: "20px",
                    gap: "20px",
                  }}
                >
                  {dataFilter &&
                    dataFilter.map((data, index) => (
                      <div key={index} style={{ marginBottom: '20px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                          {capitalizeFirstLetter(data.content.variableLabel)}
                        </p>
                        {data.content.type === 'text' ? (
                          <input
                            value={inputValues[data.content.variableLabel] || ''}
                            onChange={(e) => handleInputChange(e, index)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              marginBottom: '10px',
                            }}
                          />
                        ) : (
                          <div>
                            <input
                              type="file"
                              style={{ display: 'none' }}
                              id={`fileInput-${index}`}
                              accept="image/*"
                              onChange={(e) => handleFileInputChange(e, index)}
                            />
                            <label htmlFor={`fileInput-${index}`}>
                              <button
                                type="button"
                                style={{
                                  height: '40px',
                                  width: '100%',
                                  color: 'white',
                                  backgroundColor: 'rgb(255, 66, 78)',
                                  border: 'none',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  fontSize: '14px',
                                }}
                                onClick={() => document.getElementById(`fileInput-${index}`).click()}
                              >
                                Chọn ảnh
                              </button>
                            </label>
                            <div
                              style={{
                                marginTop: '10px',
                                width: '100%',
                                height: '200px',
                                border: '1px dashed #ccc',
                                borderRadius: '5px',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                              }}
                            >
                              {previews[data.content.variableLabel] ? (
                                <>
                                  <img
                                    src={previews[data.content.variableLabel]}
                                    alt="Preview"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                      objectFit: 'contain',
                                    }}
                                  />
                                  <button
                                    onClick={() => handleRemoveImage(data.content.variableLabel)}
                                    style={{
                                      position: 'absolute',
                                      top: '5px',
                                      right: '5px',
                                      background: 'rgba(255, 255, 255, 0.7)',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '25px',
                                      height: '25px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    ×
                                  </button>
                                </>
                              ) : (
                                <p style={{ color: '#888', fontSize: '14px' }}>
                                  Ảnh minh họa sẽ hiển thị ở đây
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div style={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    style={{
                      height: 40,
                      alignSelf: "center",
                      textTransform: "none",
                      color: "black",
                      backgroundColor: "white",
                      marginTop: "40px",
                      width: "60%",
                      marginRight: 10,
                    }}
                    onClick={() => handleCancel()}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    style={{
                      height: 40,
                      alignSelf: "center",
                      textTransform: "none",
                      color: "white",
                      backgroundColor: "rgb(255, 66, 78)",
                      marginTop: "40px",
                      width: "100%",
                    }}
                    onClick={() => handleClickNavigate()}
                  >
                    {" "}
                    {loadingCreateImg ? <Spin indicator={<LoadingOutlined spin />} /> : 'Tạo ảnh'}
                  </Button>
                </div>
              </> : <>
                <div>
                  <div style={{ display: "flex", marginBottom: '16px' }}>
                    <Button
                      variant="contained"
                      size="medium"
                      style={{
                        height: 40,
                        alignSelf: "center",
                        textTransform: "none",
                        color: "white",
                        backgroundColor: "rgb(255, 66, 78)",
                        marginTop: "40px",
                        width: "100%",
                        marginRight: 10,
                      }}
                      onClick={() => handleCancel()}
                    >
                      Tải ảnh
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      style={{
                        height: 40,
                        alignSelf: "center",
                        textTransform: "none",
                        color: "white",
                        backgroundColor: "rgb(255, 66, 78)",
                        marginTop: "40px",
                        width: "100%",
                      }}
                      onClick={() => setCheckModalContent(false)}
                    >
                      {" "}
                      Nhập lại thông tin
                    </Button>
                  </div>
                  <img src={`data:image/png;base64,${previewsImageAfter}`} alt="" />
                </div>
              </>}
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
