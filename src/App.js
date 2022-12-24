import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import ProgressBarNumbers from "./ProgressBarNumbers";
import "./styles.css";

export default function App() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [inputString, setInputString] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const apiKey = "AIzaSyCuZ9KpPcQs1Oq8ntiNadJdrFX61krPJFI";

  //Get video title from youtube API and total video duration from ref.
  const onVideoChange = () => {
    const video = ref.current;
    setVideoDuration(video.getDuration());
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = youtubeVideoUrl.match(regExp);
    let videoId = match && match[7].length === 11 ? match[7] : false;
    fetch(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
        videoId +
        "&key=" +
        apiKey
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setVideoTitle(result.items[0].snippet.title);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  //Set progress bar to current playedSeconds of video
  const handleProgress = (e) => {
    setPlayed(e.playedSeconds);
  };
  //Set video to desired point after clicking the progress bar
  const handleProgressBarChange = (e) => {
    const video = ref.current;
    const fraction = e.target.value / videoDuration;
    video.seekTo(fraction, "fraction");
  };
  //Set input value to InputString onChange
  const handleSetInputString = (e) => {
    setInputString(e.target.value);
  };
  //Set youtubeVideoUrl with the inputString onClick of Get Video button
  const handleSetYoutubeVideoUrl = () => {
    setYoutubeVideoUrl(inputString);
  };

  return (
    <div className="container">
      <div>
        <div className="input-container">
          <h4>YoutubeUrl</h4>
          <input
            className="url-input"
            type="text"
            onChange={handleSetInputString}
            value={inputString}
          />
          <button onClick={handleSetYoutubeVideoUrl}>Get Video</button>
        </div>
      </div>

      <div className="video-section">
        <h3>Title:{videoTitle}</h3>
        <div className="video-box">
          <div className="player-wrapper">
            <ReactPlayer
              ref={ref}
              url={youtubeVideoUrl}
              volume={1}
              controls={false}
              className="react-player"
              onReady={onVideoChange}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 0,
                    controls: 0,
                    fs: 0,
                    rel: 0,
                    showinfo: 0
                  }
                }
              }}
              playing={playing}
              style={{}}
              onProgress={handleProgress}
            />
          </div>
          <div className="video-controllers">
            <ProgressBarNumbers seconds={played} />
            <input
              type="range"
              value={played}
              onChange={handleProgressBarChange}
              min={0}
              max={videoDuration}
            />
            <ProgressBarNumbers seconds={videoDuration} />
            <button
              onClick={() => {
                setPlaying(true);
              }}
            >
              <strong>Play</strong>
            </button>
            <button
              onClick={() => {
                setPlaying(false);
              }}
            >
              <strong>Pause</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
