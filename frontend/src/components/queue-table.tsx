interface QueueTableProps {
    queue: string[];
    currentUserId?: string;
    sendSwapRequest: (targetId: string) => void;
}

export default function QueueTable({ queue, currentUserId, sendSwapRequest }: QueueTableProps) {
  console.log('Queue content:', queue); 
  console.log('UserID:', currentUserId);

  return (
      <div className="queue-table">
          <div className="queue-table-header">
              <p>№</p>
              <p>Пользователь</p>
          </div>
          <div className="queue-table-body">
              {queue.map((user, index) => {
                  const userId = user.split(":")[0];
                  const isCurrentUser = currentUserId
                      ? userId === currentUserId.toString()
                      : false;

                  return (
                      <div className="queue-table-row" key={index}>
                          <p className="queue-table-number">{index + 1}</p>
                          {userId && (
                              <p className="queue-table-user">
                                  {isCurrentUser ? "Вы" : `Пользователь ${userId}`}
                              </p>
                          )}
                          {userId !== currentUserId && (
                              <button onClick={() => sendSwapRequest(userId)} className="swap-button">
                                  Обменяться
                              </button>
                          )}
                      </div>
                  );
              })}
          </div>
      </div>
  );
}