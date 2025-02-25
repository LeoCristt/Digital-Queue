import "../../../styles/queue.css";
import ClockSvg from '../../../assets/images/Clock.svg';
import TicketSvg from '../../../assets/images/Ticket.svg';
import HashtagSvg from '../../../assets/images/Hashtag.svg';
import ToparrowSvg from '../../../assets/images/Toparrow.svg';
import DownarrowSvg from '../../../assets/images/Downarrow.svg';

export default function Queue() {
    return (
        <div className="queue-main">
            <div className="queue-leftside sidebar">
                <div className="queue-leftside-position">
                    <p>Ваша позиция в очереди</p>
                </div>
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
                <div>
                    <div className="queue-leftside-time">
                        <img src={ClockSvg.src}></img>
                        <p>~10 минут</p>
                    </div>
                </div>
            </div>
            <div className="queue-rightside sidebar">
                
            </div>
        </div>
    );
}