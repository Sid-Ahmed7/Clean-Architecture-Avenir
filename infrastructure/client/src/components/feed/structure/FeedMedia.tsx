import { getMediaUrl } from "@/lib/utils/media";
import { Media } from "@/types/media";
import Image from "next/image";
import { useTranslations } from 'next-intl';

interface FeedMediaProps {
  media: Media;
}

export function FeedMedia({ media }: FeedMediaProps) {
  const t = useTranslations('components.feed.structure.media');
  return (
    <figure className="my-8 animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        {media.type === "IMAGE" ? (
          <div className="relative aspect-video">
            <Image
              src={getMediaUrl(media.url)}
              alt={media.altText}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              unoptimized
              loading="lazy"
            />
            {media.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>
        ) : media.type === "VIDEO" ? (
          <video
            src={getMediaUrl(media.url)}
            controls
            className="w-full"
            preload="metadata"
          >
            {t('videoNotSupported')}
          </video>
        ) : null}
      </div>

      {media.caption && (
        <figcaption className="mt-3 text-center">
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {media.caption}
          </p>
        </figcaption>
      )}
    </figure>
  );
}