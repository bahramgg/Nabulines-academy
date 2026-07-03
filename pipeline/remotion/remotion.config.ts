import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 1080p H.264 per the master plan.
Config.setCodec("h264");
