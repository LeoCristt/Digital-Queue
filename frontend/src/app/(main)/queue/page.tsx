import "../../../styles/queue.css";
import ClockSvg from '../../../assets/images/Clock.svg';
import TicketSvg from '../../../assets/images/Ticket.svg';
import HashtagSvg from '../../../assets/images/Hashtag.svg';
import ToparrowSvg from '../../../assets/images/Toparrow.svg';
import DownarrowSvg from '../../../assets/images/Downarrow.svg';
import LineVertSvg from '../../../assets/images/LineVert.svg';
import LineGorSvg from '../../../assets/images/LineGor.svg';
import QueueTable from "../../../components/queue-table";
import Chat from '@/components/ModalChat';

export default function Queue() {
    return (
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
                    <button id="openchat">Выйти из очереди</button>
                </div>
            </div>
            <div className="queue-rightside sidebar">
                <QueueTable/>
            </div>
            <button id="openChat" className="fixed bottom-5 right-5 bg-secondbackground rounded-full p-[10px]">
                <svg className="fill-foreground w-[40px]" version="1.1" viewBox="0 0 60 60">
                    <path d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689
                        c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01
                        c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"/>
                </svg>
            </button>
            <Chat/>
        </div>
    );
}