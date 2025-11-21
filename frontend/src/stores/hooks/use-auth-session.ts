/**
 * Auth Session Hook
 * 
 * Enhanced auth hook with automatic token refresh and activity tracking
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { AUTH } from '@/config/constants';

export function useAuthSession() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tokenExpiry = useAuthStore((state) => state.tokenExpiry);
  const lastActivity = useAuthStore((state) => state.lastActivity);
  const actions = useAuthStore((state) => state.actions);
  
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated || !tokenExpiry) return;
    
    const checkAndRefresh = async () => {
      const now = Date.now();
      const timeUntilExpiry = tokenExpiry - now;
      const refreshThreshold = 5 * 60 * 1000; // 5 minutes
      
      if (timeUntilExpiry < refreshThreshold) {
        const success = await actions.refreshAccessToken();
        
        if (!success) {
          // Refresh failed, logout
          actions.logout();
        }
      }
    };
    
    // Check immediately
    checkAndRefresh();
    
    // Check every minute
    refreshTimerRef.current = setInterval(checkAndRefresh, 60 * 1000);
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [isAuthenticated, tokenExpiry, actions]);
  
  // Auto-logout on inactivity
  useEffect(() => {
    if (!isAuthenticated || !lastActivity) return;
    
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const inactivityLimit = AUTH.SESSION_TIMEOUT;
      
      if (inactiveTime > inactivityLimit) {
        actions.logout();
      }
    };
    
    // Check every minute
    activityTimerRef.current = setInterval(checkInactivity, 60 * 1000);
    
    return () => {
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
      }
    };
  }, [isAuthenticated, lastActivity, actions]);
  
  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const updateActivity = () => {
      actions.updateLastActivity();
    };
    
    // Track various user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated, actions]);
  
  return {
    isAuthenticated,
    tokenExpiry,
    lastActivity,
  };
}

