import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import PropTypes from "prop-types";

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const [loopStartTime, setLoopStartTime] = useState(0);
  const [loopEndTime, setLoopEndTime] = useState(10);
  const [isLooping, setIsLooping] = useState(true);
  const [videoDuration, setVideoDuration] = useState(600);
  const [volume, setVolume] = useState(50);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [url, setUrl] = useState("");

  const onPlayerReady = () => {
    playerRef.current.internalPlayer.getDuration().then((duration) => {
      setVideoDuration(duration);
      setLoopEndTime(duration);
    });
    playerRef.current.internalPlayer.setVolume(volume);
    playerRef.current.internalPlayer.setPlaybackRate(playbackRate);
  };

  useEffect(() => {
    let interval;
    if (isLooping) {
      interval = setInterval(() => {
        playerRef.current.internalPlayer
          .getCurrentTime()
          .then((currentTime) => {
            if (
              currentTime >=
              loopEndTime / playbackRate
              //    > 1
              //     ? playbackRate
              //     : 1 / playbackRate
            ) {
              playerRef.current.internalPlayer.seekTo(loopStartTime);
            }
          });
      }, 500);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLooping, loopStartTime, loopEndTime, playbackRate]);

  const onPlayerStateChange = (event) => {
    console.log("PlayerStateChange", event.data);
  };

  const playerOptions = {
    height: "390",
    width: "640",
    videoId: videoId,
  };

  const playVideo = () => {
    setIsLooping(true);
    playerRef.current.internalPlayer.seekTo(loopStartTime);
    playerRef.current.internalPlayer.playVideo();
  };

  const pauseVideo = () => {
    playerRef.current.internalPlayer.pauseVideo();
  };

  const stopVideo = () => {
    setIsLooping(false);
    playerRef.current.internalPlayer.seekTo(loopStartTime);
    playerRef.current.internalPlayer.stopVideo();
  };

  const handleLoopStartTimeChange = (event) => {
    setLoopStartTime(Number(event.target.value));
  };

  const handleLoopEndTimeChange = (event) => {
    setLoopEndTime(Number(event.target.value));
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    playerRef.current.internalPlayer.setVolume(newVolume);
  };

  const handlePlaybackRateChange = (event) => {
    const newPlaybackRate = Number(event.target.value);
    setPlaybackRate(newPlaybackRate);
    playerRef.current.internalPlayer.setPlaybackRate(newPlaybackRate);
  };

  const handleUrlChange = () => {
    const videoId = url.slice(url.lastIndexOf("v=") + 2);
    // const videoId = new URLSearchParams(url).get("v");
    playerRef.current.internalPlayer.loadVideoById(videoId);
  };

  return (
    <div style={{ paddingBottom: "48px" }}>
      <YouTube
        videoId={playerOptions.videoId}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        ref={playerRef}
      />
      <button onClick={playVideo}>Play</button>
      <button onClick={pauseVideo}>Pause</button>
      <button onClick={stopVideo}>Stop</button>
      <div>
        <label>
          Loop Start Time: {loopStartTime}s
          <input
            type="range"
            min="0"
            max={loopEndTime}
            value={loopStartTime}
            onChange={handleLoopStartTimeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Loop End Time: {loopEndTime}s
          <input
            type="range"
            min={loopStartTime}
            max={videoDuration}
            value={loopEndTime}
            onChange={handleLoopEndTimeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Volume: {volume}%
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Playback Rate: {playbackRate}x
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.01"
            value={playbackRate}
            onChange={handlePlaybackRateChange}
          />
        </label>
      </div>
      <div>
        <label>
          URL :{" "}
          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        <button onClick={handleUrlChange}>go</button>
      </div>
    </div>
  );
};

YouTubePlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
};

YouTubePlayer.defaultProps = {
  videoId: "dQw4w9WgXcQ", // Pickle Rick Astley!
};

export default YouTubePlayer;
