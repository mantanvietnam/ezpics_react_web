import React from "react";
import HeaderRemove from "@/components/remove/HeaderRemove";
import ContentRemove from "@/components/remove/ContentRemove";
import IntroduceApp from "@/components/remove/IntroduceApp";
import AdvantageApp from "@/components/remove/AdvantageApp";
import PerformanceApp from "@/components/remove/PerformanceApp";
import AskingApp from "@/components/remove/AskingApp";

const page = () => {
  return (
    <div>
      <HeaderRemove />
      <ContentRemove />
      <IntroduceApp />
      <AdvantageApp />
      <PerformanceApp />
      <AskingApp />
    </div>
  );
};

export default page;
