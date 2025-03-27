import React, { useEffect } from "react";

interface ModalInfoProps {
    message: string;
    duration?: number;
    onClose: () => void;
}

const ModalInfo: React.FC<ModalInfoProps> = ({ message, duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-4 bottom-auto left-4 bg-colorbutton text-textColor px-6 py-3 rounded-lg shadow-md animate-slide-left md:bottom-4 md:top-auto">
            {message}
        </div>
    );
};

export default ModalInfo;
