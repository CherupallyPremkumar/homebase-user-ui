import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface AnimatedRatingProps {
  rating: number;
  maxRating?: number;
  duration?: number;
}

export const AnimatedRating = ({ 
  rating, 
  maxRating = 5, 
  duration = 1500 
}: AnimatedRatingProps) => {
  const [displayRating, setDisplayRating] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentRating = rating * easeOutCubic;

      setDisplayRating(currentRating);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [rating, duration]);

  const fullStars = Math.floor(displayRating);
  const partialStar = displayRating - fullStars;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => {
          if (index < fullStars) {
            // Full star
            return (
              <Star
                key={index}
                className="h-5 w-5 fill-primary text-primary transition-all duration-300"
                style={{
                  animation: `starPop 0.3s ease-out ${index * 0.1}s both`,
                }}
              />
            );
          } else if (index === fullStars && partialStar > 0) {
            // Partial star
            return (
              <div key={index} className="relative h-5 w-5">
                <Star className="h-5 w-5 text-border absolute" />
                <div
                  className="overflow-hidden absolute top-0 left-0 transition-all duration-300"
                  style={{ width: `${partialStar * 100}%` }}
                >
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
              </div>
            );
          } else {
            // Empty star
            return (
              <Star
                key={index}
                className="h-5 w-5 text-border"
              />
            );
          }
        })}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground font-mono">
          {displayRating.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">/ {maxRating}</span>
      </div>
    </div>
  );
};

// Add CSS animation to your index.css or as a style tag
const styles = `
  @keyframes starPop {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(5deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
