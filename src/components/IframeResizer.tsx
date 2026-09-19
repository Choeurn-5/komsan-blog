"use client";

import { useEffect } from "react";

export function IframeResizer() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.parent || window === window.parent) {
      return;
    }

    const sendHeight = () => {
      window.parent.postMessage({ type: "komsan-height", height: document.documentElement.scrollHeight }, "*");
    };

    // Send on load
    sendHeight();
    
    // Wait for images and fonts to load
    window.addEventListener("load", sendHeight);
    
    // Watch for window resize
    window.addEventListener("resize", sendHeight);

    // Watch for DOM mutations that might change height
    const observer = new MutationObserver(sendHeight);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("load", sendHeight);
      window.removeEventListener("resize", sendHeight);
      observer.disconnect();
    };
  }, []);

  return null;
}
