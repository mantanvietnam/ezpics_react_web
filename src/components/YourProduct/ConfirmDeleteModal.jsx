import React from "react";
import { Modal, Button } from "antd";

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Xác nhận xóa"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      footer={null} // Remove default footer to customize with Tailwind
      className="!max-w-lg"
      bodyStyle={{ padding: "1.5rem" }} // Custom padding
    >
      <div className="text-center">
        <p className="text-lg mb-4">
          Bạn có chắc chắn muốn xóa sản phẩm này không?
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            key="back"
            onClick={onCancel}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Không
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Có
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
