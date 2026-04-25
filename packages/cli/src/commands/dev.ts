import chalk from 'chalk';
import { spawn } from 'child_process';
import fs from 'fs-extra';

interface DevOptions {
  port?: string;
}

export async function devCommand(options: DevOptions = {}): Promise<void> {
  const port = parseInt(options.port || '3000', 10);

  console.log(chalk.blue('Starting development mode...\n'));

  // Check for package.json
  if (!await fs.pathExists('package.json')) {
    console.error(chalk.red('No package.json found. Run this in your project root.'));
    return;
  }

  // Try to detect dev script
  const pkg = await fs.readJson('package.json');
  const hasDevScript = pkg.scripts?.dev || pkg.scripts?.start;

  if (!hasDevScript) {
    console.error(chalk.red('No dev/start script found in package.json'));
    return;
  }

  const script = pkg.scripts.dev ? 'dev' : 'start';
  console.log(chalk.gray(`Running: npm run ${script}`));

  const child = spawn('npm', ['run', script], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: String(port) }
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
