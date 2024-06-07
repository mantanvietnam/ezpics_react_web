import {
  getNewProducts,
  getTrendingProducts,
  getProductByCategory,
  getSeriesProducts,
} from "@/lib/actions/actions";
import DefaultSlide from "./DefaultSlide";

export const NewProductsSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getNewProducts(); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Mẫu thiết kế mới nhất"
    />
  );
};

export const TrySlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 12;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Có thể bạn muốn thử"
    />
  );
};

export const TrendingSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 9;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Phổ biến"
    />
  );
};

export const ThumnailYtSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 54;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Thumnail Youtube"
    />
  );
};

export const LogoBrandSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 39;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Logo thương hiệu cá nhân"
    />
  );
};

export const HelloNewSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 35;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Chào Tân Đại Lý"
    />
  );
};

export const SocialSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 17;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Ảnh bìa mạng xã hội"
    />
  );
};

export const GiftCardSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 14;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Thẻ quà tặng - Thẻ giảm giá"
    />
  );
};

export const OfferSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 12;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Ưu đãi - Khuyến mại"
    />
  );
};

export const GreettingCardSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 11;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Thiệp chúc mừng"
    />
  );
};

export const ProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 10;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Sản phẩm"
    />
  );
};

export const EventSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 9;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Sự kiện - Chương trình - Cuộc thi"
    />
  );
};

export const NotifySlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 8;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Thông báo"
    />
  );
};

export const HonorsSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 7;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Vinh danh"
    />
  );
};

export const ActivityCalendarSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 6;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Lịch hoạt động"
    />
  );
};

export const MotivationalSayingSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 5;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Câu nói truyền động lực"
    />
  );
};

export const PersonalPhotoSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 4;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Ảnh bìa trang cá nhân"
    />
  );
};

export const AvatarSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 3;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Ảnh đại diện"
    />
  );
};

export const BannerLiveSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 2;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Banner Livestream"
    />
  );
};

export const InvitationSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const categoryId = 1;
        const products = await getProductByCategory(categoryId); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Thư mời"
    />
  );
};
