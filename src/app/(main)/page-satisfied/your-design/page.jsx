/* eslint-disable @next/next/no-img-element */
"use client"

import { getMyProductApi } from "@/api/product";
import { checkTokenCookie } from "@/utils/cookie";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const YourDesign = () => {
    const itemsPerRow = 3;
    const router = useRouter();
    const [dataForYou, setDataForYou] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyProductApi({
                    type: "user_edit",
                    token: checkTokenCookie(),
                    limit: 30
                });
                if (response && response?.code === 1) {
                    setDataForYou(response.listData);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const skeletonArray = new Array(6).fill(0);

    return (
        <div style={{ paddingTop: "0px", display: "flex", flexWrap: "wrap", background: 'white' }}>
            {loading ? (
                skeletonArray.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            flex: `0 0 calc(${100 / itemsPerRow}% - 16px)`,
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
                                width: "100%",
                                height: "180px",
                                background: "#f0f0f0",
                                borderRadius: 10,
                            }}
                        ></div>
                        <div
                            style={{
                                height: 70,
                                background: "#f0f0f0",
                                borderRadius: 10,
                                marginTop: 10,
                            }}
                        ></div>
                    </div>
                ))
            ) : (
                dataForYou.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            flex: `0 0 calc(${100 / itemsPerRow}% - 16px)`,
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
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "rgba(0, 0, 0, 0.7)",
                                borderRadius: 10,
                                opacity: 0,
                                transition: "opacity 0.3s",
                                zIndex: 1000,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = 1;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = 0;
                            }}
                        >
                            <Button
                                onClick={() => {
                                    router.push(`/design`, {
                                        state: { id: item.id, token: checkTokenCookie() },
                                    });
                                }}
                                style={{
                                    color: "black",
                                    margin: "5px",
                                    cursor: "pointer",
                                    borderRadius: 10,
                                    backgroundColor: "white",
                                    width: 80,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={'/images/edit.png'}
                                    alt=""
                                    style={{ width: 20, height: 20 }}
                                />
                                <p
                                    style={{
                                        margin: 0,
                                        paddingLeft: 5,
                                        textTransform: "none",
                                    }}
                                >
                                    Sửa
                                </p>
                            </Button>
                        </div>
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
                                router.push(`/category/${item.id}`);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            <img
                                src={item.image}
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
            )}
            <div style={{
                width: '100%', height: 'auto', display: 'flex', alignSelf: 'center', paddingBottom: 10, flexDirection: "column",
                alignItems: "center",
            }}>
                <Button
                    variant="contained"
                    size="medium"
                    style={{
                        marginLeft: "20px",
                        height: 40,
                        textTransform: "none",
                        color: "white",
                        backgroundColor: "rgb(255, 66, 78)",
                        alignItems: "center",
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
    );
};

export default YourDesign;
