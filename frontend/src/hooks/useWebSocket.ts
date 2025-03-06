import { useEffect, useRef, useState } from "react";

export const useWebSocket = (queueId: string) => {
  const [messages, setMessages] = useState<{ user_id: string; text: string; timestamp: number }[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!queueId) return;

    const ws = new WebSocket(`ws://localhost:8000/api/queue/${queueId}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = event.data;

      if (data.startsWith("set_cookie:")) {
        const clientId = data.split("=")[1];
        document.cookie = `client_id=${clientId}; path=/`;
        return; 
      }

      if (data.startsWith("queue:")) {
        const queueData = data.slice(6).split(",");
        setQueue(queueData);
      } else {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "new_message") {
            setMessages((prev) => [...prev, parsed.data]);
          } else if (parsed.type === "chat_history") {
            setMessages(parsed.data);
          }
        } catch (e) {
          console.error("Ошибка парсинга:", e);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [queueId]);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(`message:${message}`);
    }
  };

  const joinQueue = () => {
    socketRef.current?.send("join");
  };

  const leaveQueue = () => {
    socketRef.current?.send("leave");
  };

  return { messages, queue, sendMessage, joinQueue, leaveQueue };
};