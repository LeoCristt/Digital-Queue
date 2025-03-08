"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: string;
}

interface QueueTableProps {
    queue: string[];
    currentUserId?: string;
}

export default function Chat({ currentUserId }: QueueTableProps) {
    const [text, setText] = useState("");
    const [userId, setUserId] = useState<string>("");
    const params = useParams();
    const { id } = params;
    const { messages, sendMessage } = useWebSocket(
        typeof id === "string" ? id : ""
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            sendMessage(text);
            setText(""); // Очищаем поле ввода
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Ошибка при декодировании JWT:", error);
            }
        }
    }, []);

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

        chatButton.addEventListener('click', openModal);
        chatCloseButton.addEventListener('click', closeModalAnimationProcess);

        return () => {
            chatButton.removeEventListener('click', openModal);
            chatCloseButton.removeEventListener('click', closeModalAnimationProcess);
            modal.removeEventListener('animationend', closeModal);
        };
    }, []);

    return (
        <div id="ModalContainerChat" className="fixed right-2 sm:bottom-24 bottom-20 flex-col justify-center max-w-[1150px] hidden media-chat">
            <form
                id="ModalChat"
                onSubmit={handleSubmit}
                className="box-border backdrop-blur-xl w-[300px] h-[550px] rounded-3xl border-2 border-backgroundHeader bg-secondbackground shadow-2xl flex flex-col media-form"
            >
                {/* Заголовок */}
                <div className="text-2xl">
                    <button type="button" id="closeChat" className="absolute right-5 top-2">
                        <svg width="40" height="40" viewBox="0 0 71 71"
                             className="stroke-secondbackground hover:stroke-foregroundhover transition-all">
                            <path d="M17.6777 17.6776L53.0331 53.0329" strokeWidth="6" strokeLinecap="round"/>
                            <path d="M17.678 53.0331L53.0333 17.6778" strokeWidth="6" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <div
                        className="h-[48px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2">
                        <div className="text-foreground">Чат</div>
                    </div>
                </div>

                {/* Список сообщений */}
                <ul className="flex-1 overflow-y-auto p-2 space-y-2">
                    {messages.map((msg, idx) => {
                        const isCurrentUser = currentUserId
                            ? msg.user_id.toString() === currentUserId.toString()
                            : false;

                        return (
                        <li
                            key={idx}
                            className="border p-2 rounded-lg bg-trhirdbackground break-words"
                        >
                            <strong> {isCurrentUser ? "Вы: " : `Пользователь ${msg.user_id}: `}
                            </strong>
                            {msg.text}
                            <span className="text-xs text-gray-500 block mt-1">
                                {new Date(msg.timestamp * 1000).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </li>
                    );
                    })}
                    <div ref={messagesEndRef} />
                </ul>

                {/* Форма ввода */}
                <div className="p-3 mt-auto flex gap-2">
                    <input
                        type="text"
                        placeholder="Введите сообщение..."
                        className="w-full p-2 rounded-lg bg-trhirdbackground text-textInputt"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Отправить
                    </button>
                </div>
            </form>
        </div>
    );
}
