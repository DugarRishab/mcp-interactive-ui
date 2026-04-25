import type { TimelineData } from '@mcp-interactive-ui/types';

export interface TimelineBlockProps {
  data: TimelineData;
  className?: string;
}

/**
 * Renders a `timeline` block with vertical or horizontal orientation.
 */
export function TimelineBlock({ data, className }: TimelineBlockProps): JSX.Element {
  const isVertical = data.orientation === 'vertical';
  const events = data.reverse ? [...data.events].reverse() : data.events;
  const visibleEvents = data.maxVisible ? events.slice(0, data.maxVisible) : events;

  const colorClasses: Record<string, string> = {
    default: 'bg-muted',
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {/* Title */}
      {data.title && (
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      {/* Timeline */}
      <div className={`p-6 ${isVertical ? '' : 'flex overflow-x-auto'}`}>
        {visibleEvents.map((event, idx) => {
          const colorClass = colorClasses[event.color || 'default'];

          return (
            <div
              key={event.id}
              className={`
                ${isVertical ? 'flex gap-4 pb-8 last:pb-0' : 'flex-shrink-0 w-64 pr-4'}
              `}
            >
              {/* Timeline dot and line */}
              {isVertical && (
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-background ${colorClass}`}
                  />
                  {/* Line */}
                  {idx < visibleEvents.length - 1 && (
                    <div className="w-1 h-12 bg-muted mt-2" />
                  )}
                </div>
              )}

              {/* Content */}
              <div className={`flex-1 ${isVertical ? '' : 'border-l-2 border-muted pl-4'}`}>
                {/* Timestamp */}
                {event.timestamp && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                )}

                {/* Title */}
                <h4 className="font-semibold text-sm mt-1">{event.title}</h4>

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                )}

                {/* Links */}
                {event.links && event.links.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {event.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Media */}
                {event.media && (
                  <div className="mt-2">
                    {event.media.type === 'image' && (
                      <img
                        src={event.media.url}
                        alt={event.title}
                        className="max-w-full h-auto rounded-md"
                      />
                    )}
                    {event.media.type === 'video' && (
                      <video
                        src={event.media.url}
                        controls
                        className="max-w-full h-auto rounded-md"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {data.maxVisible && events.length > data.maxVisible && (
        <div className="px-6 pb-6 text-sm text-muted-foreground">
          +{events.length - data.maxVisible} more events
        </div>
      )}
    </div>
  );
}
