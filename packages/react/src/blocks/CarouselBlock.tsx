import { useState, useEffect } from 'react';
import type { CarouselData } from '@mcp-interactive-ui/types';

export interface CarouselBlockProps {
  data: CarouselData;
  className?: string;
}

export function CarouselBlock({ data, className }: CarouselBlockProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data.autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return data.loop ? next % data.items.length : Math.min(next, data.items.length - 1);
      });
    }, data.autoplayDelay);

    return () => clearInterval(interval);
  }, [data.autoplay, data.autoplayDelay, data.loop, data.items.length]);

  const item = data.items[currentIndex];
  if (!item) return <div />;

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return data.loop ? data.items.length - 1 : 0;
      return prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return data.loop ? next % data.items.length : Math.min(next, data.items.length - 1);
    });
  };

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden'}>
      {data.title && (
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      <div className="relative bg-black">
        {/* Main content */}
        <div className="w-full h-96 bg-muted flex items-center justify-center overflow-hidden">
          {item.image && (
            <img
              src={item.image}
              alt={item.title || 'carousel item'}
              className="w-full h-full object-cover"
            />
          )}
          {item.content && !item.image && (
            <div className="p-8 text-center text-white">
              <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
              <p>{item.content}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        {data.showControls && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
            >
              →
            </button>
          </>
        )}

        {/* Indicators */}
        {data.showIndicators && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {data.items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption */}
      {item.title && (
        <div className="p-4 bg-muted">
          <h4 className="font-semibold">{item.title}</h4>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
