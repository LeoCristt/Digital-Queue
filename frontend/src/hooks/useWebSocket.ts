import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export const useWebSocket = (queueId: string) => {
  const [messages, setMessages] = useState<{ user_id: string; text: string; timestamp: number }[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const password = searchParams.get("password") || "";

  useEffect(() => {
    if (!queueId) return;

    const ws = new WebSocket(`ws://localhost:8000/api/queue/${queueId}?password=${password}`);

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
      } else if (data.startsWith("error:")) {
        if (data.includes("You can only create a queue with your own user ID")) {
          router.push("/404");
        } else {
          router.push("/");
        }
      }
      else {
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

  const nextQueue = () => {
    socketRef.current?.send("next");
  };

  const undoQueue = () => {
    socketRef.current?.send("undo");
  };

  const deleteQueue = () => {
    socketRef.current?.send("delete")
    router.push('/')
  }

  return { messages, queue, sendMessage, joinQueue, leaveQueue, nextQueue, undoQueue, deleteQueue };
};