import chalk from 'chalk';
import http from 'http';

interface PreviewOptions {
  port?: string;
}

export async function previewCommand(options: PreviewOptions = {}): Promise<void> {
  const port = parseInt(options.port || '3000', 10);

  console.log(chalk.blue(`Starting preview server on port ${port}...`));

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>MCP UI Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { color: #333; }
    .block { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
  </style>
</head>
<body>
  <h1>MCP Interactive UI Preview</h1>
  <p>Block preview server running on port ${port}</p>
  <div class="block">
    <p>Configure your blocks in .mcpui.json</p>
  </div>
</body>
</html>
    `);
  });

  server.listen(port, () => {
    console.log(chalk.green(`✓ Preview server running at http://localhost:${port}`));
  });
}
