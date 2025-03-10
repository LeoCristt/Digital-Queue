import React from "react";
import { useRouter } from "next/navigation";

interface ErrorModalProps {
    message: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div id="ModalConnectByCode"
                 className="box-border backdrop-blur-xl max-w-[500px] h-fit rounded-3xl border-2 border-backgroundHeader bg-secondbackground flex flex-col">
                <div className="text-3xl">
                    <div
                        className="min-h-[72px] bg-background rounded-2xl m-1 border-2 border-backgroundHeader shadow-md flex items-center justify-center gap-2 px-[64px] flex-wrap text-skinsurvivor">
                        <div>Ошибка</div>
                    </div>
                </div>
                {/* Основное содержимое */}
                <div className="flex-1 flex flex-col gap-[20px] justify-between text-2xl p-[20px]">
                    <p>{message}</p>
                    <button
                        onClick={handleGoHome}
                        className="flex justify-center bg-colorbutton hover:bg-background-oregroundhover transition-all rounded-2xl p-[10px]"
                    >
                        На главную
                    </button>
                </div>
                {/*<div className="bg-bl text-black p-6 rounded-lg shadow-md">*/}
                {/*    <h2 className="text-xl font-semibold mb-4">Ошибка</h2>*/}
                {/*    <p className="mb-4">{message}</p>*/}
                {/*    <button*/}
                {/*        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"*/}
                {/*        onClick={handleGoHome}*/}
                {/*    >*/}
                {/*        На главную*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
            );
            };

            export default ErrorModal;
