import Image from "next/image";

import { focalPoint } from "@/lib/image";
import type { ContentImage } from "@/lib/types";

import styles from "./CoverImage.module.css";

type Props = {
  /** Null until Sanity is wired up: the frame renders as an empty tile. */
  image: ContentImage | null;
  /** Layout width hints for srcset — always pass the real rendered size. */
  sizes: string;
  priority?: boolean;
  /** Decorative only: the surrounding link or caption already names the image. */
  decorative?: boolean;
  className?: string;
  imageClassName?: string;
};

/** A 1:1 fill image inside a clipped, tile-coloured frame. */
export function CoverImage({
  image,
  sizes,
  priority = false,
  decorative = false,
  className,
  imageClassName,
}: Props) {
  return (
    <span className={[styles.frame, className].filter(Boolean).join(" ")}>
      {image && (
        <Image
          className={[styles.image, imageClassName].filter(Boolean).join(" ")}
          src={image.url}
          alt={decorative ? "" : image.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip ?? undefined}
          style={{ objectPosition: focalPoint(image) }}
        />
      )}
    </span>
  );
}
