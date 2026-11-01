import { Config } from "@remotion/cli/config";
// Linux/cloud without a GPU: software WebGL (SwiftShader via ANGLE), the pre-installed Chromium, long timeouts.
// On Windows/macOS with a GPU: ANGLE on the GPU, as in the original bridge project.
if (process.platform === "linux") {
  Config.setChromiumOpenGlRenderer((process.env.REMOTION_GL as "swangle") || "swangle");
  Config.setBrowserExecutable(process.env.BROWSER_EXECUTABLE || "/opt/pw-browsers/chromium");
  Config.setDelayRenderTimeoutInMilliseconds(600000);
  Config.setConcurrency(2);
} else {
  Config.setChromiumOpenGlRenderer("angle");
}
