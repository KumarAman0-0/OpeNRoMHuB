"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AdminModal from "./AdminModal";

export default function AdminWordmark() {
  const [clickCount, setClickCount] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Global keyboard listener for Ctrl + Shift combo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger on Ctrl + Shift (or Ctrl + Shift + A / Enter)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const nextCount = clickCount + 1;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (nextCount >= 5) {
      e.preventDefault();
      setClickCount(0);
      setIsAdminOpen(true);
      return;
    }

    // If rapid clicks (2+), prevent accidental page navigation so clicks can register
    if (nextCount >= 2) {
      e.preventDefault();
    }

    setClickCount(nextCount);

    // Reset click count after 2.5 seconds if 5 clicks not reached
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2500);
  };

  return (
    <>
      <Link
        href="/"
        className="mono wordmark admin-wordmark-trigger"
        onClick={handleClick}
        title="OPEN ROM HUB (Tip: Click 5x or press Ctrl+Shift for Admin Panel)"
      >
        OPEN ROM HUB
        {clickCount >= 2 && (
          <span className="admin-click-hint mono"> [{clickCount}/5]</span>
        )}
      </Link>

      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
}
