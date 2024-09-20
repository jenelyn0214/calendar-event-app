import { CalendarEvent, CalendarEventData } from "../types";
import apiClient from "./apiClient";


// Create event (adds event to eventList and returns a resolved promise)
export async function createEvent(event: CalendarEventData): Promise<void> {
    const response = await apiClient.post('/events/', {...event, start_time: event.start, end_time: event.end});
    return response.data;
  }



// Delete event (removes the event from eventList based on eventId)
export async function deleteEvent(eventId: string): Promise<void> {
    const response = await apiClient.delete(`/events/${eventId}/`);
    return response.data;
}

export async function getEvents():Promise<CalendarEvent[]>{
    const response = await apiClient.get('/events/');
    return response.data;
}