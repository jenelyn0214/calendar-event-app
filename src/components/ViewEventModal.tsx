import React from 'react';

interface ViewEventModalProps {
  show: boolean;
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
  } | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({ show, event, onClose, onDelete }) => {
  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (event && confirmDelete) {
      onDelete(event.id);
    }
  };

  if (!show || !event) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
        <p className="mb-2">
          <strong>Start:</strong> {event.start.toString()}
        </p>
        <p className="mb-2">
          <strong>End:</strong> {event.end.toString()}
        </p>
        <p className="mb-4">
          <strong>Description:</strong> {event.description}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Delete Event
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
