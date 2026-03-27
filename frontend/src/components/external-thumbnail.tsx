import Image, { ImageLoaderProps } from "next/image";

type ExternalThumbnailProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function passthroughLoader({ src }: ImageLoaderProps): string {
  return src;
}

export function ExternalThumbnail({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false
}: ExternalThumbnailProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      loader={passthroughLoader}
      unoptimized
      priority={priority}
    />
  );
}
