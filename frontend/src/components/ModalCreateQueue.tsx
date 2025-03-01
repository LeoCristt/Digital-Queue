"use client";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const modalContainer = document.getElementById('ModalContainer');
        const modal = document.getElementById('Modal');
        const createQueueButton = document.getElementById('openCreateQueue');
        const createQueueCloseButton = document.getElementById('closeCreateQueue');

        if (!createQueueButton || !modal || !modalContainer || !createQueueCloseButton) return;

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

        createQueueButton.addEventListener('click', openModal);
        createQueueCloseButton.addEventListener('click', closeModalAnimationProcess);

        return () => {
            createQueueButton.removeEventListener('click', openModal);
            createQueueCloseButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
        };
    }, []);
    return (
        <div id="ModalContainer"
             className="w-full h-full fixed z-[51] justify-center top-0 end max-w-[1150px] hidden">
            <div className="flex flex-col justify-center">
                <form id="Modal" className="backdrop-blur-xl w-[500px] h-[700px] rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl">
                    <div className="text-3xl">
                        <button type="button" id="closeCreateQueue" className="absolute right-5 top-4">
                            <svg width="48" height="48" viewBox="0 0 71 71"
                                 className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex flex-row justify-center gap-2">
                            <div className="text-foreground content-center">Создание</div>
                            <div className="content-center">очереди</div>
                        </div>
                    </div>
                    <div className="text-2xl p-[20px]">
                        123
                    </div>
                </form>
            </div>
        </div>
    );
}