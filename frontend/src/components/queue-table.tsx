interface QueueTableProps {
    queue: string[];
    currentUserId?: string; // Опционально, если нужно выделять текущего пользователя
  }
  
  export default function QueueTable({ queue }: QueueTableProps) {
    return (
      <div className="queue-table">
        <div className="queue-table-header">
          <p>№</p>
          <p>Пользователь</p>
        </div>
        <div className="queue-table-body">
          {queue.length === 0 ? (
            <div className="queue-table-row">
              <p className="queue-table-empty">Очередь пуста</p>
            </div>
          ) : (
            queue.map((user, index) => (
              <div className="queue-table-row" key={index}>
                <p className="queue-table-number">{index + 1}</p>
                <p className="queue-table-user">
                  {user}
                  {/* {user === currentUserId && " (Вы)"} - на будущее */}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }