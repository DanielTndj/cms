import { useState, useEffect } from 'react';
import { ViewType } from '@technician/constants';

export function useResponsiveCalendar() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('month');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto switch to day view on mobile
      if (mobile && currentView === 'month') {
        setCurrentView('day');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [currentView]);

  const handleViewChange = (view: ViewType) => {
    // Prevent month view on mobile
    if (isMobile && view === 'month') {
      return;
    }
    setCurrentView(view);
  };

  return {
    isMobile,
    currentView,
    setCurrentView: handleViewChange,
    availableViews: isMobile ? ['day', 'week'] : ['day', 'week', 'month']
  };
}