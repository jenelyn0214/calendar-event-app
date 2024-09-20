import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { CalendarEvent } from "../types";
import { createEvent, deleteEvent, getEvents } from "../api/event";
import ViewEventModal from "../components/ViewEventModal";
import CreateEventModal from "../components/CreateEventModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { logoutUser } from "../actions/authActions";

const localizer = momentLocalizer(moment);

// Utility function to generate random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CalendarPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [slotInfo, setSlotInfo] = useState<{ start: Date; end: Date } | null>(
    null
  );

  const loadEvents = async () => {
    try {
      const fetchedEvents = await getEvents();
      const mappedEvents = fetchedEvents.map((fetchedEvent: CalendarEvent) => ({
        ...fetchedEvent,
        start: new Date(fetchedEvent?.start_time || ""),
        end: new Date(fetchedEvent?.end_time || ""),
      }));

      setEvents(() => mappedEvents);

      // Generate random colors for users if not already present
      const newUserColors: { [key: string]: string } = {};
      mappedEvents.forEach((event) => {
        const userId = event.created_by;
        if (!userColors[userId]) {
          newUserColors[userId] = getRandomColor(); // Assign a random color to the user
        }
      });
      setUserColors((prevColors) => ({ ...prevColors, ...newUserColors })); // Merge with existing colors
    } catch (error) {
      console.log("Error fetching events", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSlotInfo(slotInfo);
    setShowCreateModal(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.log("Error deleting event", error);
    }
    setShowModal(false);
    loadEvents();
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    start: Date;
    end: Date;
    description: string;
  }) => {
    try {
      await createEvent(eventData);
    } catch (error) {
      console.log("Error creating event", error);
    }

    loadEvents();
    setShowCreateModal(false);
  };

  // Function to return custom styles for events based on the user/created_by field
  const eventPropGetter = (event: CalendarEvent) => {
    const backgroundColor = userColors[event.created_by] || "#D3D3D3"; // Default color if no user color found
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white shadow-lg w-64 flex-none p-6">
        <h2 className="text-xl font-bold mb-8 text-purple-700">My Dashboard</h2>
        <nav className="space-y-6">
          <a
            href="/"
            className="block py-2 px-4 bg-purple-100 text-purple-700 rounded-md"
          >
            Calendar
          </a>
          <a
            href="/schedule"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Schedule
          </a>
          <a
            href="/messages"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Messages
          </a>
          <a
            href="/notification"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Notification
          </a>
          <a
            href="/settings"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Settings
          </a>
        </nav>

        <div className="mt-10">
          <button
            className="bg-purple-600 text-white w-full py-3 rounded-md shadow-lg hover:bg-purple-700"
            onClick={() =>
              handleSelectSlot({ start: new Date(), end: new Date() })
            }
          >
            Create Event
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">Calendar</h1>
          <button
            onClick={() => dispatch(logoutUser())}
            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Calendar Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Mini Calendar and People Section */}
          <div className="col-span-3 bg-white p-6 rounded-lg shadow-lg">
            {/* Mini Calendar */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                December 2, 2023
              </h3>
              <div className="flex justify-center mb-4">
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md"
                  onClick={() =>
                    handleSelectSlot({ start: new Date(), end: new Date() })
                  }
                >
                  Create Event
                </button>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Select a date to see events
                </p>
              </div>
            </div>

            {/* People Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                People
              </h3>
              <input
                type="text"
                placeholder="Search for people"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-700">Shajib W Joy</p>
                    <p className="text-sm text-gray-500">
                      labrownsky@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-700">Tarek Jia</p>
                    <p className="text-sm text-gray-500">alexsy@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-700">Joe Biden</p>
                    <p className="text-sm text-gray-500">theonion@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="col-span-9 bg-white p-6 shadow-lg rounded-lg">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventPropGetter} // Custom event styling based on created_by
              style={{ height: 500 }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
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

