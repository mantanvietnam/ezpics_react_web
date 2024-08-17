import { saveRequestDesignerAPI } from "@/api/design";
import { checkTokenCookie } from "@/utils/cookie";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpDesigner = ({ open, handleCancel }) => {
  const [token, setToken] = useState("");
  const [content, setContent] = useState("");
  const [fileCV, setFileCV] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const userToken = checkTokenCookie();
    setToken(userToken);
  }, []);

  useEffect(() => {
    if (open) {
      toast.info("Vui lòng điền đủ các trường để đăng kí làm Designer.");
    }
  }, [open]);

  useEffect(() => {
    if (fileCV) {
      const fileUrl = URL.createObjectURL(fileCV);
      setFilePreview(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [fileCV]);

  const isFormValid = token && content && fileCV;

  const resetForm = () => {
    setContent("");
    setFileCV(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("content", content);
    formData.append("file_cv", fileCV);

    try {
      const response = await saveRequestDesignerAPI(formData);
      if (response.code === 0) {
        toast.success("Yêu cầu đăng kí làm Designer đã được lưu!");
        resetForm(); 
        handleCancel();
      }
    } catch (error) {
      toast.error("Đăng kí không thành công!");
    }
  };

  const handleCancelAndReset = () => {
    resetForm();
    handleCancel(); 
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancelAndReset}
      width={700}
      footer={null}
    >
      <div className="flex h-fit">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-4"
        >
          <div>
            <label className="block mb-2 text-lg font-bold">
              About Yourself
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Describe your experience and skills"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-bold">Upload CV</label>
            <input
              type="file"
              onChange={(e) => {
                setFileCV(e.target.files[0]);
                setFilePreview(null); 
              }}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*,.pdf" 
              required
            />
          </div>

          {filePreview && (
            <div className="mt-4">
              <label className="block mb-2 text-lg font-bold">Preview:</label>
              <div className="border p-2 rounded">
                {fileCV.type.startsWith("image/") ? (
                  <img
                    src={filePreview}
                    alt="CV Preview"
                    className="w-full h-auto max-h-full object-contain rounded"
                  />
                ) : (
                  <p>{fileCV.name}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`bg-red-600 w-fit text-white rounded px-5 py-2 ml-4 h-fit w-96 font-semibold ${
                isFormValid
                  ? "hover:bg-red-700"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Đăng kí làm Designer
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpDesigner;
