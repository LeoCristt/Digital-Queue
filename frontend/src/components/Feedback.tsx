import { useState } from "react";

const FeedbackForm = () => {
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("Токен не найден. Авторизуйтесь.");
            }

            const params = new URLSearchParams();
            params.append("description", description);

            const response = await fetch("http://localhost:8000/api/feedback" + "?" + params.toString(), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Ошибка при отправке отзыва");
            }

            setMessage(data.message);
            setDescription("");
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Оставьте отзыв</h2>
            <form onSubmit={handleSubmit}>
        <textarea
            className="w-full p-2 border rounded text-black"
            placeholder="Введите ваш отзыв..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
        />
                <button
                    type="submit"
                    className="w-full mt-2 p-2 bg-colorbutton text-black rounded hover:bg-foregroundhover"
                    disabled={loading}
                >
                    {loading ? "Отправка..." : "Отправить"}
                </button>
            </form>
            {message && <p className="mt-2 text-center text-sm text-red-500">{message}</p>}
        </div>
    );
};

export default FeedbackForm;
