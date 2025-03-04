"use client";
import { useEffect, useState} from "react";

export default function AdministrateQueue() {
    useEffect(() => {
        const modalContainer = document.getElementById('ModalContainerAdministrateQueue');
        const modal = document.getElementById('ModalAdministrateQueue');
        const administrateQueueButton = document.getElementById('openAdministrateQueue');
        const administrateQueueCloseButton = document.getElementById('closeAdministrateQueue');

        if (!administrateQueueButton || !modal || !modalContainer || !administrateQueueCloseButton) return;

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

        administrateQueueButton.addEventListener('click', openModal);
        administrateQueueCloseButton.addEventListener('click', closeModalAnimationProcess);

        return () => {
            administrateQueueButton.removeEventListener('click', openModal);
            administrateQueueCloseButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
        };
    }, []);
    return (
        <div id="ModalContainerAdministrateQueue"
             className="w-full h-full fixed z-[51] justify-center items-center top-0 max-w-[1150px] hidden">
            <div className="flex flex-col justify-center">
                <form id="ModalAdministrateQueue"
                      className="box-border backdrop-blur-xl w-[500px] h-[700px] rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col">
                    {/* Заголовок */}
                    <div className="text-3xl">
                        <button type="button" id="closeAdministrateQueue" className="absolute right-5 top-4">
                            <svg width="48" height="48" viewBox="0 0 71 71" className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2">
                            <div className="text-foreground">Управление</div>
                            <div>очередью</div>
                        </div>
                    </div>
                    {/* Основное содержимое */}
                    <div className="flex-1 flex flex-col justify-between text-2xl p-[20px]">
                        <div className="flex flex-col gap-[10px]">
                            <div className="flex flex-row gap-[10px]">
                                {/*Вызвать следующего*/}
                                <button id="" className="flex justify-center w-full bg-colorbutton rounded-2xl p-[10px]">Вызвать следующего</button>
                                {/*Вернуть предыдущего*/}
                                <button  id="" className="flex justify-center w-full bg-colorbutton rounded-2xl p-[10px]">Вернуть пердыдущего</button>
                            </div>
                        </div>
                        {/*Завершить очередь - удалить*/}
                        <button id="" className="flex justify-center bg-importantcolorbutton rounded-2xl p-[10px]">
                            Завершить очередь
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}