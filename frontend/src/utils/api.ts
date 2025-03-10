export const checkQueueExistence = async (): Promise<{ queue_id: string; password: string } | null> => {
    try {
        const response = await fetch("http://localhost:8000/api/queue", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Очередь не найдена");
        }

        const data = await response.json();
        return { queue_id: data.queue_id, password: data.password };
    } catch (error) {
        console.error("Ошибка при проверке очереди:", error);
        return null;
    }
};
