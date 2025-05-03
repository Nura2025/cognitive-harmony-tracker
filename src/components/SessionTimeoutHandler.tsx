
import { useEffect } from 'react';
import { useSessionTimeout } from '@/services/session-manager';

const SessionTimeoutHandler = () => {
  // Initialize session timeout tracking
  useSessionTimeout();
  
  return null; // This is a utility component that doesn't render anything
};

export default SessionTimeoutHandler;
