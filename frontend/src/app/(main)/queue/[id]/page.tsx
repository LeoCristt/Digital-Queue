'use client'
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import "../../../../styles/queue.css";
import ClockSvg from '../../../../assets/images/Clock.svg';
import TicketSvg from '../../../../assets/images/Ticket.svg';
import HashtagSvg from '../../../../assets/images/Hashtag.svg';
import ToparrowSvg from '../../../../assets/images/Toparrow.svg';
import DownarrowSvg from '../../../../assets/images/Downarrow.svg';
import LineVertSvg from '../../../../assets/images/LineVert.svg';
import LineGorSvg from '../../../../assets/images/LineGor.svg';
import QueueTable from "../../../../components/queue-table";

interface TokenPayload {
    sub: string;
}

const QueueComponent = ({ queueId }: { queueId: string }) => {
    const [text, setText] = useState("");
    const [userId, setUserId] = useState<string>("");
    const params = useParams();
    const { id } = params;
    const { messages, queue, sendMessage, joinQueue, leaveQueue, nextQueue, undoQueue, deleteQueue  } = useWebSocket(
        typeof id === "string" ? id : ""
    );

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
    const isQueueOwner = userId === "1";

    return (
        <div>
            <div className="queue-main">
                <div className="queue-leftside sidebar">
                    <div className="queue-leftside-position">
                        <p>Ваша позиция в очереди</p>
                    </div>
                    <div className="queue-leftside-conteiner">
                        <div className="queue-leftside-ticket">
                            <img src={TicketSvg.src} className="queue-leftside-ticket-img"></img>
                            <div className="queue-leftside-ticket-in">
                                <div className="leftcolumn">
                                    <img src={ToparrowSvg.src} className="leftcolumn-toparrow-image"></img>
                                    <img src={HashtagSvg.src} className="leftcolumn-hashtag-image"></img>
                                    <img src={DownarrowSvg.src} className="leftcolumn-downarrow-image"></img>
                                </div>
                                <div className="rightcolumn">
                                    <p className="rightcolumn-remaining">3 человека</p>
                                    <p className="rightcolumn-ticketnumber">412</p>
                                    <p className="rightcolumn-remaining">7 человека</p>
                                </div>
                            </div>
                        </div>
                        <div className="queue-leftside-time">
                            <img src={ClockSvg.src}></img>
                            <p>~10 минут</p>
                        </div>
                    </div>
                    <div className="queue-button">
                        <button onClick={joinQueue}>Присоединиться</button>
                        <button onClick={leaveQueue}>Выйти из очереди</button>
                    </div>
                    {isQueueOwner && (
                        <div className="queue-admin-controls mt-4">
                            <button
                                onClick={nextQueue}
                                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                            >
                                Следующий пользователь
                            </button>
                            <button
                                onClick={undoQueue}
                                className="px-4 py-2 bg-yellow-500 text-white rounded"
                            >
                                Вернуть предыдущего
                            </button>
                            <button
                                onClick={deleteQueue}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Удалить
                            </button>
                        </div>
                    )}
                </div>
                <div className="queue-rightside sidebar">
                    <QueueTable queue={queue}
                        currentUserId={userId ?? undefined} />
                </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Чат:</h3>
            <ul>
                {messages.map((msg, idx) => (
                    <li key={idx} className="border p-2 my-1">
                        <strong>{msg.user_id === userId ? "Вы" : `Пользователь ${msg.user_id}`}: </strong>
                        {msg.text}
                        <span className="text-xs text-gray-500">
                            &nbsp;{new Date(msg.timestamp * 1000).toLocaleTimeString()}
                        </span>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                className="border p-2 w-full mt-2 text-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите сообщение..."
            />
            <button onClick={() => sendMessage(text)} className="px-4 py-2 bg-green-500 text-white rounded mt-2">
                Отправить
            </button>
        </div>
    );
}

export default QueueComponent;
