import "../../../styles/queue.css";
import ClockSvg from '../../../assets/images/Clock.svg';
import TicketSvg from '../../../assets/images/Ticket.svg';
import HashtagSvg from '../../../assets/images/Hashtag.svg';
import ToparrowSvg from '../../../assets/images/Toparrow.svg';
import DownarrowSvg from '../../../assets/images/Downarrow.svg';
import LineVertSvg from '../../../assets/images/LineVert.svg';
import LineGorSvg from '../../../assets/images/LineGor.svg';

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
                    <button>Выйти из очереди</button>
                </div>
            </div>
            <div className="queue-rightside sidebar">
                <div className="queue-rightside-body">
                    <div className="queue-column left">
                        <p className="queue-rightside-header">№</p>
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                    </div>
                    <div className="queue-rightside-vert">
                        <img src={LineVertSvg.src}></img>
                    </div>
                    <div className="queue-column right">
                        <p className="queue-rightside-header">Пользователь</p>
                        <p>Пользователь 1</p>
                        <p>Пользователь 2</p>
                        <p>Пользователь 3</p>
                        <p>Вы</p>
                    </div>
                </div>
            </div>
        </div>
    );
}