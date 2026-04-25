import type { ChartData } from '@mcp-interactive-ui/types';

export interface ChartBlockProps {
  data: ChartData;
  className?: string;
}

/**
 * Renders a `chart` block with shadcn/ui styling.
 * Uses simple SVG-based charts for bar, line, pie, and area charts.
 */
export function ChartBlock({ data, className }: ChartBlockProps): JSX.Element {
  const height = data.options?.height || 300;
  const showLegend = data.options?.legend !== false;
  const showGrid = data.options?.grid !== false;

  // Simple bar chart renderer
  const renderBarChart = () => {
    if (!data.data.labels || !data.data.datasets) return null;

    const maxValue = Math.max(
      ...data.data.datasets.flatMap(d => d.data)
    );
    const chartHeight = height - 60;
    const chartWidth = 720; // Available width after margins
    const leftMargin = 60;
    const rightMargin = 20;
    const groupWidth = chartWidth / data.data.labels.length;
    const barWidth = (groupWidth * 0.9) / data.data.datasets.length; // 90% of group for bars, 10% for gap

    return (
      <svg viewBox={`0 0 800 ${height}`} className="w-full">
        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`grid-${ratio}`}
                x1={leftMargin - 10}
                y1={40 + (1 - ratio) * chartHeight}
                x2={leftMargin + chartWidth}
                y2={40 + (1 - ratio) * chartHeight}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
            ))}
          </>
        )}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <text
            key={`label-${ratio}`}
            x={leftMargin - 15}
            y={50 + (1 - ratio) * chartHeight}
            textAnchor="end"
            fontSize="12"
            fill="currentColor"
            opacity="0.7"
          >
            {Math.round(maxValue * ratio)}
          </text>
        ))}

        {/* Bars */}
        {data.data.datasets.map((dataset, datasetIdx) => (
          <g key={`dataset-${datasetIdx}`}>
            {data.data.labels.map((label, labelIdx) => {
              const value = dataset.data[labelIdx] || 0;
              const ratio = maxValue > 0 ? value / maxValue : 0;
              const groupX = leftMargin + labelIdx * groupWidth;
              const barOffset = datasetIdx * barWidth;
              const x = groupX + (groupWidth * 0.05) + barOffset; // 5% padding on each side of group
              const barHeight = ratio * chartHeight;
              const y = 40 + chartHeight - barHeight;

              return (
                <rect
                  key={`bar-${datasetIdx}-${labelIdx}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={dataset.color || `hsl(${datasetIdx * 60}, 70%, 50%)`}
                  opacity="0.8"
                />
              );
            })}
          </g>
        ))}

        {/* X-axis labels */}
        {data.data.labels.map((label, idx) => (
          <text
            key={`x-label-${idx}`}
            x={leftMargin + idx * groupWidth + groupWidth / 2}
            y={height - 20}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            opacity="0.7"
          >
            {label}
          </text>
        ))}
      </svg>
    );
  };

  // Simple pie chart renderer
  const renderPieChart = () => {
    if (!data.data.datasets || data.data.datasets.length === 0) return null;

    const dataset = data.data.datasets[0];
    if (!dataset) return null;

    const total = dataset.data.reduce((a, b) => a + b, 0);
    const centerX = 200;
    const centerY = height / 2;
    const radius = Math.min(height, 300) / 2 - 20;

    let currentAngle = -Math.PI / 2;
    const slices = dataset.data.map((value, idx) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      currentAngle = endAngle;

      return (
        <path
          key={`slice-${idx}`}
          d={pathData}
          fill={dataset.color || `hsl(${idx * (360 / dataset.data.length)}, 70%, 50%)`}
          opacity="0.8"
        />
      );
    });

    return (
      <svg viewBox={`0 0 400 ${height}`} className="w-full">
        {slices}
      </svg>
    );
  };

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {/* Header */}
      {(data.title || data.description) && (
        <div className="p-6 pb-0">
          {data.title && <h3 className="text-lg font-semibold">{data.title}</h3>}
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
        </div>
      )}

      {/* Chart */}
      <div className="p-6 w-full" style={{ minHeight: `${height}px` }}>
        {data.type === 'bar' && renderBarChart()}
        {data.type === 'pie' && renderPieChart()}
        {!['bar', 'pie'].includes(data.type) && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Chart type "{data.type}" not yet implemented
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && data.data.datasets && (
        <div className="px-6 pb-6 flex flex-wrap gap-4">
          {data.data.datasets.map((dataset, idx) => (
            <div key={`legend-${idx}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: dataset.color || `hsl(${idx * 60}, 70%, 50%)`,
                }}
              />
              <span className="text-sm text-muted-foreground">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
