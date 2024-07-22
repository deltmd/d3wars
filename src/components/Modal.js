// src/components/Modal.js
import React from 'react';

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-4 mr-4 text-xl font-bold"
                >
                    X
                </button>
                {children}
            </div>
            <div className="fixed inset-0" onClick={onClose}></div>
        </div>
    );
};

export default Modal;