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
import QueueTable from "../../../../components/queue-table";
import Chat from '@/components/ModalChat';
import QueueQuit from '@/components/ModalQueueQuit';

interface TokenPayload {
    sub: string;
}

const QueueComponent = ({ queueId }: { queueId: string }) => {
    const [userId, setUserId] = useState<string>("");
    const params = useParams();
    const { id } = params;
    const {queue, joinQueue, leaveQueue, nextQueue, undoQueue, deleteQueue } = useWebSocket(
        typeof id === "string" ? id : ""
    );
    const queueId1 = params.id as string;

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
    const isQueueOwner = userId === queueId1;
    console.log(queueId1)

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
                        <div className="queue-button">
                            <button id="openQueueQuit">Выйти из очереди</button>
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
                                currentUserId={userId ?? undefined}/>
                </div>
                <button id="openChat" className="fixed bottom-5 right-5 bg-secondbackground rounded-full p-[10px]">
                    <svg className="fill-foreground w-[40px]" version="1.1" viewBox="0 0 60 60">
                        <path d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689
                        c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01
                        c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"/>
                    </svg>
                </button>
                <Chat/>
                <QueueQuit/>
            </div>
        </div>
    );
}

export default QueueComponent;
