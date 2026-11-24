import { execFileSync, spawnSync } from 'node:child_process';
import { join, posix, dirname } from 'node:path';

process.env.DOCKER_CLI_HINTS = 'false'; // Disable docker ai usage hint "gordan"

// Which workspace to build & test. Pass as the first arg:
//   npm run test -- <workspace> [playwright args...]
// e.g. `npm run test -- site-rueberg --update-snapshots`.
const [workspace, ...forwardedArgs] = process.argv.slice(2);

if (!workspace) {
  console.error('Usage: npm run test -- <workspace> [playwright args...]');
  process.exit(1);
}
if (workspace.startsWith('-')) {
  console.error(`Expected a workspace name as first argument, got flag "${workspace}".`);
  console.error('Usage: npm run test -- <workspace> [playwright args...]');
  process.exit(1);
}

const tag = `${workspace}-visual-testing`;
const dockerfile = '.github/testing/playwright.Dockerfile';

const workspaceDir = join(import.meta.dirname, '..', '..');
const dockerMapDir = (p) => posix.join(workspaceDir, p) + ':' + posix.join('/app', p);

// Optional docker args
const summaryDir = dirname(process.env.GITHUB_STEP_SUMMARY ?? '');
const summaryVolume = ['-v', `${summaryDir}:${summaryDir}`];
const githubCache = ['--cache-from=type=gha', '--cache-to=type=gha,mode=max'];

// Build Docker image using BuildKit via docker buildx
execFileSync('docker', [
  'buildx', 'build',
  '-f', dockerfile,
  '-t', tag,
  '--build-arg', `WORKSPACE=${workspace}`,
  ...(process.env.GITHUB_ACTIONS ? githubCache : []),
  '--load', workspaceDir
], { stdio: 'inherit' });

const result = spawnSync('docker', [
  'run',
  '--rm',
  '-e', 'CI',
  '-e', 'GITHUB_ACTIONS',
  '-e', 'GITHUB_STEP_SUMMARY',
  '-e', `WORKSPACE=${workspace}`,
  '-p', '9000:9000', // Port for playwright --ui
  '-v', dockerMapDir(`packages/${workspace}/snapshots`),
  '-v', dockerMapDir('.github/report'),
  ...(process.env.GITHUB_STEP_SUMMARY ? summaryVolume : []),
  tag,
  ...forwardedArgs // pass through CLI args (e.g. --update-snapshots)
], { stdio: 'inherit' });

process.exit(result.status ?? 1);
