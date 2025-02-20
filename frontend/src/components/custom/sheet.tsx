import React, { useState } from "react";

interface SheetProps {
  trigger: React.ReactNode; // The element that triggers the sheet to open
  title?: string; // Optional title for the sheet
  children: React.ReactNode; // Content to display inside the sheet
  onClose?: () => void; // Optional callback when the sheet is closed
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Sheet: React.FC<SheetProps> = ({ trigger, title, children, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose(); // Call the onClose callback if provided
  };

  return (
    <div className="z-50">
      {/* Trigger */}
      <div onClick={handleOpen}>{trigger}</div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1000] bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      >
        {/* Sheet Content */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform z-[1000] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the sheet from closing it
        >
          {/* Sheet Title */}
          {title && (
            <div className="p-4 border-b border-gray-200 font-bold">
              {title}
            </div>
          )}

          {/* Sheet Body */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

//export default Sheet;
