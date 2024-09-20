import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent } from '../types';
import { createEvent, deleteEvent, getEvents } from '../api/event';
import ViewEventModal from '../components/ViewEventModal';
import CreateEventModal from '../components/CreateEventModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { logoutUser } from '../actions/authActions';

const localizer = momentLocalizer(moment);


const CalendarPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null); // For selected event
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false); // For create modal
    const [slotInfo, setSlotInfo] = useState<{ start: Date; end: Date } | null>(null); // Slot info for creating events

    const loadEvents = async () => {
        try{
          const fetchedEvents = await getEvents()
          console.log('fetchedEvents',fetchedEvents)
          const mappedEvents = fetchedEvents.map(fetchedEvent=>{
            return {...fetchedEvent, start: new Date(fetchedEvent?.start_time || ''), end: new Date(fetchedEvent?.end_time || '')}
          })

          console.log('mappedEvents',mappedEvents)
          setEvents(()=>mappedEvents);
        }catch(error){
          console.log('error',error)
        }
    };

  useEffect(() => {
    loadEvents()
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSlotInfo(slotInfo);
    setShowCreateModal(true); // Show modal when a time slot is clicked
  };

  // Handle event selection for viewing and deleting
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true); // Show modal when an event is clicked
  };

  // Handle event deletion inside modal
  const handleDeleteEvent = async (eventId: string) => {
    try{
      await deleteEvent(eventId);
    }catch(error){
      console.log('error',error)
    }
    setShowModal(false); // Close modal after deletion
    loadEvents(); // Reload events after deleting
  };

  // Handle creating a new event from the modal
  const handleCreateEvent = async (eventData: { title: string; start: Date; end: Date; description: string }) => {
    try{
      await createEvent(eventData);
    }catch(error){
      console.log('error',error)
    }
    
    loadEvents(); // Reload events after creating a new one
    setShowCreateModal(false); // Close the modal after creation
  };

  console.log('zzzz',events)

  return (
    <div>
      <button onClick={()=>{
        dispatch(logoutUser());
      }}>Logout</button>
        <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            style={{ height: 500 }}
        />

      <ViewEventModal 
        show={showModal} 
        event={selectedEvent} 
        onClose={() => setShowModal(false)} 
        onDelete={handleDeleteEvent} 
      />
      <CreateEventModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateEvent}
        slotInfo={slotInfo}
      />
    </div>
  );
};

export default CalendarPage;