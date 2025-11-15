import React from 'react';
import { CloseIcon } from './icons';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete' }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-5 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-5 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;