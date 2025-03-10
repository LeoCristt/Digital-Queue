'use client'
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { QRCodeSVG } from 'qrcode.react';
import "../../../../styles/queue.css";
import QueueTable from "../../../../components/queue-table";
import Chat from '@/components/ModalChat';
import ErrorModal from "@/components/ModalError";
import ModalInfo from "@/components/ModalInfo";

interface TokenPayload {
    sub: string;
}


const QueueComponent = () => {
    const [userId, setUserId] = useState<string>("");
    const params = useParams();
    const { id } = params;
    const {queue, sendSwapRequest, incomingSwapRequest, acceptSwap, declineSwap, joinQueue, leaveQueue, nextQueue, undoQueue, deleteQueue, messages, error, setError, info, setInfo } = useWebSocket(
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
                            <div className="relative">
                                <svg className="w-full h-full fill-foreground" viewBox="0 0 647 399"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M570.644 0H76.3548C34.2506 0 0 34.2569 0 76.3599V147.077V169.721L22.4087 172.936C35.3639 174.794 45.1346 186.059 45.1346 199.141C45.1346 212.213 35.3689 223.479 22.4201 225.337L0 228.541V251.196V321.924C0 364.018 34.2506 398.275 76.3548 398.275H570.644C612.748 398.275 647 364.018 647 321.924V251.667V226.736L622.096 225.572C607.942 224.91 596.85 213.295 596.85 199.142C596.85 184.989 607.942 173.376 622.106 172.704L647 171.53V146.61V76.3612C647 34.2569 612.749 0 570.644 0ZM620.876 146.61C592.967 147.927 570.726 170.907 570.726 199.142C570.726 227.379 592.967 250.359 620.876 251.665V321.923C620.876 349.659 598.385 372.15 570.644 372.15H76.3548C48.6135 372.15 26.1239 349.659 26.1239 321.923V251.195C51.6298 247.542 71.2585 225.663 71.2585 199.141C71.2585 172.62 51.6298 150.741 26.1239 147.077V76.3599C26.1239 48.6147 48.6147 26.1239 76.3548 26.1239H570.644C598.384 26.1239 620.876 48.6147 620.876 76.3599V146.61Z"/>
                                    <path d="M167.279 295.382H149.997V340.456H167.279V295.382Z"/>
                                    <path d="M167.279 216.194H149.997V261.268H167.279V216.194Z"/>
                                    <path d="M167.279 136.997H149.997V182.08H167.279V136.997Z"/>
                                    <path d="M167.279 57.8193H149.997V102.893H167.279V57.8193Z"/>
                                </svg>

                                <div className="queue-leftside-ticket-in">
                                    <div className="leftcolumn">
                                        <svg className="leftcolumn-toparrow-image fill-toparrow" viewBox="0 0 88 51" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M81.2287 51C83.0292 50.9924 84.7532 50.2706 86.0226 48.9929C87.2891 47.7181 88 45.9937 88 44.1962C88 42.3987 87.2891 40.6743 86.0226 39.3995L48.6228 1.9785C47.3488 0.711285 45.6253 0 43.8289 0C42.0324 0 40.3089 0.711285 39.0349 1.9785L1.6351 39.3995C0.521086 40.7011 -0.0610322 42.3753 0.00507129 44.0877C0.0711748 45.8 0.780631 47.4244 1.99167 48.6361C3.2027 49.8478 4.82612 50.5577 6.53751 50.6238C8.2489 50.69 9.9222 50.1075 11.223 48.9929L43.8289 16.4026L76.4347 48.9929C77.7041 50.2706 79.4281 50.9924 81.2287 51Z"/>
                                        </svg>

                                        <svg className="leftcolumn-hashtag-image fill-textColor" viewBox="0 0 53 65"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M35.0428 64.1792H28.0348L31.1068 44.3072H18.0508L14.9788 64.1792H7.97075L11.0428 44.3072H0.48275L1.44275 37.9712H12.0028L13.9228 25.2032H3.36275L4.32275 18.8672H14.8828L17.7628 0.147194H24.7708L21.8907 18.8672H34.9468L37.8268 0.147194H44.8348L41.9548 18.8672H52.5148L51.5548 25.2032H40.9948L39.0748 37.9712H49.6348L48.6748 44.3072H38.1148L35.0428 64.1792ZM32.0668 37.9712L33.9868 25.2032H20.9308L19.0108 37.9712H32.0668Z"/>
                                        </svg>

                                        <svg className="leftcolumn-downarrow-image fill-bottomarrow" viewBox="0 0 88 51" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.77134 7.10123e-06C4.97079 0.00760232 3.24675 0.729416 1.97737 2.00713C0.710872 3.28191 -4.02089e-06 5.00635 -3.86375e-06 6.80382C-3.70661e-06 8.6013 0.710873 10.3257 1.97738 11.6005L39.3772 49.0215C40.6512 50.2887 42.3747 51 44.1711 51C45.9676 51 47.6911 50.2887 48.9651 49.0215L86.3649 11.6005C87.4789 10.2989 88.061 8.62467 87.9949 6.91231C87.9288 5.19995 87.2194 3.57562 86.0083 2.3639C84.7973 1.15217 83.1739 0.442311 81.4625 0.376172C79.7511 0.310029 78.0778 0.89248 76.777 2.00713L44.1711 34.5974L11.5653 2.00713C10.2959 0.729415 8.57189 0.00760201 6.77134 7.10123e-06Z"/>
                                        </svg>

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
                        </div>
                        <div className="queue-leftside-time">
                            <svg className="fill-foreground" width="68" height="68" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_29_17)">
                                    <path d="M59.6778 51.7705L47.4081 42.5684V23.8233C47.4081 21.9385 45.8846 20.415 43.9998 20.415C42.1151 20.415 40.5916 21.9385 40.5916 23.8233V44.2727C40.5916 45.3462 41.096 46.3585 41.9549 46.9993L55.5876 57.224C56.1759 57.6672 56.8926 57.9065 57.6292 57.9056C58.6687 57.9056 59.6912 57.4386 60.3592 56.5389C61.491 55.0357 61.1842 52.8987 59.6778 51.7705Z"/>
                                    <path d="M44 0C19.7369 0 0 19.7369 0 44C0 68.2631 19.7369 88 44 88C68.2631 88 88 68.2631 88 44C88 19.7369 68.2631 0 44 0ZM44 81.1836C23.4996 81.1836 6.81639 64.5004 6.81639 44C6.81639 23.4996 23.4996 6.81639 44 6.81639C64.5038 6.81639 81.1836 23.4996 81.1836 44C81.1836 64.5004 64.5004 81.1836 44 81.1836Z"/>
                                </g>
                            </svg>
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
                        sendSwapRequest={sendSwapRequest}
                    />
                </div>
                <button id="openChat"
                        className="fixed sm:bottom-5 bottom-20 right-5 bg-secondbackground rounded-full p-[10px]">
                    <svg className="fill-foreground w-[40px]" version="1.1" viewBox="0 0 60 60">
                        <path d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689
                        c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01
                        c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"/>
                    </svg>
                </button>
                {incomingSwapRequest && (
                    <div className="swap-request-modal">
                        <p>Пользователь {incomingSwapRequest.from} предлагает обмен. Принять?</p>
                        <button onClick={acceptSwap}>Принять</button>
                        <button onClick={declineSwap}>Отклонить</button>
                    </div>
                )}
                <Chat
                    queue={queue}
                    currentUserId={currentUserIdentifier || undefined}/>
            </div>
            <div>
                {error && <ErrorModal message={error} onClose={() => setError(null)}/>}
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg.text}</li>
                    ))}
                </ul>
            </div>
            {info && (
                <ModalInfo
                    message={info}
                    onClose={() => setInfo(null)}
                />
            )}

        </div>
    );
}

export default QueueComponent;
