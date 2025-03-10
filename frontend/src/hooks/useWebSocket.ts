import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useWebSocket = (queueId: string) => {
  const [messages, setMessages] = useState<{ user_id: string; text: string; timestamp: number }[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [incomingSwapRequest, setIncomingSwapRequest] = useState<{ from: string } | null>(null);
  const [swapResult, setSwapResult] = useState<{ status: 'accepted' | 'declined'; with: string } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const password = searchParams.get("password") || "";

  useEffect(() => {
    if (incomingSwapRequest) {
      const modal = document.createElement('div');
      modal.className = 'swap-request-modal';
      modal.innerHTML = `
        <p>Пользователь ${incomingSwapRequest.from} предлагает обмен. Принять?</p>
        <button id="swap-accept">Принять</button>
        <button id="swap-decline">Отклонить</button>
      `;

      modal.querySelector('#swap-accept')?.addEventListener('click', acceptSwap);
      modal.querySelector('#swap-decline')?.addEventListener('click', declineSwap);

      document.body.appendChild(modal);

      return () => modal.remove();
    }
  }, [incomingSwapRequest]);

  useEffect(() => {
    if (!queueId) return;

    const ws = new WebSocket(`ws://localhost:8000/api/queue/${queueId}?password=${password}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = event.data;

      if (data.startsWith("error:")) {
        const errorMessage = data.slice(6);
        setError(errorMessage);
        return;
      }

      if (data.startsWith("info:")) {
        const infoMessage = data.slice(6);
        setInfo(infoMessage);
        return;
      }

      if (data.startsWith("set_cookie:")) {
        const clientId = data.split(":")[1];
        document.cookie = `${clientId}; path=/`;
        return;
      }

      if (data.startsWith("delete_cookie:")) {
        const cookieName = data.split(":")[1];
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        return;
      }

      if (data.startsWith("queue:")) {
        const queueData = data.slice(6).split(",");
        setQueue(queueData);
      }
      else {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "new_message") {
            setMessages((prev) => [...prev, parsed.data]);
          } else if (parsed.type === "chat_history") {
            setMessages(parsed.data);
          } else if (parsed.type === "swap_request") {
            setIncomingSwapRequest({ from: parsed.from });
          } else if (parsed.type === "swap_result") {
            setSwapResult({ status: parsed.status, with: parsed.with });
            setTimeout(() => setSwapResult(null), 5000);
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

  const sendSwapRequest = (targetId: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(`swap_request:${targetId}`);
    }
  };

  const acceptSwap = () => {
    socketRef.current?.send("swap_accept");
    setIncomingSwapRequest(null);
  };

  const declineSwap = () => {
    socketRef.current?.send("swap_decline");
    setIncomingSwapRequest(null);
  };


  return { messages, queue, incomingSwapRequest, swapResult, sendMessage, joinQueue, leaveQueue, nextQueue, undoQueue, deleteQueue, error, setError, info,setInfo, sendSwapRequest, acceptSwap, declineSwap };
};