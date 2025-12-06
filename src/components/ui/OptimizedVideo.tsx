import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "21/9" | "1/1";
  overlay?: boolean;
}

export const OptimizedVideo = ({
  src,
  poster,
  className = "",
  aspectRatio = "16/9",
  overlay = true,
}: OptimizedVideoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => setIsLoaded(true);
      video.addEventListener("canplay", handleCanPlay);
      
      // Check if already loaded
      if (video.readyState >= 3) {
        setIsLoaded(true);
      }
      
      return () => video.removeEventListener("canplay", handleCanPlay);
    }
  }, []);

  const aspectClass = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "21/9": "aspect-[21/9]",
    "1/1": "aspect-square",
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0" />
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/90" />
      )}
    </div>
  );
};

export default OptimizedVideo;