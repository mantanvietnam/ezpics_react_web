"use client"
import { getInfoMemberAPI } from '@/api/user';
import TabHeader from '@/components/ControlPanel/TabHeader';
import { checkAvailableLogin } from '@/utils';
import { checkTokenCookie } from '@/utils/cookie';
import { formatCurrency } from '@/utils/media/format';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { FaEdit, FaShareAlt } from 'react-icons/fa';
import { FiCreditCard, FiDollarSign, FiMail, FiPhone } from 'react-icons/fi';
export default function ControlRoot(props) {
    const isAuthenticated = checkAvailableLogin()
    const [data, setData] = useState([]);
    useLayoutEffect(() => {
        if (!isAuthenticated) {
            redirect("/sign-in")
        }
    }, [isAuthenticated])
    useEffect(() => {
        const getData = async () => {
            const response = await getInfoMemberAPI({
                token: checkTokenCookie(),
            });
            if (response && response.code === 0) {
                setData(response.data);
            }
        };
        getData();
    }, []);
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgb(240, 242, 245)",
            }}
        >
            <div
                style={{ paddingLeft: "10%", paddingRight: "10%" }}
            >
                <div style={{ width: "100%", height: 1000 }}>
                    {/* <img src={} style={{width:'100%',height:200}}/> */}
                    <div
                        style={{
                            width: "100%",
                            height: 200,
                            background: "rgb(255,255,255)",
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,1) 54%, rgba(159,157,158,1) 96%)",
                            borderRadius: 10,
                            zIndex: 1,
                            position: "relative",
                        }}
                    ></div>
                    <div
                        style={{
                            width: "100%",
                            paddingLeft: 30,
                            paddingRight: 30,
                            maxHeight: 250,
                            backgroundColor: "white",
                            borderRadius: "20px",
                        }}
                    >
                        {data && (
                            <div
                                style={{
                                    marginTop: "-6%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <div
                                        alt="Avatar"
                                        className="w-44 h-44 border-4 border-white relative z-20 bg-cover bg-center rounded-full"
                                        style={{ backgroundImage: `url(${data.avatar})` }}
                                    ></div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <p
                                            style={{
                                                paddingLeft: 15,
                                                fontSize: "32px",
                                                fontWeight: "700",
                                                fontFamily: "Helvetica, Arial, sans-serif",
                                                margin: 0,
                                            }}
                                        >
                                            {data.name}
                                        </p>
                                        <p
                                            style={{
                                                paddingLeft: 15,
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                fontFamily: "Helvetica, Arial, sans-serif",
                                                margin: 0,
                                                color: "rgb(101, 103, 107)",
                                                paddingTop: 10,
                                            }}
                                        >
                                            {data.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row items-end">
                                    <button
                                        className="ml-5 h-10 text-white bg-red-600 flex items-center justify-center rounded px-4"
                                        onClick={() => {
                                            window.scrollTo({
                                                top: 70,
                                                behavior: "smooth",
                                            });
                                        }}
                                    >
                                        <FaShareAlt />
                                        <p className="m-0 pl-2 pt-1">Chia sẻ</p>
                                    </button>
                                    <Link href={'/information'}
                                        className="ml-5 h-10 text-black bg-gray-300 flex items-center justify-center font-semibold rounded px-4"
                                    >
                                        <FaEdit />
                                        <p className="m-0 pl-2 pt-1">Chỉnh sửa thông tin cá nhân</p>
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div className="pt-5">
                            <TabHeader />
                        </div>
                    </div>
                    <div className="mt-5">
                        <div style={{ width: "100%", display: "flex", flexDirection: "row", maxHeight: 300 }}>
                            <div style={{ width: "30%", backgroundColor: "white", borderRadius: 10, paddingLeft: 15, paddingBottom: 15 }}>
                                <p style={{ fontSize: 20, fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "600", fontSize: 20, margin: "14px 0" }}>Thông tin</p>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <FiMail style={{ color: "rgb(140, 147, 157)" }} />
                                    <p style={{ margin: 0, paddingLeft: 10, fontWeight: "600", fontSize: 15 }}>{data.email}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", paddingTop: 15, alignItems: "center" }}>
                                    <FiPhone style={{ color: "rgb(140, 147, 157)" }} />
                                    <p style={{ margin: 0, paddingLeft: 10, fontWeight: "600", fontSize: 15 }}>{data.phone}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", paddingTop: 15, alignItems: "center" }}>
                                    <FiDollarSign style={{ color: "rgb(140, 147, 157)" }} />
                                    <p style={{ margin: 0, paddingLeft: 10, fontWeight: "600", fontSize: 15 }}>
                                        {formatCurrency(data.account_balance, 'VND')}
                                    </p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", paddingTop: 15, alignItems: "center" }}>
                                    <FiCreditCard style={{ color: "rgb(140, 147, 157)" }} />
                                    <p style={{ margin: 0, paddingLeft: 10, fontWeight: "600", fontSize: 15 }}>{data.ecoin} ecoin</p>
                                </div>
                            </div>
                            <div style={{ paddingLeft: 15, width: "70%", height: "100%" }}>
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
