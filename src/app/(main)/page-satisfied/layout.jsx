"use client"
import { getInfoMemberAPI } from '@/api/user';
import TabHeader from '@/components/ControlPanel/TabHeader';
import { checkAvailableLogin } from '@/utils';
import { checkTokenCookie } from '@/utils/cookie';
import { formatCurrency } from '@/utils/format';
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
        <div className="container">
            <div className="inner-container">
                <div className="header-background"></div>
                <div className="info-container">
                    {data && (
                        <div className="info-header">
                            <div className="avatar-name">
                                <div
                                    alt="Avatar"
                                    className="avatar"
                                    style={{ backgroundImage: `url(${data.avatar})` }}
                                ></div>
                                <div className="name-email">
                                    <p className="name">{data.name}</p>
                                    <p className="email">{data.email}</p>
                                </div>
                            </div>
                            <div className="buttons">
                                <button
                                    className="share-button"
                                    onClick={() => {
                                        window.scrollTo({
                                            top: 70,
                                            behavior: "smooth",
                                        });
                                    }}
                                >
                                    <FaShareAlt />
                                    <p className="button-text">Chia sẻ</p>
                                </button>
                                <Link href={'/information'}
                                    className="ml-5 h-10 text-black bg-gray-300 flex items-center justify-center font-semibold rounded px-4"
                                >
                                    <FaEdit />
                                    <p className="button-text">Chỉnh sửa thông tin cá nhân</p>
                                </Link>
                            </div>
                        </div>
                    )}
                    <div className="tab-header">
                        <TabHeader />
                    </div>
                </div>
                <div className="content">
                    <div className="info-panel">
                        <p className="info-title">Thông tin</p>
                        <div className="info-row">
                            <FiMail style={{ color: "rgb(140, 147, 157)" }} />
                            <p className="info-text">{data.email}</p>
                        </div>
                        <div className="info-row">
                            <FiPhone style={{ color: "rgb(140, 147, 157)" }} />
                            <p className="info-text">{data.phone}</p>
                        </div>
                        <div className="info-row">
                            <FiDollarSign style={{ color: "rgb(140, 147, 157)" }} />
                            <p className="info-text">{formatCurrency(data.account_balance, 'VND')}</p>
                        </div>
                        <div className="info-row">
                            <FiCreditCard style={{ color: "rgb(140, 147, 157)" }} />
                            <p className="info-text">{data.ecoin} ecoin</p>
                        </div>
                    </div>
                    <div className="main-content">
                        {props.children}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .container {
                    width: 100%;
                    height: 100%;
                    background-color: rgb(240, 242, 245);
                    display: flex;
                    justify-content: center;
                    padding: 10px;
                }
                .inner-container {
                    width: 100%;
                    max-width: 1200px;
                }
                .header-background {
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(180deg, rgba(255,255,255,1) 54%, rgba(159,157,158,1) 96%);
                    border-radius: 10px;
                    z-index: 1;
                    position: relative;
                }
                .info-container {
                    width: 100%;
                    padding: 30px;
                    background-color: white;
                    border-radius: 20px;
                    margin-top: -50px;
                }
                .info-header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
                .avatar-name {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                }
                .avatar {
                    z-index:1;
                    width: 110px;
                    height: 110px;
                    border: 4px solid white;
                    background-size: cover;
                    background-position: center;
                    border-radius: 50%;
                }
                .name-email {
                    display: flex;
                    flex-direction: column;
                }
                .name {
                    z-index:1;
                    padding-left: 15px;
                    font-size: 32px;
                    font-weight: 700;
                    margin: 0;
                }
                .email {
                    padding-left: 15px;
                    font-size: 14px;
                    font-weight: 600;
                    color: rgb(101, 103, 107);
                    margin: 0;
                    padding-top: 10px;
                }
                .buttons {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                }
                .share-button, .edit-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    padding: 0 15px;
                    border-radius: 5px;
                    margin-left: 10px;
                }
                .share-button {
                    background-color: rgb(255, 66, 78);
                    color: white;
                }
                .edit-button {
                    background-color: rgb(200, 200, 200);
                    color: black;
                }
                .button-text {
                    margin: 0;
                    padding-left: 5px;
                }
                .tab-header {
                    padding-top: 20px;
                }
                .content {
                    display: flex;
                    flex-direction: row;
                    margin-top: 20px;
                }
                .info-panel {
                    width: 30%;
                    background-color: white;
                    border-radius: 10px;
                    padding: 15px;
                }
                .info-title {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 14px 0;
                }
                .info-row {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding-top: 15px;
                }
                .info-text {
                    margin: 0;
                    padding-left: 10px;
                    font-weight: 600;
                    font-size: 15px;
                }
                .main-content {
                    width: 70%;
                    padding-left: 15px;
                }

                @media (max-width: 1024px) {
                    .content {
                        flex-direction: column;
                    }
                    .info-panel, .main-content {
                        width: 100%;
                    }
                    .main-content {
                        padding-left: 0;
                    }
                     .info-header {
                        flex-direction: column;
                        gap: 16px;
                    }
                }

                @media (max-width: 768px) {
                    .info-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        gap: 0px;
                    }
                    .avatar-name {
                        flex-direction: column;
                        align-items: center;
                    }
                    .name-email {
                        align-items: center;
                        text-align: center;
                    }
                    .buttons {
                        margin-top: 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        gap: 12px;
                    }
                }

                @media (max-width: 480px) {
                    .info-container {
                        padding: 15px;
                    }
                    .share-button, .edit-button {
                        font-size: 14px;
                        height: 35px;
                        padding: 0 10px;
                    }
                }
            `}</style>
        </div>
    );
}
