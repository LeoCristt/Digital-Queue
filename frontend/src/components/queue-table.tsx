export default function QueueTable() {
    const users = ["Пользователь 1", "Пользователь 2", "Вы", "Пользователь 4", "Пользователь 5", "Пользователь 6", "Пользователь 7", "Пользователь 8", "Пользователь 9", "Пользователь 10", "Пользователь 11", "Пользователь 12", "Пользователь 13"];

    return (
        <div className="queue-table">
            <div className="queue-table-header">
                <p>№</p>
                <p>Пользователь</p>
            </div>
            <div className="queue-table-body">
                {users.map((user, index) => (
                    <div className="queue-table-row" key={index}>
                        <p className="queue-table-number">{index + 1}</p>
                        <p className="queue-table-user">{user}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
