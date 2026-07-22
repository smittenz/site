import { useEffect, useMemo, useState } from "react";
import "./embedded-video.css";

export function isHostedVideo(src = "") {
  return /(?:youtube(?:-nocookie)?\.com|youtu\.be|player\.vimeo\.com)/i.test(src);
}

function getProvider(src) {
  if (/vimeo\.com/i.test(src)) return "Vimeo";
  if (/youtu(?:be|\.be)|youtube/i.test(src)) return "YouTube";
  return "Video";
}

function getYouTubePoster(src) {
  const match = src.match(/(?:embed\/|youtu\.be\/|[?&]v=)([\w-]{6,})/i);
  return match ? `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg` : "";
}

function getPlaybackSrc(src) {
  try {
    const url = new URL(src);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("playsinline", "1");
    if (/youtube/i.test(url.hostname)) url.searchParams.set("rel", "0");
    if (/vimeo/i.test(url.hostname)) {
      url.searchParams.set("title", "0");
      url.searchParams.set("byline", "0");
      url.searchParams.set("portrait", "0");
    }
    return url.toString();
  } catch {
    return src;
  }
}

export default function EmbeddedVideo({
  src,
  title = "Embedded video",
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  poster = "",
  loading = "lazy",
  className = "",
}) {
  const [playing, setPlaying] = useState(false);
  const provider = getProvider(src);
  const posterSrc = poster || getYouTubePoster(src);
  const playbackSrc = useMemo(() => getPlaybackSrc(src), [src]);

  useEffect(() => setPlaying(false), [src]);

  return (
    <div className={`embedded-video${playing ? " is-playing" : ""}${className ? ` ${className}` : ""}`}>
      {playing ? (
        <iframe
          src={playbackSrc}
          title={title}
          allow={allow}
          allowFullScreen
          loading={loading}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          className="embedded-video-cover"
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
        >
          {posterSrc && <img src={posterSrc} alt="" loading={loading} />}
          <span className="embedded-video-shade" aria-hidden="true" />
          <span className="embedded-video-register" aria-hidden="true"><i /> <i /> <i /> <i /></span>
          <span className="embedded-video-play" aria-hidden="true"><i /></span>
          <span className="embedded-video-readout" aria-hidden="true">
            <b>PLAY FILM</b><i>{provider} / EXTERNAL SIGNAL</i>
          </span>
        </button>
      )}
    </div>
  );
}
