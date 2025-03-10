import {useState} from "react";

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
        <div className="box-border max-w-96 w-full h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground 0 flex flex-col mb-[60px]">
            {/*<h2 className="text-xl font-bold mb-4">Оставьте отзыв</h2>*/}
            <div className="text-3xl">
                <div
                    className="h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-6">
                    <div>Оставьте</div>
                    <div className="text-foreground">отзыв</div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full justify-center flex-col h-full p-[10px] text-2xl gap-[10px]">
        <textarea
            className="w-full p-2 mb-3 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-trhirdbackground text-textColor"
            placeholder="Введите ваш отзыв..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
        />
                <button
                    type="submit"
                    className="bg-colorbutton text-2xl rounded-2xl p-[10px] w-full "
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
