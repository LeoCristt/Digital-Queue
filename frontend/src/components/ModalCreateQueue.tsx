import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ModalCreateQueueProps {
    userId: string;
}

export default function CreateQueue({ userId }: ModalCreateQueueProps) {
    const [isPrivate, setIsPrivate] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState('')

    const handleCreateQueue = () => {
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        // Закрываем модальное окно перед навигацией
        const modal = document.getElementById('ModalCreateQueue');
        const modalContainer = document.getElementById('ModalContainerCreateQueue');

        if (modal && modalContainer) {
            modal.classList.remove('animateOpenModal');
            modal.classList.add('animateCloseModal');

            modal.addEventListener('animationend', () => {
                modalContainer.classList.add('hidden');

                // Формируем URL с параметрами
                const params = new URLSearchParams();
                if (password.trim()) {
                    params.append('password', password.trim());
                }

                // Перенаправление после завершения анимации
                router.push(`/queue/${encodeURIComponent(userId)}?${params.toString()}`);
            }, { once: true });
        }
    };

    useEffect(() => {
        const modalContainer = document.getElementById('ModalContainerCreateQueue');
        const modal = document.getElementById('ModalCreateQueue');
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
            console.log(userId)
            createQueueButton.removeEventListener('click', openModal);
            createQueueCloseButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
        };
    }, []);
    return (
        <div id="ModalContainerCreateQueue"
            className="w-full h-full fixed z-[51] justify-center items-center top-0 max-w-[1150px] hidden">
            <div className="flex flex-col justify-center">
                <form id="ModalCreateQueue"
                    className="box-border backdrop-blur-xl w-[500px] h-[700px] rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col">
                    {/* Заголовок */}
                    <div className="text-3xl">
                        <button type="button" id="closeCreateQueue" className="absolute right-5 top-4">
                            <svg width="48" height="48" viewBox="0 0 71 71" className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                                <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round" />
                                <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div className="h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2">
                            <div className="text-foreground">Создание</div>
                            <div>очереди</div>
                        </div>
                    </div>
                    {/* Основное содержимое */}
                    <div className="flex-1 flex flex-col justify-between text-2xl p-[20px]">
                        <div className="flex flex-col gap-[10px]">
                            <input type="text" placeholder="Название" className="w-full rounded-2xl p-[15px] bg-trhirdbackground text-textInputt" />
                            <div className="flex flex-row gap-3 text-textInput">
                                Приватная очередь
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer
                                         dark:bg-gray-700
                                         peer-checked:bg-foregroundhover
                                         after:content-['']
                                         after:absolute
                                         after:top-[2px]
                                         after:start-[2px]
                                         after:bg-white
                                         after:rounded-full
                                         after:h-5
                                         after:w-5
                                         after:transition-all
                                         peer-checked:after:translate-x-full
                                         rtl:peer-checked:after:-translate-x-full">
                                    </div>
                                </label>
                            </div>
                            {isPrivate && (
                                <input
                                    type="text"
                                    placeholder="Пароль"
                                    className="w-full rounded-2xl p-[15px] bg-trhirdbackground text-textInputt"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Кнопка создания */}
                        <button
                            type="button" // Добавьте это!
                            className="flex justify-center bg-colorbutton rounded-2xl p-[10px]"
                            onClick={handleCreateQueue}
                        >
                            Создать очередь
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}