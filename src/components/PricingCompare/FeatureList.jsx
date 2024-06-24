import { CheckOutlined } from "@ant-design/icons";

const FeatureList = ({ features, showContactInfo }) => {
  return (
    <div
      className="w-full md:w-[95%] xl:w-[90%] min-h-[65%] bg-white p-6 rounded-bl-[10px] rounded-br-[10px]"
      style={{
        borderLeft: "0.2px solid rgba(0, 0, 0, 0.2)",
        borderBottom: "0.2px solid rgba(0, 0, 0, 0.2)",
        borderRight: "0.2px solid rgba(0, 0, 0, 0.2)",
      }}>
      <p>Tính năng bạn sẽ thích:</p>
      {features.map((feature, index) => (
        <div className="flex pt-4" key={index}>
          <CheckOutlined className="text-[#a570ff] text-base" />
          <p className="text-base pl-1.5">{feature}</p>
        </div>
      ))}
      {showContactInfo && (
        <p className="text-xs pt-10 text-[rgba(13,18,22,0.7)]">
          *Liên hệ với bộ phận bán hàng để biết thêm thông tin.
        </p>
      )}
    </div>
  );
};

export default FeatureList;
