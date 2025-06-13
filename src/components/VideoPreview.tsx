import { gsap } from "gsap"; // GSAP animation library for smooth animations
import { useState, useRef, useEffect } from "react"; // React hooks

// COMPONENT: Creates a 3D hover effect container for video previews
export const VideoPreview = ({ children }) => {
  // STATE: Track if user is hovering over the component
  const [isHovering, setIsHovering] = useState(false);

  // REFS: References to DOM elements for direct manipulation
  const sectionRef = useRef(null); // Reference for the outer container section
  const contentRef = useRef(null); // Reference for the inner content wrapper

  // MOUSE MOVEMENT HANDLER: Creates 3D parallax effect based on cursor position
  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    // Get the exact position and dimensions of the container
    const rect = currentTarget.getBoundingClientRect();

    // Calculate cursor position relative to center of container
    // Positive xOffset = cursor is right of center
    // Negative xOffset = cursor is left of center
    const xOffset = clientX - (rect.left + rect.width / 2);
    
    // Calculate cursor position relative to vertical center of container
    // Positive yOffset = cursor is below center
    // Negative yOffset = cursor is above center
    const yOffset = clientY - (rect.top + rect.height / 2);

    // Only animate if user is hovering
    if (isHovering) {
      // ANIMATE OUTER CONTAINER: Move and rotate based on cursor position
      gsap.to(sectionRef.current, {
        x: xOffset, // Move horizontally toward cursor
        y: yOffset, // Move vertically toward cursor
        rotationY: xOffset / 2, // Rotate around Y-axis (left/right tilt)
        rotationX: -yOffset / 2, // Rotate around X-axis (up/down tilt, inverted)
        transformPerspective: 500, // Set 3D perspective depth
        duration: 1, // Animation duration in seconds
        ease: "power1.out", // Smooth easing function
      });

      // ANIMATE INNER CONTENT: Create parallax by moving opposite direction
      gsap.to(contentRef.current, {
        x: -xOffset, // Move opposite to cursor horizontally
        y: -yOffset, // Move opposite to cursor vertically
        duration: 1, // Same duration for synchronization
        ease: "power1.out", // Same easing for consistency
      });
    }
  };

  // RESET ANIMATION: Return to center position when hover ends
  useEffect(() => {
    // Only run when isHovering changes to false
    if (!isHovering) {
      // RESET OUTER CONTAINER: Return to original position and rotation
      gsap.to(sectionRef.current, {
        x: 0, // Reset horizontal position
        y: 0, // Reset vertical position
        rotationY: 0, // Reset Y-axis rotation
        rotationX: 0, // Reset X-axis rotation
        duration: 1, // Smooth transition back
        ease: "power1.out", // Consistent easing
      });

      // RESET INNER CONTENT: Return to original position
      gsap.to(contentRef.current, {
        x: 0, // Reset horizontal offset
        y: 0, // Reset vertical offset
        duration: 1, // Match outer container duration
        ease: "power1.out", // Consistent easing
      });
    }
  }, [isHovering]); // Dependency: run when isHovering state changes

  return (
    // OUTER CONTAINER: Handles mouse events and provides 3D context
    <section
      ref={sectionRef} // Attach ref for GSAP animations
      onMouseMove={handleMouseMove} // Track mouse movement for 3D effect
      onMouseEnter={() => setIsHovering(true)} // Set hovering state on enter
      onMouseLeave={() => setIsHovering(false)} // Clear hovering state on leave
      className="absolute z-50 size-full overflow-hidden rounded-lg" // Styling classes
      style={{
        perspective: "500px", // CSS 3D perspective for realistic depth
      }}
    >
      {/* INNER CONTENT WRAPPER: Moves opposite to container for parallax */}
      <div
        ref={contentRef} // Attach ref for GSAP animations
        className="origin-center rounded-lg" // Center transform origin
        style={{
          transformStyle: "preserve-3d", // Maintain 3D transformations for children
        }}
      >
        {children} {/* Render whatever content is passed in (video, images, etc.) */}
      </div>
    </section>
  );
};

export default VideoPreview;