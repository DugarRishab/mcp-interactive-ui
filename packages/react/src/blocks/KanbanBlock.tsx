import type { KanbanData } from '@mcp-interactive-ui/types';

export interface KanbanBlockProps {
  data: KanbanData;
  className?: string;
}

export function KanbanBlock({ data, className }: KanbanBlockProps): JSX.Element {
  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {data.title && (
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      <div className="p-6 overflow-x-auto">
        <div className="flex gap-6">
          {data.columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-muted rounded-lg p-4"
              style={{ backgroundColor: column.color ? `${column.color}20` : undefined }}
            >
              {/* Column header */}
              <h4 className="font-semibold text-sm mb-4">{column.title}</h4>

              {/* Cards */}
              <div className="space-y-3">
                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-background rounded-md p-3 border border-input hover:shadow-md transition-shadow cursor-move"
                  >
                    <h5 className="font-medium text-sm">{card.title}</h5>

                    {card.description && (
                      <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                    )}

                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Priority and due date */}
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      {card.priority && (
                        <span
                          className={`px-2 py-1 rounded ${
                            card.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : card.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {card.priority}
                        </span>
                      )}
                      {card.dueDate && (
                        <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
