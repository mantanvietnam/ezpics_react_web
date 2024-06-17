/* eslint-disable @next/next/no-img-element */
"use client"

import { getInfoMemberAPI } from "@/api/user";
import { checkTokenCookie } from "@/utils";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Portfolio = () => {
    const [dataImage, setDataImage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getInfoMemberAPI({
                    token: checkTokenCookie(),
                });
                setDataImage(response?.data?.certificate);
            } catch (error) {
                console.error("Error fetching image data:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', borderRadius: 10, paddingLeft: 10, paddingRight: 10 }}>
            {loading ? (
                <Skeleton height="100%" width="100%" borderRadius={10} />
            ) : (
                <img style={{ width: '100%', height: '100%', borderRadius: 10 }} alt="image" src={dataImage} />
            )}
        </div>
    );
};

export default Portfolio;
