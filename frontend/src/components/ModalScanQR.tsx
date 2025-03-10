"use client";
import { useCallback } from "react";
import { Scanner } from '@yudiel/react-qr-scanner'; // Изменили импорт

interface ModalScanQRProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (queueId: number) => void;
}

export const ModalScanQR = ({ isOpen, onClose, onScan }: ModalScanQRProps) => {
    const parseQueueId = useCallback((data: string): number | null => {
        try {
            const url = new URL(data);
            const pathSegments = url.pathname.split('/');
            const queueIndex = pathSegments.indexOf('queue');
            if (queueIndex !== -1 && queueIndex < pathSegments.length - 1) {
                const id = parseInt(pathSegments[queueIndex + 1], 10);
                if (!isNaN(id)) return id;
            }
        } catch (e) {
            const id = parseInt(data, 10);
            if (!isNaN(id)) return id;
        }
        return null;
    }, []);

    const handleDecode = useCallback((result: string) => {
        const queueId = parseQueueId(result);
        if (queueId) {
            onScan(queueId);
            onClose();
        } else {
            alert('Неверный QR-код. Пожалуйста, отсканируйте код очереди.');
        }
    }, [onScan, onClose, parseQueueId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-secondbackground rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-2xl mb-4 text-center text-foreground">Сканирование QR-кода</h2>
                <Scanner // Изменили компонент
                    onDecode={handleDecode}
                    onError={(error) => console.error('Ошибка сканера:', error)}
                    constraints={{ facingMode: 'environment' }}
                />
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-background text-foreground px-4 py-2 rounded-lg hover:bg-secondbackground transition-colors"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};