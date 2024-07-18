/* eslint-disable @next/next/no-img-element */
import React from "react";

const PerformanceApp = () => {
  return (
    <div className="w-full bg-[rgb(26,27,47)] text-white px-[5%] py-[2%] sm:py-[5%]">
      <div className="grid gap-[0%] sm:gap-[3%] xl:gap-[8%] md:grid-cols-2 grid-cols-1">
        <div className="flex items-start">
          <img src="/images/remove/icon-performance-1.svg" alt="" />
          <div className="pl-6">
            <h1 className="text-2xl font-bold mb-1 md:mb-5">
              Tiết kiệm thời gian
            </h1>
            <p className="my-4">
              Với Ezpics RB, bạn có thể tiết kiệm một lượng thời gian đáng kể vì
              công cụ này có thể xóa nền khỏi hình ảnh chỉ trong vài giây. Điều
              này cho phép bạn tập trung vào các tác vụ khác và hoàn thành dự án
              của mình nhanh hơn.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <img src="/images/remove/icon-performance-3.svg" alt="" />
          <div className="pl-6">
            <h1 className="text-2xl font-bold mb-1 md:mb-5">
              Cải thiện chất lượng
            </h1>
            <p className="my-4">
              Ezpics RB sử dụng các thuật toán nâng cao để loại bỏ nền chính xác
              trong khi vẫn giữ được các chi tiết và góc cạnh của đối tượng.
              Điều này mang lại hình ảnh chất lượng cao với nền trong suốt trông
              chuyên nghiệp và bóng bẩy.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <img src="/images/remove/icon-performance-2.svg" alt="" />
          <div className="pl-6">
            <h1 className="text-2xl font-bold mb-1 md:mb-5">
              Tiết kiệm chi phí
            </h1>
            <p className="my-4">
              Việc thuê một chuyên gia chỉnh sửa hình ảnh bên ngoài có thể tốn
              kém, đặc biệt nếu bạn có một số lượng lớn hình ảnh cần chỉnh sửa.
              Ezpics RB là một giải pháp hiệu quả về chi phí cho phép bạn tự
              chỉnh sửa hình ảnh mà không cần phải trả tiền cho chuyên gia.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <img src="/images/remove/icon-performance-1.svg" alt="" />
          <div className="pl-6">
            <h1 className="text-2xl font-bold mb-1 md:mb-5">
              Miễn phí & Dễ sử dụng
            </h1>
            <p className="my-4">
              Ezpics RB miễn phí, bạn có thể sử dụng các tính năng tuyệt vời như
              xóa background của Ezpics RB ở bất cứ đâu mà không phải lo lắng về
              chi phí. Ezpics RB là một sản phẩm AI hoàn toàn miễn phí, cho phép
              bạn chỉnh sửa ảnh trực tuyến. Nó cho phép bạn chỉnh sửa ảnh của
              bạn trong tích tắc. Hãy sử dụng, trải nghiệm và tận hưởng kết quả.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceApp;
