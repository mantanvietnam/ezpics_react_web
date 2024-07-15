function ImageSvg({ href }: { href: string }) {
  return (
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="mask" x="0" y="0" width="200" height="200">
          <rect
            x="0"
            y="0"
            width="200"
            height="200"
            rx="100"
            ry="100"
            fill="white"
          />
        </mask>
      </defs>

      <image
        id="image"
        x="0"
        y="0"
        width="200"
        height="200"
        href={href}
        mask="url(#mask)"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}

export default ImageSvg;
