/**
 * Lightweight network quality detection.
 * Uses the Network Information API where available, with a ping fallback.
 */

export function getConnectionQuality() {
  if (!navigator.onLine) return "offline";

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    const { effectiveType, downlink } = conn;
    if (effectiveType === "slow-2g" || effectiveType === "2g") return "poor";
    if (effectiveType === "3g" || (downlink && downlink < 1.5)) return "fair";
    return "good";
  }

  // API not available — assume online
  return "unknown";
}

export function isOnline() {
  return navigator.onLine;
}

/**
 * React hook that watches connectivity changes.
 */
import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [status, setStatus] = useState(() => {
    if (!navigator.onLine) return "offline";
    return getConnectionQuality();
  });

  useEffect(() => {
    const update = () => setStatus(navigator.onLine ? getConnectionQuality() : "offline");

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) conn.addEventListener("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      if (conn) conn.removeEventListener("change", update);
    };
  }, []);

  return status;
}