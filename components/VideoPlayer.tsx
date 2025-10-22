
import React from 'react';

interface VideoPlayerProps {
  videoId: string;
}

// Wrap the component in React.memo to prevent unnecessary re-renders.
const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(({ videoId }) => {
  // Construct the YouTube embed URL with autoplay, mute, loop, and no controls
  // Added `playsinline=1` for better mobile compatibility and potentially smoother playback.
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1`;

  return (
    // Responsive container with 16:9 aspect ratio
    <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={embedUrl}
        title="Background sports video"
        allow="autoplay; encrypted-media"
        className="absolute top-0 left-0 w-full h-full border-0 rounded-lg shadow-2xl ring-1 ring-white/10"
      ></iframe>
      {/* This overlay prevents all user interaction with the video player. */}
      <div className="absolute top-0 left-0 w-full h-full"></div>
    </div>
  );
});

export default VideoPlayer;
