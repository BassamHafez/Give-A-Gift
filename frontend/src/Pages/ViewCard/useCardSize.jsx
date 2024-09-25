import { useState, useEffect } from "react";

const useCardSize = (initialWidth, aspectRatio = 16 / 9) => {
  const [cardWidth, setCardWidth] = useState(initialWidth);
  const [cardHeight, setCardHeight] = useState(initialWidth / aspectRatio);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth * 0.9 : initialWidth;
      setCardWidth(width);
      setCardHeight(width / aspectRatio);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [initialWidth, aspectRatio]);

  return { cardWidth, cardHeight };
};

export default useCardSize;
