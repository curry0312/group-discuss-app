import { useEffect } from "react";
import { useState } from "react";
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const scrolld = (winScroll/height)*100;
    setScrollPosition(scrolld);
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return scrollPosition
}
