/* eslint-disable @next/next/no-img-element */
"use client"

import { getInfoMemberAPI } from "@/api/user";
import { checkTokenCookie } from "@/utils";
import { useEffect, useState } from "react"

const Portfolio = () => {
    const [dataImage, setDataImage] = useState('')
    useEffect(() => {
        const getData = async () => {
            const response = await getInfoMemberAPI({
                token: checkTokenCookie(),
            });
            setDataImage(response?.data?.certificate);
        };
        getData();
    }, []);
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: 10, paddingLeft: 10, paddingRight: 10 }}>
            <img style={{ width: '100%', height: '100%', }} alt="image" src={dataImage} />
        </div>
    )
}

export default Portfolio
