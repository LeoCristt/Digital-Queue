"use client";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const modalContainer = document.getElementById('settingsModalContainer');
        const modal = document.getElementById('settingsModal');
        const settingsButton = document.getElementById('openSettings');
        const closeSettingsButton = document.getElementById('closeSettings');

        if (!settingsButton || !modal || !modalContainer || !closeSettingsButton) return;

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

        settingsButton.addEventListener('click', openModal);
        closeSettingsButton.addEventListener('click', closeModalAnimationProcess);

        return () => {
            settingsButton.removeEventListener('click', openModal);
            closeSettingsButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
        };
    }, []);
    return (
        <div id="settingsModalContainer"
            className="w-full h-full fixed z-[51] justify-center top-0 end max-w-[1150px] hidden">
            <div className="flex flex-col justify-center">
                <form id="settingsModal"
                    className="backdrop-blur-xl w-[500px] h-[700px] rounded-3xl border-2 border-secondbackground bg-background shadow-2xl">
                    <label className="text-2xl text-foreground">
                        <button type="button" id="closeSettings" className="absolute right-5 top-3">X</button>
                    </label>

                </form>
            </div>
        </div>
    );
}