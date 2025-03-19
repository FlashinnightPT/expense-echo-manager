
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
    
    // Ensure dates are properly serialized
    const processedData = { ...data };
    if (processedData.startDate instanceof Date) {
      processedData.startDate = processedData.startDate;
    }
    if (processedData.endDate instanceof Date) {
      processedData.endDate = processedData.endDate;
    }
    
    document.dispatchEvent(new CustomEvent(event, { detail: processedData }));
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
      
      // Process dates if needed
      const processedData = { ...data };
      
      // Make sure dates are proper Date objects
      if (processedData.startDate && !(processedData.startDate instanceof Date)) {
        processedData.startDate = new Date(processedData.startDate);
      }
      if (processedData.endDate && !(processedData.endDate instanceof Date)) {
        processedData.endDate = new Date(processedData.endDate);
      }
      
      setEventData(processedData);
      callback(processedData);
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
