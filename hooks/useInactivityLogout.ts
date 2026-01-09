import { useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * Custom hook to automatically logout admin after 5 minutes of inactivity
 * Monitors user activity: mouse, keyboard, touch, scroll events
 */
export function useInactivityLogout(isAuthenticated: boolean, onLogout: () => void) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

  const resetTimer = () => {
    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timer if user is authenticated
    if (isAuthenticated) {
      // Set new timer for auto-logout
      timeoutRef.current = setTimeout(() => {
        handleAutoLogout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleAutoLogout = async () => {
    try {
      // Call logout API
      await axios.post('/api/auth/logout');
      // Call the logout handler
      onLogout();
    } catch (error) {
      console.error('Auto-logout error:', error);
      // Even if logout fails, redirect
      onLogout();
    }
  };

  useEffect(() => {
    // Only set up activity monitoring if user is authenticated
    if (!isAuthenticated) {
      // Clear timer if not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Initial timer setup
    resetTimer();

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    // Add event listeners
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Also listen to visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, onLogout]);
}
