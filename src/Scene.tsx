import { staticFile } from "remotion";
import { getVideoMetadata, VideoMetadata } from "@remotion/media-utils";
import { ThreeCanvas, useVideoTexture } from "@remotion/three";
import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, useVideoConfig, Video } from "remotion";
import { IcosahedronComponent } from "./Icosahedron";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

const container: React.CSSProperties = {
  backgroundColor: "white",
};

const videoStyle: React.CSSProperties = {
  position: "absolute",
  opacity: 0,
};

export const myCompSchema = z.object({
  phoneColor: zColor(),
  deviceType: z.enum(["phone", "tablet"]),
});

type MyCompSchemaType = z.infer<typeof myCompSchema>;

export const Scene: React.FC<
  {
    baseScale: number;
  } & MyCompSchemaType
> = ({ baseScale, deviceType }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { width, height } = useVideoConfig();
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);

  const videoSrc =
    deviceType === "phone" ? staticFile("phone.mp4") : staticFile("tablet.mp4");

  useEffect(() => {
    getVideoMetadata(videoSrc)
      .then((data) => setVideoData(data))
      .catch((err) => console.log(err));
  }, [videoSrc]);

  const texture = useVideoTexture(videoRef);
  return (
    <AbsoluteFill style={container}>
      <Video ref={videoRef} src={videoSrc} style={videoStyle} />
      {videoData ? (
        <ThreeCanvas linear width={width} height={height}>
          <ambientLight intensity={1.5} color={0xffffff} />
          <pointLight position={[10, 10, 0]} />
          <IcosahedronComponent
            baseScale={baseScale}
            aspectRatio={videoData.aspectRatio}
          />
        </ThreeCanvas>
      ) : null}
    </AbsoluteFill>
  );
};
