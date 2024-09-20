import React from "react";
import { format } from "date-fns"; // If you don't have date-fns, install it with: npm install date-fns

interface ViewEventModalProps {
  show: boolean;
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
    created_by: string;
  } | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  show,
  event,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (event && confirmDelete) {
      onDelete(event.id);
    }
  };

  if (!show || !event) return null;

  // Format the start and end date using date-fns
  const formattedStart = format(new Date(event.start), "PPpp");
  const formattedEnd = format(new Date(event.end), "PPpp");

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          {event.title}
        </h2>

        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>Start:</strong> {formattedStart}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>End:</strong> {formattedEnd}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>Description:</strong>{" "}
            {event.description || "No description provided."}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>Created By:</strong> {event.created_by}
          </p>
        </div>

        <div className="flex justify-end space-x-4">
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

