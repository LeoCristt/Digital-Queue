"use client";
import { useEffect } from 'react';
import {useRouter} from "next/navigation";

interface UserData {
    avatar_url: string;
    // Добавь другие поля, если они есть в userData
}

interface ModalSettingsProps {
    userData: UserData;
}

export default function ModalSettings({userData}: ModalSettingsProps) {
    const router = useRouter();
    const button = document.getElementById("removeAccount")

    useEffect(() => {
        const modalContainer = document.getElementById('settingsModalContainer');
        const modal = document.getElementById('settingsModal');
        const settingsButton = document.getElementById('openSettings');
        const closeSettingsButton = document.getElementById('closeSettings');

        if (!settingsButton || !modal || !modalContainer || !closeSettingsButton) return;

        const openModal = () => {
            modalContainer.classList.remove('hidden');
            modalContainer.classList.add('flex');
            modalContainer.classList.remove('animateCloseModalBlur');
            modalContainer.classList.add('animateOpenModalBlur');
            modal.classList.remove('animateCloseModal');
            modal.classList.add('animateOpenModal');
        };

        const closeModalAnimationProcess = () => {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');
            modalContainer.classList.remove('animateOpenModalBlur');
            modalContainer.classList.add('animateCloseModalBlur');
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
    }, []); // settings modal

    useEffect(() => {
        const modalContainer = document.getElementById('imgModalContainer');
        const modal = document.getElementById('imgModal');
        const settingsButton = document.getElementById('openImg');
        const closeSettingsButton = document.getElementById('closeImg');

        if (!settingsButton || !modal || !modalContainer || !closeSettingsButton) return;

        const openModal = () => {
            modalContainer.classList.remove('hidden');
            modalContainer.classList.add('flex');
            modalContainer.classList.remove('animateCloseModalBlur');
            modalContainer.classList.add('animateOpenModalBlur');
            modal.classList.remove('animateCloseModal');
            modal.classList.add('animateOpenModal');
        };

        const closeModalAnimationProcess = () => {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');
            modalContainer.classList.remove('animateOpenModalBlur');
            modalContainer.classList.add('animateCloseModalBlur');
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
    }, []); // img modal

    useEffect(() => {
        const modalContainer = document.getElementById('passwdModalContainer');
        const modal = document.getElementById('passwdModal');
        const settingsButton = document.getElementById('openPasswd');
        const closeSettingsButton = document.getElementById('closePasswd');

        if (!settingsButton || !modal || !modalContainer || !closeSettingsButton) return;

        const openModal = () => {
            modalContainer.classList.remove('hidden');
            modalContainer.classList.add('flex');
            modalContainer.classList.remove('animateCloseModalBlur');
            modalContainer.classList.add('animateOpenModalBlur');
            modal.classList.remove('animateCloseModal');
            modal.classList.add('animateOpenModal');
        };

        const closeModalAnimationProcess = () => {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');
            modalContainer.classList.remove('animateOpenModalBlur');
            modalContainer.classList.add('animateCloseModalBlur');
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
    }, []); // change password modal

    useEffect(() => {
        const modalContainer = document.getElementById('removeModalContainer');
        const modal = document.getElementById('removeModal');
        const settingsButton = document.getElementById('openRemove');
        const closeSettingsButton = document.getElementById('closeRemove');

        if (!settingsButton || !modal || !modalContainer || !closeSettingsButton) return;

        const openModal = () => {
            modalContainer.classList.remove('hidden');
            modalContainer.classList.add('flex');
            modalContainer.classList.remove('animateCloseModalBlur');
            modalContainer.classList.add('animateOpenModalBlur');
            modal.classList.remove('animateCloseModal');
            modal.classList.add('animateOpenModal');
        };

        const closeModalAnimationProcess = () => {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');
            modalContainer.classList.remove('animateOpenModalBlur');
            modalContainer.classList.add('animateCloseModalBlur');
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
    }, []); // remove profile modal

    useEffect(() => {
        const removeAccount = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');

                const headers = new Headers();
                if (accessToken) {
                    headers.append('Authorization', `Bearer ${accessToken}`);
                }

                const response = await fetch('http://localhost:8000/api/auth/delete', {
                    method: 'DELETE',
                    headers: headers,
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Ошибка при удалении');
                } else {
                    localStorage.removeItem('access_token');

                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Ошибка при удалении:', error);
            }
        };
        if (!button) return;

        button.addEventListener("click", removeAccount);

        return () => {
            button.removeEventListener("click", removeAccount);
        };
    }, [button, router]);

    return (
        <div id="settingsModalContainer"
             className="w-[100vw] left-0 h-full fixed z-[51] justify-center items-center top-0 hidden backdrop-blur-md">
            <div className="flex flex-col justify-center">
                <div id="settingsModal"
                      className="box-border backdrop-blur-xl max-w-[500px] h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col">
                    {/* Заголовок */}
                    <div className="text-3xl">
                        <button type="button" id="closeSettings" className="absolute right-5 top-4">
                            <svg width="48" height="48" viewBox="0 0 71 71"
                                 className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div
                            className="min-h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-[64px] flex-wrap">
                            <div className="text-foreground">Настройки</div>
                            <div>пользователя</div>
                        </div>
                    </div>
                    {/* Основное содержимое */}
                    <div className="flex-1 flex flex-col justify-between text-2xl p-[20px] gap-[16px]">
                        <div className="flex flex-col gap-[10px]">
                            <button id="openImg"
                                    className="flex justify-between align-middle bg-background rounded-2xl p-[20px]"
                                    type="button">
                                <img src={userData?.avatar_url}
                                     className="profile-user-img rounded-full w-20 h-20 object-cover drop-shadow-md"/>
                                <div className="flex flex-col justify-center w-full">
                                    <p className="h-fit">Изменить профиль</p>
                                </div>
                            </button>
                            <button id="openPasswd"
                                    className="flex justify-between align-middle bg-background rounded-2xl p-[20px]"
                                    type="button">
                                <div className="flex flex-col justify-center w-full">
                                    <p className="h-fit text-center">Изменить пароль</p>
                                </div>
                                <svg className="drop-shadow-md" xmlns="http://www.w3.org/2000/svg"
                                     fill="var(--foreground)" height="80px" width="80px"
                                     version="1.1" id="Icon" viewBox="0 0 24 24" enableBackground="new 0 0 24 24">
                                    <path
                                        d="M24,19v-2h-2.14c-0.09-0.36-0.24-0.7-0.42-1.02l1.52-1.52l-1.41-1.41l-1.52,1.52c-0.32-0.19-0.66-0.33-1.02-0.42V12h-2v2.14  c-0.36,0.09-0.7,0.24-1.02,0.42l-1.52-1.52l-1.41,1.41l1.52,1.52c-0.19,0.32-0.33,0.66-0.42,1.02H12v2h2.14  c0.09,0.36,0.24,0.7,0.42,1.02l-1.52,1.52l1.41,1.41l1.52-1.52c0.32,0.19,0.66,0.33,1.02,0.42V24h2v-2.14  c0.36-0.09,0.7-0.24,1.02-0.42l1.52,1.52l1.41-1.41l-1.52-1.52c0.19-0.32,0.33-0.66,0.42-1.02H24z M18,20c-1.1,0-2-0.9-2-2  s0.9-2,2-2s2,0.9,2,2S19.1,20,18,20z M11,7.41l3.29,3.29l1.41-1.41L12.41,6L13,5.41l2.29,2.29l1.41-1.41L14.41,4L15,3.41l3.29,3.29  l1.41-1.41L16.41,2l0.29-0.29l-1.41-1.41L6.89,8.7C6.19,8.26,5.38,8,4.5,8C2.02,8,0,10.02,0,12.5S2.02,17,4.5,17S9,14.98,9,12.5  c0-0.88-0.26-1.69-0.7-2.39L11,7.41z M4.5,15C3.12,15,2,13.88,2,12.5S3.12,10,4.5,10S7,11.12,7,12.5S5.88,15,4.5,15z"/>
                                </svg>
                            </button>
                        </div>

                        <button id="openRemove" type="button"
                                className="flex justify-center text-trhirdbackground underline text-lg">
                            Удалить учётную запись
                        </button>
                    </div>
                </div>
            </div>

            <div id="imgModalContainer"
                 className="w-[100vw] left-0 h-full fixed z-[51] justify-center items-center top-0 hidden backdrop-blur-md">
                <div className="flex flex-col justify-center">
                    <form id="imgModal"
                          className="box-border backdrop-blur-xl max-w-[490px] h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col">
                        <div className="text-3xl">
                            <button type="button" id="closeImg" className="absolute right-5 top-4">
                                <svg width="48" height="48" viewBox="0 0 71 71"
                                     className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                    <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                    <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                                </svg>
                            </button>
                            <div
                                className="min-h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-[64px] flex-wrap">
                                <div>Изменение</div>
                                <div className="text-foreground">профиля</div>
                            </div>
                        </div>
                        {/*Контент*/}
                    </form>
                </div>
            </div>

            <div id="passwdModalContainer"
                 className="w-full h-full fixed z-[51] justify-center items-center top-0 hidden backdrop-blur-md">
                <div className="flex flex-col justify-center">
                    <form id="passwdModal"
                          className="box-border backdrop-blur-xl max-w-[490px] h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col">
                        <div className="text-3xl">
                            <button type="button" id="closePasswd" className="absolute right-5 top-4">
                                <svg width="48" height="48" viewBox="0 0 71 71"
                                     className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                    <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                                    <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                                </svg>
                            </button>
                            <div
                                className="min-h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-[64px] flex-wrap">
                                <div>Изменение</div>
                                <div className="text-foreground">пароля</div>
                            </div>
                        </div>
                        <div className="p-[20px] flex flex-col gap-[20px]">
                            <div className="bg-background rounded-2xl p-[20px]">
                                <label className="block" htmlFor="password">
                                    Старый пароль
                                </label>
                                <input
                                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
                                    id="password"
                                    name="password"
                                    required
                                    type="password"
                                />
                            </div>
                            <div className="bg-background rounded-2xl p-[20px] flex flex-col gap-[20px]">
                                <div>
                                    <label className="block" htmlFor="password">
                                        Новый пароль
                                    </label>
                                    <input
                                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
                                        id="password1"
                                        name="password1"
                                        required
                                        type="password"
                                    />
                                </div>
                                <div>
                                    <label className="block" htmlFor="password-again">
                                        Повтор нового пароля
                                    </label>
                                    <input
                                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
                                        id="password2"
                                        name="password-again"
                                        required
                                        type="password"
                                    />
                                </div>
                            </div>
                            <button className="bg-colorbutton text-2xl rounded-2xl p-[10px]">Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="removeModalContainer"
                 className="w-[100vw] left-0 h-full fixed z-[51] justify-center items-center top-0 hidden backdrop-blur-md">
                <div className="flex flex-col justify-center">
                    <form id="removeModal"
                          className="box-border backdrop-blur-xl w-fit h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col">
                        <div className="text-3xl">
                            <div
                                className="h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-6">
                                <div>Подтвердите</div>
                                <div className="text-red-500">удаление</div>
                            </div>
                        </div>
                        <div className="flex w-full justify-center h-full p-[10px] text-2xl gap-[50px]">
                            <button id="closeRemove" type="button"
                                    className="bg-colorbutton rounded-2xl p-[10px]">Отмена
                            </button>
                            <button id="removeAccount" type="button"
                                    className="bg-red-500 rounded-2xl p-[10px]">Удалить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}