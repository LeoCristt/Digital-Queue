interface QueueTableProps {
  queue: string[];
  currentUserId?: string; // Опционально, если нужно выделять текущего пользователя
  isLoading?: boolean; // Добавляем флаг загрузки
}

export default function QueueTable({ queue, currentUserId }: QueueTableProps) {

  console.log('Queue content:', queue); // Добавьте эту строку
  console.log('Queue content:', currentUserId); // Добавьте эту строку
  return (
    <div className="queue-table">
      <div className="queue-table-header">
        <p>№</p>
        <p>Пользователь</p>
      </div>
      <div className="queue-table-body">
        {queue.length === 0 ? (
          <div className="queue-table-row">
            <p>Очередь пуста</p>
          </div>
        ) : (
          queue.map((user, index) => {
            const userId = user.split(":")[0]; 
            return (
              <div className="queue-table-row" key={index}>
                <p className="queue-table-number">{index + 1}</p>
                <p className="queue-table-user">{userId === currentUserId ? "Вы" : `Пользователь ${userId}`}</p>
              </div>
            );}
        ))}
      </div>
    </div>
  );
}