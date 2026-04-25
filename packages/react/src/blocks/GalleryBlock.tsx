import { useState } from 'react';
import type { GalleryData } from '@mcp-interactive-ui/types';

export interface GalleryBlockProps {
  data: GalleryData;
  className?: string;
}

/**
 * Renders a `gallery` block with grid, masonry, carousel, or list layout.
 */
export function GalleryBlock({ data, className }: GalleryBlockProps): JSX.Element {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const layout = data.layout || 'grid';
  const columns = data.columns || 3;
  const gap = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }[data.gap || 'md'];
  const aspectRatio = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  }[data.aspectRatio || 'auto'];

  if (layout === 'carousel') {
    const image = data.images[currentCarouselIndex];
    if (!image) return <div />;  

    return (
      <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden'}>
        {data.title && (
          <div className="p-6 pb-4">
            <h3 className="text-lg font-semibold">{data.title}</h3>
          </div>
        )}

        <div className="relative bg-black">
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-96 object-cover"
          />

          {/* Navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={() => setCurrentCarouselIndex((i) => (i - 1 + data.images.length) % data.images.length)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentCarouselIndex((i) => (i + 1) % data.images.length)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              →
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {data.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentCarouselIndex(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === currentCarouselIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Caption */}
        {image.caption && (
          <div className="p-4 bg-muted">
            <p className="text-sm">{image.caption}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {data.title && (
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      <div className={`p-6 grid ${layout === 'grid' ? `grid-cols-${columns}` : ''} ${gap}`}>
        {data.images.map((image, idx) => (
          <div
            key={idx}
            className={`relative group cursor-pointer overflow-hidden rounded-lg ${aspectRatio}`}
            onClick={() => data.lightbox && setSelectedImage(idx)}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              {data.lightbox && (
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              )}
            </div>

            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {data.lightbox && selectedImage !== null && data.images[selectedImage] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={data.images[selectedImage]!.url}
              alt={data.images[selectedImage]!.alt}
              className="w-full h-full object-contain"
            />

            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              ✕
            </button>

            {/* Navigation */}
            <button
              onClick={() => setSelectedImage((i) => (i! - 1 + data.images.length) % data.images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedImage((i) => (i! + 1) % data.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
