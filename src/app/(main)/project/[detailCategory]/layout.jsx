import { getProductCategoryAPI } from "@/api/product";
import axios from "axios";

export async function generateMetadata({ params }) {
  const slug = params?.detailCategory?.split(".html")?.[0];
  const temp = slug?.split("-");
  const id = temp[temp.length - 1];

  if (!id) {
    throw new Error("ID could not be extracted from the URL.");
  }

  try {
    const response = await getProductCategoryAPI();

    if (!response) {
      throw new Error("No listData found in the API response.");
    }

    const category = response.listData.find((item) => item.id == id);

    console.log("categorycategorycategorycategory", category);
    if (!category) {
      throw new Error(`No category found with ID ${id}`);
    }

    return {
      title: category?.name,
      description: `Danh mục ${category.name}`,
      openGraph: {
        title: category.name,
        type: "website",
        description: `Danh mục ${category.name}`,
        images:
          "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    // Return default or error metadata
    return {
      title: "Default Title",
      description: "Default Description",
      openGraph: {
        title: "Default Title",
        type: "website",
        description: "Default Description",
        images: "/default-image.jpg",
      },
    };
  }
}

export default async function layout(props) {
  return <div className="flex-col">
    {props.children}
  </div>;
}
