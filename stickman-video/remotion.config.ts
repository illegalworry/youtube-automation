import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 3D рисуется через WebGL: на Windows и Mac нужен режим angle
Config.setChromiumOpenGlRenderer("swangle");
Config.setEntryPoint("src/index.ts");
