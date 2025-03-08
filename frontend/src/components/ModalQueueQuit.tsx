"use client";
import { useEffect} from "react";
import {useWebSocket} from "@/hooks/useWebSocket";
import {useParams} from "next/navigation";

export default function QueueQuit() {
    const params = useParams();
    const { id } = params;
    const { leaveQueue } = useWebSocket(
        typeof id === "string" ? id : ""
    );

    useEffect(() => {
        const modalContainer = document.getElementById('ModalContainerQueueQuit');
        const modal = document.getElementById('ModalQueueQuit');
        const chatButton = document.getElementById('openQueueQuit');
        const chatCloseButton = document.getElementById('closeQueueQuit');

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

        chatButton.addEventListener('click', openModal);
        chatCloseButton.addEventListener('click', closeModalAnimationProcess);

        return () => {
            chatButton.removeEventListener('click', openModal);
            chatCloseButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
        };
    }, []);
    return (
            <div id="ModalContainerQueueQuit" className="fixed z-[50] top-0 bottom-0 left-200 pt-[31px] flex items-center justify-center w-[100vw] hidden media-chat">
                <form id="ModalQueueQuit"
                      className="box-border backdrop-blur-xl w-[520px] h-[250px] rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col media-form-quit">
                    {/* Заголовок */}
                    <div className="text-2xl">
                        <button type="button" id="closeQueueQuit" className="absolute right-5 top-2">
                            <svg width="40" height="40" viewBox="0 0 71 71" className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="h-[48px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2">
                            <div className="text-foreground text-3xl">Выход из очереди</div>
                        </div>
                    </div>
                    {/* Основное содержимое */}
                    <div className="flex flex-col gap-8 items-center justify-center h-[174px]">
                        <p className="text-3xl">Вы точно хотите покинуть очередь?</p>
                        <div className="flex justify-center gap-10">
                            <button className="bg-blue-500 text-2xl text-white p-2 rounded-lg w-[200px]" onClick={leaveQueue}>Да</button>
                            <button className="bg-blue-500 text-2xl text-white p-2 rounded-lg w-[200px]">Нет</button>
                        </div>
                    </div>
                </form>
            </div>
    );
}