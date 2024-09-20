import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CreateEventModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (eventData: { title: string; start: Date; end: Date; description: string }) => void;
  slotInfo: { start: Date; end: Date } | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ show, onClose, onCreate, slotInfo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState<Date | null>(slotInfo?.start || null);
  const [end, setEnd] = useState<Date | null>(slotInfo?.end || null);

  useEffect(() => {
    if (slotInfo?.start) {
      setStart(slotInfo?.start);
    }
    if (slotInfo?.end) {
      setEnd(slotInfo?.end);
    }

    return () => {
      setStart(null);
      setEnd(null);
    };
  }, [slotInfo?.start, slotInfo?.end]);

  const handleSubmit = () => {
    if (!title || !start || !end) {
      alert('Please complete all fields.');
      return;
    }

    if (end <= start) {
      alert('End time cannot be earlier than or equal to start time.');
      return;
    }

    onCreate({ title, start, end, description });
    setStart(null);
    setEnd(null);
    setTitle('');
    setDescription('');

    onClose();
  };

  if (!show || !slotInfo) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time:</label>
          <DatePicker
            selected={start}
            onChange={(date) => setStart(date || null)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select start time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time:</label>
          <DatePicker
            selected={end}
            onChange={(date) => setEnd(date || null)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select end time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Create Event
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
