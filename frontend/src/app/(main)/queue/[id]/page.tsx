'use client'
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { QRCodeSVG } from 'qrcode.react';
import "../../../../styles/queue.css";
import ClockSvg from '../../../../assets/images/Clock.svg';
import TicketSvg from '../../../../assets/images/Ticket.svg';
import HashtagSvg from '../../../../assets/images/Hashtag.svg';
import ToparrowSvg from '../../../../assets/images/Toparrow.svg';
import DownarrowSvg from '../../../../assets/images/Downarrow.svg';
import QueueTable from "../../../../components/queue-table";
import Chat from '@/components/ModalChat';

interface TokenPayload {
    sub: string;
}




const QueueComponent = () => {
    const [userId, setUserId] = useState<string>("");
    const params = useParams();
    const { id } = params;
    const {queue, joinQueue, leaveQueue, nextQueue, undoQueue, deleteQueue } = useWebSocket(
        typeof id === "string" ? id : ""
    );
    const [showQR, setShowQR] = useState(false);
    const queueId1 = params.id as string;


    const getClientIdFromCookies = (): string | null => {
        try {
            // Получаем все cookies
            const cookies = document.cookie.split(';');

            // Ищем куку с именем 'client_id'
            const clientIdCookie = cookies.find(c =>
                c.trim().startsWith(`client_id_${queueId1}=`)
            );

            if (!clientIdCookie) return null;

            // Извлекаем значение и декодируем специальные символы
            const encodedValue = clientIdCookie.split('=')[1];
            return decodeURIComponent(encodedValue);
        } catch (error) {
            console.error("Error reading client_id cookie:", error);
            return null;
        }
    };

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

    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        const id = getClientIdFromCookies();
        setClientId(id);
    }, []);
    console.log(`client ID: ${clientId}`)
    const isQueueOwner = userId === queueId1;
    console.log(queueId1)

    const pluralize = (number: number, forms: [string, string, string]) => {
        const n = Math.abs(number) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return forms[2];
        if (n1 > 1 && n1 < 5) return forms[1];
        if (n1 === 1) return forms[0];
        return forms[2];
    };

    const currentUserIdentifier = userId || clientId;

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

                                    <p className="rightcolumn-remaining">
                                        {(() => {
                                            const currentUserIdentifier = userId || clientId;
                                            if (!currentUserIdentifier) return "0 человек";

                                            const userIndex = queue.findIndex(user =>
                                                user.split(":")[0] === currentUserIdentifier
                                            );

                                            return userIndex !== -1
                                                ? `${userIndex} ${pluralize(userIndex, ['человек', 'человека', 'человек'])}`
                                                : "0 человек";
                                        })()}
                                    </p>
                                    {queue.map((user) => {
                                        const userId1 = user.split(":")[0];
                                        const currentUserIdentifier = userId || clientId;
                                        const isCurrentUser = currentUserIdentifier
                                            ? userId1 === currentUserIdentifier
                                            : false;

                                        return isCurrentUser ? (
                                            <p key={user} className="rightcolumn-ticketnumber">
                                                {userId1}
                                            </p>
                                        ) : null;
                                    })}
                                    <p className="rightcolumn-remaining">
                                        {(() => {
                                            const currentUserIdentifier = userId || clientId;
                                            if (!currentUserIdentifier) return "0 человек";

                                            const userIndex = queue.findIndex(user =>
                                                user.split(":")[0] === currentUserIdentifier
                                            );

                                            if (userIndex === -1) return "0 человек";

                                            const count = queue.length - userIndex - 1;
                                            return `${count} ${pluralize(count, ['человек', 'человека', 'человек'])}`;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="queue-leftside-time">
                            <img src={ClockSvg.src} alt="Иконка времени"/>
                            {(() => {
                                const currentUserIdentifier = userId || clientId;
                                if (!currentUserIdentifier) return <p>ожидайте</p>;

                                const userEntry = queue.find(user => {
                                    const [entryId] = user.split(':');
                                    return entryId === currentUserIdentifier;
                                });

                                const rawTime = userEntry?.split(':')[1] || '0.0 сек';
                                const displayTime = rawTime === '0.0 сек' ? 'ожидайте' : rawTime;

                                return <p key={`time-${currentUserIdentifier}`}>{displayTime}</p>;
                            })()}
                        </div>
                        <div className="queue-button">
                            <button id="joinQueue" onClick={joinQueue}>Присоединиться</button>
                            <button id="openQueueQuit" onClick={leaveQueue}>Выйти</button>
                            <button onClick={() => setShowQR(!showQR)}>
                                {showQR ? 'Скрыть QR' : 'Показать QR'}
                            </button>
                        </div>
                    </div>

                    {showQR && (
                        <div className="qr-code-container">
                            <QRCodeSVG
                                value={window.location.href}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    )}

                    {isQueueOwner && (
                        <div className="queue-admin-controls flex justify-center gap-3">
                            <button
                                onClick={nextQueue}
                                className="bg-colorbutton"
                            >
                                Следующий участник
                            </button>
                            <button
                                onClick={undoQueue}
                                className="backbttn"
                            >
                                Вернуть участника
                            </button>
                            <button
                                onClick={deleteQueue}
                                className="deletebttn"
                            >
                                Завершить очередь
                            </button>
                        </div>
                    )}
                </div>
                <div className="queue-rightside sidebar">
                    <QueueTable
                        queue={queue}
                        currentUserId={currentUserIdentifier || undefined}
                    />
                </div>
                <button id="openChat" className="fixed sm:bottom-5 bottom-20 right-5 bg-secondbackground rounded-full p-[10px]">
                    <svg className="fill-foreground w-[40px]" version="1.1" viewBox="0 0 60 60">
                        <path d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689
                        c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01
                        c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"/>
                    </svg>
                </button>
                <Chat
                    queue={queue}
                    currentUserId={currentUserIdentifier || undefined}/>
            </div>
        </div>
    );
}

export default QueueComponent;
