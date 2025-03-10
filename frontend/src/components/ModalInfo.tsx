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
        <div className="fixed bottom-4 left-4 bg-colorbutton text-textColor px-6 py-3 rounded-lg shadow-md animate-slide-left">
            {message}
        </div>
    );
};

export default ModalInfo;
