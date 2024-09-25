import { useState, useEffect } from "react";

const useIsSmallScreen = (maxWidth = 480) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= maxWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= maxWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth]);

  return isSmallScreen;
};

export default useIsSmallScreen;
