import gsap from "gsap"; // GSAP animation library
import { useGSAP } from "@gsap/react"; // React hook for GSAP
import { ScrollTrigger } from "gsap/all"; // GSAP scroll-based animations
import { TiLocationArrow } from "react-icons/ti"; // Arrow icon component
import { useEffect, useRef, useState } from "react"; // React hooks

import Button from "./Button"; // Custom button component
import VideoPreview from "./VideoPreview"; // Video preview wrapper component

// Register GSAP plugin for scroll-triggered animations
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  // STATE MANAGEMENT
  const [currentIndex, setCurrentIndex] = useState(1); // Track which video is currently active (1-4)
  const [hasClicked, setHasClicked] = useState(false); // Track if user clicked the mini video
  const [loading, setLoading] = useState(true); // Show loading screen while videos load
  const [loadedVideos, setLoadedVideos] = useState(0); // Count how many videos have loaded

  // CONSTANTS
  const totalVideos = 4; // Total number of hero videos
  const nextVdRef = useRef(null); // Reference to the next video element for direct control

  // VIDEO LOADING HANDLER
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1); // Increment loaded video count
  };

  // LOADING STATE MANAGEMENT
  useEffect(() => {
    // Hide loading screen when 3 out of 4 videos are loaded
    // (Note: This might cause issues - should probably be totalVideos instead)
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  // MINI VIDEO CLICK HANDLER
  const handleMiniVdClick = () => {
    setHasClicked(true); // Trigger animation
    // Cycle to next video (1-4, wrapping back to 1 after 4)
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // GSAP ANIMATION FOR VIDEO TRANSITIONS
  useGSAP(
    () => {
      if (hasClicked) {
        // Make next video visible and animate it to full size
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1, // Scale to normal size
          width: "100%", // Full width
          height: "100%", // Full height
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current.play(), // Start playing when animation begins
        });
        // Animate current video preview from small to normal
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0, // Start from invisible
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex], // Re-run when currentIndex changes
      revertOnUpdate: true, // Reset animations when dependencies change
    }
  );

  // GSAP SCROLL-TRIGGERED ANIMATION FOR VIDEO FRAME
  useGSAP(() => {
    // Set final state - irregular polygon shape with rounded corner
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)", // Irregular shape
      borderRadius: "0% 0% 40% 10%", // Rounded bottom-left corner
    });
    // Animate from rectangle to final shape on scroll
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Start as rectangle
      borderRadius: "0% 0% 0% 0%", // Start with no rounded corners
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame", // Element that triggers the animation
        start: "center center", // When center of trigger hits center of viewport
        end: "bottom center", // When bottom of trigger hits center of viewport
        scrub: true, // Animation tied to scroll position
      },
    });
  });

  // UTILITY FUNCTION
  const getVideoSrc = (index) => `videos/hero-${index}.mp4`; // Generate video file path

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* LOADING SCREEN - Shows while videos are loading */}
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* Animated loading dots */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* MAIN VIDEO CONTAINER */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          {/* MINI VIDEO PREVIEW (clickable) */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                {/* Preview of NEXT video */}
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)} // Next video in sequence
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad} // Count this video as loaded
                />
              </div>
            </VideoPreview>
          </div>

          {/* NEXT VIDEO (hidden until clicked) */}
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)} // Current video
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad} // Count this video as loaded
          />
          
          {/* BACKGROUND VIDEO (always playing) */}
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex // If at last video, show first; otherwise show current
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad} // Count this video as loaded
          />
        </div>

        {/* BOTTOM RIGHT TITLE */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>

        {/* MAIN CONTENT OVERLAY */}
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            {/* MAIN TITLE */}
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            {/* SUBTITLE */}
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            {/* CALL TO ACTION BUTTON */}
            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      {/* DUPLICATE TITLE (outside video frame) */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;