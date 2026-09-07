import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

// House video defaults for the "obiceiurile care îți scumpesc creditul" series.
// The /animatie-video pieces render in-browser at 60fps; this remotion piece
// renders headless frame-by-frame, so 30fps here is fine and gets converted
// (frame-interpolated) in post if it needs to sit next to the 60fps pieces.
// png, nu jpeg — evită orice bandare de compresie pe câmpurile plate de
// culoare când criticii din /design-loop inspectează cadre statice.
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setConcurrency(2);

// Remotion normally downloads its own Chrome Headless Shell from
// remotion.media on first render. In this sandbox that host is blocked by
// the network egress allowlist, so we point it at the Playwright Chromium
// that already ships in this environment instead. On a machine where that
// path doesn't exist (a real workstation, CI, ...), this is a no-op and
// Remotion falls back to its normal download.
const playwrightHeadlessShell =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(playwrightHeadlessShell)) {
	Config.setBrowserExecutable(playwrightHeadlessShell);
}
