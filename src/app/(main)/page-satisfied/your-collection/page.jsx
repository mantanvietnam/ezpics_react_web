"use client"

import { getListBuyWarehousesAPI } from "@/api/product";
import { checkTokenCookie } from "@/utils";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Your_collection = () => {
    const itemsPerRow = 3;
    const router = useRouter()
    const [dataForYou, setDataForYou] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getListBuyWarehousesAPI({
                    token: checkTokenCookie(),
                })
                console.log(response?.data);
                if (response && response?.code === 1) {
                    setDataForYou(response?.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        getData();
    }, []);
    return (
        <div style={{ paddingTop: "0px", display: "flex", flexWrap: "wrap", background: 'white' }}>
            {dataForYou?.length > 0 ? (
                dataForYou.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            flex: `0 0 calc(${100 / itemsPerRow.desktop}% - 16px)`,
                            marginBottom: "15px",
                            boxSizing: "border-box",
                            padding: "0 8px",
                            position: "relative",
                            maxWidth: 280,
                            marginTop: "2%",
                            marginRight: "1%",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                background: "#f0f0f0",
                                borderRadius: 10,
                                overflow: "hidden",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                router.push(`/collection-buying/${item.id}`);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            <img
                                src={item.thumbnail}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                height: 70,
                                maxWidth: "100%",
                                color: "rgb(37, 38, 56)",
                                fontFamily:
                                    "Canva Sans, Noto Sans Variable, Noto Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
                                fontWeight: 600,
                                fontSize: "17px",
                                margin: 0,
                                marginTop: 10,
                            }}
                        >
                            <h5
                                style={{
                                    maxWidth: "100%",
                                    color: "rgb(37, 38, 56)",
                                    fontFamily:
                                        "Canva Sans, Noto Sans Variable, Noto Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
                                    fontWeight: 600,
                                    fontSize: "17px",
                                    margin: 0,
                                }}
                            >
                                {item.name}
                            </h5>
                        </div>
                    </div>
                ))
            ) : (
                <></>
            )}
            <div style={{
                width: '100%', height: 'auto', display: 'flex', alignSelf: 'center', paddingBottom: 10, flexDirection: "column",
                display: "flex",
            }}>
                <Button
                    variant="contained"
                    size="medium"
                    style={{
                        marginLeft: "20px",
                        height: 40,
                        alignSelf: "center",
                        textTransform: "none",
                        color: "white",
                        backgroundColor: "rgb(255, 66, 78)",
                        position: "relative",
                        alignItems: "center",
                        alignSelf: "center",
                        width: "20%",


                    }}
                    onClick={() => {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                        router.push("/your-design/purchase-form");
                    }}
                >
                    Xem thêm
                </Button>
            </div>
        </div>
    )
}

export default Your_collection
