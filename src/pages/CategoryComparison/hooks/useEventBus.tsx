
import { useEffect, useState } from "react";

// Define possible event types
export type EventTypes = "dateRangeChanged" | "categorySelected";

interface EventDetail {
  [key: string]: any;
}

// Event bus for communication between components
const eventBus = {
  on(event: EventTypes, callback: (data: EventDetail) => void) {
    document.addEventListener(event, (e: any) => callback(e.detail));
  },
  
  remove(event: EventTypes, callback: (data: EventDetail) => void) {
    document.removeEventListener(event, (e: any) => callback(e.detail));
  },
  
  publish(event: EventTypes, data: EventDetail) {
    console.log(`Publishing event: ${event}`, data);
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
};

// Hook to consume the event bus
export const useEventBus = () => {
  const [eventData, setEventData] = useState<EventDetail | null>(null);
  
  // Subscribe to an event
  const subscribe = (event: EventTypes, callback: (data: EventDetail) => void) => {
    console.log(`Subscribing to event: ${event}`);
    
    const handler = (data: EventDetail) => {
      console.log(`Event received: ${event}`, data);
      setEventData(data);
      callback(data);
    };
    
    eventBus.on(event, handler);
    
    return () => {
      console.log(`Unsubscribing from event: ${event}`);
      eventBus.remove(event, handler);
    };
  };
  
  // Publish an event
  const publish = (event: EventTypes, data: EventDetail) => {
    console.log(`Publishing event through hook: ${event}`, data);
    eventBus.publish(event, data);
  };
  
  return {
    subscribe,
    publish,
    eventData
  };
};
