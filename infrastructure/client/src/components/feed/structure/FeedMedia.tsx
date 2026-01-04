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
    <div className="mb-8 animate-fade-in">
    

      <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow">
        {media.type === "IMAGE" ? (
          <div className="relative aspect-video">
            <Image
              src={getMediaUrl(media.url)}
              alt={media.altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              unoptimized 
              loading="lazy"
            />
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

        <p>{media.caption}</p>
      </div>
    </div>
  );
}