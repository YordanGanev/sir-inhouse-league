"use client";

import { getPlaceholderImage } from "@/utils/common";
import Image from "next/image";
import { useState } from "react";

export default function PlayerImage({
  alt,
  src,
}: {
  alt: string;
  src: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      alt={alt}
      src={imageSrc}
      height={64}
      width={64}
      onError={() => {
        setImageSrc(getPlaceholderImage(alt));
      }}
    />
  );
}
