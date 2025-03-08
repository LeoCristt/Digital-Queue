'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Добавляем useState

export default function Redirect() {
    const router = useRouter();
    const [time, setTime] = useState(5); // Используем состояние для времени

    const redirect = () => {
        router.push("/");
    }

    useEffect(() => {
        if (time > 0) {
            const timer = setTimeout(() => {
                setTime(time - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            redirect();
        }
    }, [time]);

    return (
        <main>
            <h1>
                Залогинтесь, чтобы создать очередь, либо подключитесь к очереди.
            </h1>
            <p>{time}</p>
        </main>
    );
}
