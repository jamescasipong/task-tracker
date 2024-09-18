import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null; // Do not render if the modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
        <p className="mb-6">Are you sure you want to delete this?</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded mr-2"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
