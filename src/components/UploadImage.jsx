"use client"
import React, { useState } from 'react';
import { storage } from '@/utils/media/firebaseConfig'; // Assuming Firebase storage import
import { ref, uploadBytesResumable } from 'firebase/storage';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import styled from 'styled-components';
import Image from 'next/image';

const CustomUpload = styled.div`
  .ant-upload-wrapper .ant-upload-select {
    display: block !important;
  }

  .anticon {
    display: flex;
    justify-content: center;
  }
`;

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleChange = (info) => {
    if (info.file.status !== 'uploading' && info.file.status !== 'removed') {
      setImage(info.file.originFileObj);
    } else if (info.file.status === 'removed') {
      setImage(null);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      try {
        await uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error(error.message);
          },
          () => {
            console.log("Upload completed");
          }
        );
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <CustomUpload>
      <Upload
        name="collectionImage"
        listType="picture"
        className="uploader"
        onChange={handleChange}
        showUploadList={false}
      >
        <div className="flex flex-col items-center w-full border-2 border-dashed border-gray-300 h-52 justify-center cursor-pointer">
          {image ? (
            <Image
              src={URL.createObjectURL(image)}
              alt="Collection"
              className="w-full h-full object-cover"
              width={300}
              height={300}
            />
          ) : (
            <>
              <UploadOutlined className="w-full text-2xl" />
              <span className="pt-5 w-full anticon text-gray-500">
                Click or drag image to upload
              </span>
            </>
          )}
        </div>
      </Upload>
      {image && (
        <button onClick={handleUpload} className="button-red items-center">
          Upload
        </button>
      )}
    </CustomUpload>
  );
};

export default ImageUpload;
