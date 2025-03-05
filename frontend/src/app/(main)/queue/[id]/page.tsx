// 'use client'
// import "../../../../styles/queue.css";
// import ClockSvg from '../../../../assets/images/Clock.svg';
// import TicketSvg from '../../../../assets/images/Ticket.svg';
// import HashtagSvg from '../../../../assets/images/Hashtag.svg';
// import ToparrowSvg from '../../../../assets/images/Toparrow.svg';
// import DownarrowSvg from '../../../../assets/images/Downarrow.svg';
// import LineVertSvg from '../../../../assets/images/LineVert.svg';
// import LineGorSvg from '../../../../assets/images/LineGor.svg';
// import QueueTable from "../../../../components/queue-table";
// import { useEffect, useState } from "react";
// import { useWebSocket } from "@/hooks/useWebSocket";

// const QueueComponent = ({ queueId }: { queueId: string }) => {
//   const { messages, queue, sendMessage, joinQueue, leaveQueue } = useWebSocket(queueId);
//   const [text, setText] = useState("");
//     return (
//         <div className="queue-main">
//             <div className="queue-leftside sidebar">
//                 <div className="queue-leftside-position">
//                     <p>Ваша позиция в очереди</p>
//                 </div>
//                 <div className="queue-leftside-conteiner">
//                     <div className="queue-leftside-ticket">
//                         <img src={TicketSvg.src} className="queue-leftside-ticket-img"></img>
//                         <div className="queue-leftside-ticket-in">
//                             <div className="leftcolumn">
//                                 <img src={ToparrowSvg.src} className="leftcolumn-toparrow-image"></img>
//                                 <img src={HashtagSvg.src} className="leftcolumn-hashtag-image"></img>
//                                 <img src={DownarrowSvg.src} className="leftcolumn-downarrow-image"></img>
//                             </div>
//                             <div className="rightcolumn">
//                                 <p className="rightcolumn-remaining">3 человека</p>
//                                 <p className="rightcolumn-ticketnumber">412</p>
//                                 <p className="rightcolumn-remaining">7 человека</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="queue-leftside-time">
//                             <img src={ClockSvg.src}></img>
//                             <p>~10 минут</p>
//                     </div>
//                 </div>
//                 <div className="queue-button">
//                     <button>Выйти из очереди</button>
//                 </div>
//             </div>
//             <div className="queue-rightside sidebar">
//                 <QueueTable/>
//             </div>
//         </div>
//     );
// }

'use client'
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState } from "react";

const QueueComponent = ({ queueId }: { queueId: string }) => {
    const { messages, queue, sendMessage, joinQueue, leaveQueue } = useWebSocket(queueId);
    const [text, setText] = useState("");

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Очередь: {queueId}</h2>
            <button onClick={joinQueue} className="px-4 py-2 bg-blue-500 text-white rounded">Присоединиться</button>
            <button onClick={leaveQueue} className="px-4 py-2 bg-red-500 text-white rounded ml-2">Выйти</button>

            <h3 className="mt-4 text-lg font-semibold">Список:</h3>
            <ul>
                {queue.length === 0 ? (
                    <li>Очередь пуста</li>
                ) : (
                    queue.map((user, idx) => <li key={idx}>{user}</li>)
                )}
            </ul>

            <h3 className="mt-4 text-lg font-semibold">Чат:</h3>
            <ul>
                {messages.map((msg, idx) => (
                    <li key={idx} className="border p-2 my-1">
                        <strong>{msg.user_id}:</strong> {msg.text} <span className="text-xs text-gray-500">{new Date(msg.timestamp * 1000).toLocaleTimeString()}</span>
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
};

export default QueueComponent;
