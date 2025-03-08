"use client";
import { handleClientScriptLoad } from "next/script";
import { useEffect, useState} from "react";

export default function Chat() {
    useEffect(() => {
        const modalContainer = document.getElementById('ModalContainerChat');
        const modal = document.getElementById('ModalChat');
        const chatButton = document.getElementById('openChat');
        const chatCloseButton = document.getElementById('closeChat');

        if (!chatButton || !modal || !modalContainer || !chatCloseButton) return;

        const openModal = () => {
            modalContainer.classList.remove('hidden');
            modalContainer.classList.add('flex');
            modal.classList.remove('animateCloseModal');
            modal.classList.add('animateOpenModal');
        };

        const closeModalAnimationProcess = () => {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');
            modal.addEventListener('animationend', closeModal);
        }

        const closeModal = () => {
            modalContainer.classList.remove('flex');
            modalContainer.classList.add('hidden');
            modal.removeEventListener('animationend', closeModal);
        }

        const handleFormSubmit = (event: { preventDefault: () => void; }) => {
            event.preventDefault();
        };

        chatButton.addEventListener('click', openModal);
        chatCloseButton.addEventListener('click', closeModalAnimationProcess);
        modal.addEventListener('submit', handleFormSubmit);

        return () => {
            chatButton.removeEventListener('click', openModal);
            chatCloseButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
            modal.removeEventListener('submit', handleFormSubmit);
        };
    }, []);
    return (
            <div id="ModalContainerChat" className="fixed right-2 bottom-24 flex flex-col justify-center max-w-[1150px] hidden media-chat">
                <form id="ModalChat"
                      className="box-border backdrop-blur-xl w-[300px] h-[550px] rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col media-form">
                    {/* Заголовок */}
                    <div className="text-2xl">
                        <button type="button" id="closeChat" className="absolute right-5 top-2">
                            <svg width="40" height="40" viewBox="0 0 71 71" className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="h-[48px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2">
                            <div className="text-foreground">Чат</div>
                        </div>
                    </div>
                    {/* Основное содержимое */}
                    <div className="p-3 mt-auto flex gap-2">
                        <input type="text" placeholder="Введите сообщение..." className="w-full p-2 rounded-lg bg-trhirdbackground text-textInputt"/>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Отправить</button>
                    </div>
                </form>
            </div>
    );
}