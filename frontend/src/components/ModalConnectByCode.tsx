"use client";
import { useState, useEffect } from "react";

interface ConnectByCodeProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (password: string) => void;
}

export default function ConnectByCode({ isOpen, onClose, onConnect }: ConnectByCodeProps) {
    const [password, setPassword] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const modalContainer = document.getElementById('ModalContainerConnectByCode');
        const modal = document.getElementById('ModalConnectByCode');
        const closeButton = document.getElementById('closeConnectByCode');

        if (!modal || !modalContainer || !closeButton) return;

        const handleOpen = () => {
            modalContainer.classList.remove('hidden');
            modalContainer.classList.add('flex');
            modal.classList.remove('animateCloseModal');
            modal.classList.add('animateOpenModal');
        };

        const handleClose = () => {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');

            modal.addEventListener('animationend', () => {
                modalContainer.classList.remove('flex');
                modalContainer.classList.add('hidden');
                onClose();
            }, { once: true });
        };

        if (isOpen) {
            handleOpen();
        } else if (isMounted) {
            handleClose();
        }

        const closeHandler = () => handleClose();
        closeButton.addEventListener('click', closeHandler);

        return () => {
            closeButton.removeEventListener('click', closeHandler);
            modal.removeEventListener('animationend', handleClose);
        };
    }, [isOpen, isMounted]);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        }
    }, [isOpen]);

    const handleConnect = () => {
        onConnect(password);
        setPassword("");
    };

    if (!isMounted) return null;

    return (
        <div id="ModalContainerConnectByCode"
             className="w-[100vw] left-0 h-full fixed z-[51] justify-center items-center top-0 hidden backdrop-blur-md">
            <div className="flex flex-col justify-center">
                <div id="ModalConnectByCode"
                     className="box-border backdrop-blur-xl max-w-[500px] h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground flex flex-col">

                    {/* Заголовок */}
                    <div className="text-3xl">
                        <button type="button" id="closeConnectByCode" className="absolute right-5 top-4">
                            <svg width="48" height="48" viewBox="0 0 71 71"
                                 className="stroke-foreground sm:stroke-secondbackground sm:hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="min-h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-[64px] flex-wrap">
                            <div>Подключение</div>
                        </div>
                    </div>

                    {/* Основное содержимое */}
                    <div className="flex-1 flex flex-col gap-[20px] justify-between text-2xl p-[20px]">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            className="w-full rounded-2xl p-[15px] bg-trhirdbackground text-textInputt"
                        />
                        <button
                            onClick={handleConnect}
                            className="flex justify-center bg-colorbutton hover:bg-background-oregroundhover transition-all rounded-2xl p-[10px]"
                        >
                            Подключиться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}