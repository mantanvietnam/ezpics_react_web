import { openDB } from "idb";

// Tạo cơ sở dữ liệu IndexedDB
const initDB = async () => {
  const db = await openDB("images-db", 1, {
    upgrade(db) {
      db.createObjectStore("images", { keyPath: "id" });
    },
  });
  return db;
};

// Lưu imageURL vào IndexedDB
export const saveImageToDB = async (id, imageURL) => {
  const db = await initDB();
  await db.put("images", { id, base64Data: imageURL });
};

// Lấy imageURL từ IndexedDB
export const getImageFromDB = async (id) => {
  const db = await initDB();
  const imageData = await db.get("images", id);
  return imageData ? imageData.base64Data : null;
};

// Xóa imageURL khỏi IndexedDB
export const deleteImageFromDB = async (id) => {
  const db = await initDB();
  await db.delete("images", id);
};
