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
        <main className="content-center">
            <div className="flex flex-col gap-2 text-center">
                <div className="text-3xl">
                    Увы, вы не можете перейти в очередь :/
                </div>
                <p>Вы будете перенаправлены на главную страницу через {time}</p>
            </div>
        </main>
    );
}
