// Pre-launch gate: checks if mock awards are enabled in src/data/awards.js.
// Prints a loud warning if mock data is active so it cannot ship to production silently.
// Does NOT fail the build, as mock awards are approved for layout review under Decision D12.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const awardsFile = path.join(root, 'src/data/awards.js');

try {
  const content = fs.readFileSync(awardsFile, 'utf8');
  const isMockEnabled = /SHOW_MOCK_AWARDS\s*=\s*true/.test(content);
  const hasMockEntries = /mock:\s*true/.test(content);

  if (isMockEnabled && hasMockEntries) {
    console.warn('\n================================================================');
    console.warn('⚠️  PRE-LAUNCH WARNING: MOCK AWARDS DATA IS CURRENTLY ACTIVE');
    console.warn('----------------------------------------------------------------');
    console.warn('src/data/awards.js is rendering placeholder mock entries (mock: true).');
    console.warn('Replace with confirmed client awards before public launch.');
    console.warn('To show the honest empty state instead, set SHOW_MOCK_AWARDS = false.');
    console.warn('================================================================\n');
  }
} catch (err) {
  console.warn(`check-mock-data: unable to read awards file (${err.message})`);
}
