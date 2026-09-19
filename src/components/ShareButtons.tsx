"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // The user explicitly requested this exact base URL to be used for sharing.
  // We append ?post=slug so that it's at least uniquely identifiable if they handle it later.
  const shareUrl = `https://komsankampotresort.com/blog/?post=${slug}`;

  const handleCopy = (message: string = "Link copied to clipboard!") => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setToastMessage(message);
      setTimeout(() => {
        setCopied(false);
        setToastMessage("");
      }, 3000);
    });
  };

  const handleNativeShare = async (platform: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Read this story from Komsan Kampot Resort: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to copy if user cancels or share fails
        console.log("Error sharing natively:", err);
      }
    } else {
      // Fallback for desktop devices without native share
      handleCopy(`Link copied! Ready to share on ${platform}.`);
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4 py-8 border-t border-[var(--brand-muted)]/20 mt-10">
      <h3 className="text-sm font-semibold text-[var(--brand-text)] uppercase tracking-wider">Share this story</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Copy Link */}
        <button 
          onClick={() => handleCopy()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-surface)] border border-[var(--brand-muted)]/30 hover:border-[var(--brand-accent)] transition-colors text-sm text-[var(--brand-text)]"
          aria-label="Copy link"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          )}
          Copy Link
        </button>

        {/* Facebook */}
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877F2] hover:opacity-90 transition-opacity text-white"
          aria-label="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>

        {/* Telegram */}
        <a 
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#229ED9] hover:opacity-90 transition-opacity text-white"
          aria-label="Share on Telegram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </a>

        {/* Instagram (Uses Native Web Share or falls back to Copy) */}
        <button 
          onClick={() => handleNativeShare('Instagram')}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 transition-opacity text-white"
          aria-label="Share on Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </button>

        {/* TikTok (Uses Native Web Share or falls back to Copy) */}
        <button 
          onClick={() => handleNativeShare('TikTok')}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-black dark:bg-white hover:opacity-80 transition-opacity text-white dark:text-black"
          aria-label="Share on TikTok"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.97-1.539 4.994 4.994 0 0 1-1.134-3.536h-3.414v13.68c0 2.21-1.8 4-4.01 4-2.209 0-4-1.79-4-4s1.791-4 4-4c.483 0 .942.086 1.37.243V8.127A7.447 7.447 0 0 0 7.07 7.73c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5V11.17a8.552 8.552 0 0 0 5.019 1.636V9.382a5.558 5.558 0 0 1-2.484-2.696z"/></svg>
        </button>
      </div>

      {toastMessage && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 transition-all animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
