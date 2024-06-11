import { getLogoProductApi, getserisProductApi } from "@/api/product";
import { getNewProducts } from "@/lib/actions/actions";

export const SlideConfigurations = {
  CongratulationProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '11', limit: '12', page: '1' });
      return products;
    },
    title: "Thiệp chúc mừng",
    pathString: "/"
  },
  EndowProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '12', limit: '12', page: '1' });
      return products;
    },
    title: "Banner Ưu đãi",
    pathString: "/"
  },
  EventProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '9', limit: '12', page: '1' });
      return products;
    },
    title: "Banner event",
    pathString: "/"
  },
  GiftProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '14', limit: '12', page: '1' });
      return products;
    },
    title: "Thẻ quà tặng - Thẻ giảm giá",
    pathString: "/"
  },
  LiveProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '2', limit: '12', page: '1' });
      return products;
    },
    title: "Banner LiveStream",
    pathString: "/"
  },
  LogoProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '39', limit: '12', page: '1' });
      return products;
    },
    title: "Logo thương hiêu cá nhân",
    pathString: "/"
  },
  NewProductsSlider: {
    apiAction: async () => {
      "use server";
      const products = await getNewProducts();
      return products;
    },
    title: "Mẫu thiết kế mới nhất",
    pathString: "new-product"
  },
  SocialProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '17', limit: '12', page: '1' });
      return products;
    },
    title: "Ảnh bìa mạng xã hội",
    pathString: "/"
  },
  YoutubeProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getLogoProductApi({ category_id: '54', limit: '12', page: '1' });
      return products;
    },
    title: "Thumbnail YouTube",
    pathString: "/"
  },
  SerisProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getserisProductApi({ limit: '12', page: '1' });
      const data = { listData: [...products.data] };
      return data;
    },
    title: "Mẫu thiết kế in hàng loạt",
    pathString: "/"
  },
  SerisProductSlider: {
    apiAction: async () => {
      "use server";
      const products = await getserisProductApi({ limit: '12', page: '1' });
      const data = { listData: [...products.data] };
      return data;
    },
    title: "Mẫu thiết kế in hàng loạt",
    pathString: "/"
  }
};
