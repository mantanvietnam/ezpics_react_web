import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Upload } from 'antd';
import styled from 'styled-components';
import Image from 'next/image';
import { UploadOutlined } from '@ant-design/icons';
import { addWarehouseAPI } from '@/api/product';
import { checkTokenCookie } from '@/utils';
import { toast } from 'react-toastify';

const CustomUpload = styled.div`
  .ant-upload-wrapper .ant-upload-select {
    display: block !important;
  }

  .anticon {
    display: flex;
    justify-content: center;
  }
`;

const AddWarehouse = ({ open, handleCancel, onSuccess }) => {
  const [initialModalVisible, setInitialModalVisible] = useState(true);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState({
    name: '',
    price: '',
    duration: '',
    image: null,
  });

  useEffect(() => {
    if (open) {
      setInitialModalVisible(true);
      setIsFormModalVisible(false);
      resetForm();
    } else {
      setInitialModalVisible(false);
      setIsFormModalVisible(false);
      resetForm();
    }
  }, [open]);

  const handleChange = ({ file }) => {
    if (file && file.originFileObj) {
      setCollectionInfo({
        ...collectionInfo,
        image: file.originFileObj,
      });
    } else {
      setCollectionInfo({
        ...collectionInfo,
        image: null,
      });
    }
  };

  const resetForm = () => {
    setCollectionInfo({
      name: '',
      price: '',
      duration: '',
      image: null,
    });
  };

  const handleInitialModalOk = () => {
    setInitialModalVisible(false);
    setIsFormModalVisible(true);
  };

  const handleInitialModalCancel = () => {
    handleCancel();
  };

  const handleFormModalOk = async () => {
    const { name, price, duration, image } = collectionInfo;

    if (!name || !price || !duration || !image) {
      message.error('Vui lòng điền đầy đủ thông tin và chọn ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('token', checkTokenCookie());
    formData.append('name', name);
    formData.append('file', image);
    formData.append('date_use', duration);
    formData.append('price', price);
    formData.append('keyword', 'Mẫu đẹp');
    formData.append('description', 'Tổng hợp mẫu thiết kế đẹp');

    try {
      const response = await addWarehouseAPI(formData);
      console.log(response);
      toast.success('Tạo mới bộ sưu tập thành công.');
      setInitialModalVisible(false);
      setIsFormModalVisible(false);
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi thêm kho:', error.message);
      toast.error('Tạo mới thất bại.');
    }
  };

  const handleFormModalCancel = () => {
    setIsFormModalVisible(false);
    handleCancel();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollectionInfo({
      ...collectionInfo,
      [name]: value,
    });
  };

  return (
    <>
      <Modal
        open={initialModalVisible && open}
        onCancel={handleInitialModalCancel}
        footer={[
          <Button key="cancel" onClick={handleInitialModalCancel}>
            Hủy bỏ
          </Button>,
          <Button key="create" onClick={handleInitialModalOk} className="button-red">
            Tạo mới
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-lg">Tạo bộ sưu tập</h2>
          <Image
            src="/images/stamp-collecting.png"
            alt="Your Image"
            className="my-5"
            width={90}
            height={100}
          />
          <p>Phí tạo bộ sưu tập là 999.000đ. Bạn có đồng ý để tiếp tục tạo bộ sưu tập?</p>
        </div>
      </Modal>

      <Modal
        open={isFormModalVisible}
        onOk={handleFormModalOk}
        onCancel={handleFormModalCancel}
        width={800}
        footer={null}
      >
        <div className="bg-white rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">
                Bắt đầu tạo bộ sưu tập
                <br />
                <small className="text-sm">Hãy điền đầy đủ thông tin trước khi tạo nhé</small>
              </h2>
            </div>
          </div>
          <form className="mt-6 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Ảnh minh họa</label>
              <CustomUpload>
                <Upload
                  name="collectionImage"
                  listType="picture"
                  className="uploader"
                  onChange={handleChange}
                  showUploadList={false}
                >
                  <div className="flex flex-col items-center w-full border-2 border-dashed border-gray-300 h-52 justify-center cursor-pointer">
                    {collectionInfo.image ? (
                      <Image
                        src={URL.createObjectURL(collectionInfo.image)}
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
              </CustomUpload>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Tên bộ sưu tập</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Tên bộ sưu tập"
                value={collectionInfo.name}
                onChange={handleInputChange}
              />
              <label className="block text-sm font-medium mb-2">Giá tiền</label>
              <input
                type="text"
                name="price"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Giá tiền"
                value={collectionInfo.price}
                onChange={handleInputChange}
              />
              <label className="block text-sm font-medium mb-2">Số ngày sử dụng</label>
              <input
                type="text"
                name="duration"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Số ngày sử dụng"
                value={collectionInfo.duration}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <div className="flex justify-center mt-6">
            <Button className="button-red w-3/5" onClick={handleFormModalOk}>
              Bắt đầu tạo
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddWarehouse;
