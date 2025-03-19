
import { useEffect, useState } from "react";

// Define possible event types
type EventTypes = "dateRangeChanged" | "categorySelected";

// Event bus for communication between components
const eventBus = {
  on(event: EventTypes, callback: (data: any) => void) {
    document.addEventListener(event, (e: any) => callback(e.detail));
  },
  
  remove(event: EventTypes, callback: (data: any) => void) {
    document.removeEventListener(event, (e: any) => callback(e.detail));
  },
  
  publish(event: EventTypes, data: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
};

// Hook to consume the event bus
export const useEventBus = () => {
  const [eventData, setEventData] = useState<any>(null);
  
  // Subscribe to an event
  const subscribe = (event: EventTypes, callback: (data: any) => void) => {
    const handler = (data: any) => {
      setEventData(data);
      callback(data);
    };
    
    eventBus.on(event, handler);
    
    return () => {
      eventBus.remove(event, handler);
    };
  };
  
  // Publish an event
  const publish = (event: EventTypes, data: any) => {
    eventBus.publish(event, data);
  };
  
  return {
    subscribe,
    publish,
    eventData
  };
};
