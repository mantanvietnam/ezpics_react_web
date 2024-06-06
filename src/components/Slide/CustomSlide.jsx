import styled from "styled-components";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export const StyledSlider = styled.div`
  .slick-prev:before,
  .slick-next:before {
    content: none; /* Remove default arrow content */
  }

  .slick-prev,
  .slick-next {
    display: none; /* Hide default arrow elements */
  }
`;

export const Arrow = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;

  &.next {
    right: 10px;
  }

  &.prev {
    left: 10px;
  }

  &:hover,
  &:active {
    background: #000;
    color: #fff;
  }

  .anticon {
    font-size: 20px;
  }
`;

export function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Arrow className={`${className} next`} style={style} onClick={onClick}>
      <RightOutlined />
    </Arrow>
  );
}

export function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Arrow className={`${className} prev`} style={style} onClick={onClick}>
      <LeftOutlined />
    </Arrow>
  );
}
