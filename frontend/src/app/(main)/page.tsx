"use client";
import ModalCreateQueue from '@/components/ModalCreateQueue';
import ModalAdministrateQueue from '@/components/ModalAdministrateQueue';

export default function Home() {
    return (
        <div className="p-[20px]">
            <section className="flex flex-row justify-center gap-2 my-[60px] text-6xl text-nowrap">
                <div className="flex flex-row"><div>D</div><div className="text-foreground">igital</div></div>
                <div className="flex flex-row"><div>Q</div><div className="text-foreground">ueue</div></div>
            </section>

            <section className="flex flex-row sm:flex-nowrap flex-wrap-reverse gap-[20px] w-full mb-[40px]">
                {/*Сканирование QR*/}
                <button className="mx-auto" id="openScanQR">
                    <div className="bg-secondbackground rounded-2xl p-[10px]">
                        <div className="bg-background p-[40px] rounded-full">
                            <svg className="w-[90px]" viewBox="0 0 123 123">
                                <path d="M117.264 20.7591C117.264 12.2902 110.419 5.42468 101.975 5.42468H81.5892C78.7745 5.42468 76.4928 7.71319 76.4928 10.5362C76.4928 13.3591 78.7745 15.6476 81.5892 15.6476H101.975C104.79 15.6476 107.071 17.9362 107.071 20.7591V41.205C107.071 44.028 109.353 46.3165 112.168 46.3165C114.982 46.3165 117.264 44.028 117.264 41.205V20.7591Z" fill="#00FF88"/>
                                <path d="M117.264 82.0968C117.264 79.2738 114.982 76.9854 112.168 76.9854C109.353 76.9854 107.071 79.2738 107.071 82.0968V102.543C107.071 105.366 104.79 107.654 101.975 107.654H81.5892C78.7745 107.654 76.4928 109.943 76.4928 112.766C76.4928 115.589 78.7745 117.877 81.5892 117.877H101.975C110.419 117.877 117.264 111.012 117.264 102.543V82.0968Z" fill="#00FF88"/>
                                <path d="M20.4324 107.654C17.6178 107.654 15.336 105.366 15.336 102.543V82.0968C15.336 79.2738 13.0543 76.9854 10.2396 76.9854C7.42498 76.9854 5.14322 79.2738 5.14322 82.0968V102.543C5.14322 111.012 11.9884 117.877 20.4324 117.877H40.818C43.6327 117.877 45.9144 115.589 45.9144 112.766C45.9144 109.943 43.6327 107.654 40.818 107.654H20.4324Z" fill="#00FF88"/>
                                <path d="M5.14322 41.205C5.14322 44.028 7.42498 46.3165 10.2396 46.3165C13.0543 46.3165 15.336 44.028 15.336 41.205V20.7591C15.336 17.9362 17.6178 15.6476 20.4324 15.6476H40.818C43.6327 15.6476 45.9144 13.3591 45.9144 10.5362C45.9144 7.71319 43.6327 5.42468 40.818 5.42468H20.4324C11.9884 5.42468 5.14322 12.2902 5.14322 20.7591V41.205Z" fill="#00FF88"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M56.1072 30.9821C56.1072 28.1591 53.8255 25.8706 51.0108 25.8706H30.6252C27.8106 25.8706 25.5288 28.1591 25.5288 30.9821V51.428C25.5288 54.2511 27.8106 56.5395 30.6252 56.5395H51.0108C53.8255 56.5395 56.1072 54.2511 56.1072 51.428V30.9821ZM45.9144 38.6493C45.9144 37.2378 44.7735 36.0936 43.3662 36.0936H38.2698C36.8625 36.0936 35.7216 37.2378 35.7216 38.6493V43.7608C35.7216 45.1723 36.8625 46.3165 38.2698 46.3165H43.3662C44.7735 46.3165 45.9144 45.1723 45.9144 43.7608V38.6493Z" fill="#00FF88"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M91.782 66.7624C94.5968 66.7624 96.8784 69.0508 96.8784 71.8739V92.3198C96.8784 95.1429 94.5968 97.4313 91.782 97.4313H71.3964C68.5817 97.4313 66.3 95.1429 66.3 92.3198V71.8739C66.3 69.0508 68.5817 66.7624 71.3964 66.7624H91.782ZM76.4928 79.5411C76.4928 78.1298 77.6339 76.9854 79.041 76.9854H84.1374C85.5445 76.9854 86.6856 78.1298 86.6856 79.5411V84.6526C86.6856 86.0639 85.5445 87.2083 84.1374 87.2083H79.041C77.6339 87.2083 76.4928 86.0639 76.4928 84.6526V79.5411Z" fill="#00FF88"/>
                                <path d="M71.3964 25.8706C68.5817 25.8706 66.3 28.1591 66.3 30.9821C66.3 33.8051 68.5817 36.0936 71.3964 36.0936H84.1374C85.5445 36.0936 86.6856 37.2378 86.6856 38.6493V51.428C86.6856 54.2511 88.9673 56.5395 91.782 56.5395C94.5968 56.5395 96.8784 54.2511 96.8784 51.428V30.9821C96.8784 28.1591 94.5968 25.8706 91.782 25.8706H71.3964Z" fill="#00FF88"/>
                                <path d="M71.3964 41.205C68.5817 41.205 66.3 43.4935 66.3 46.3165V51.428C66.3 54.251 68.5817 56.5395 71.3964 56.5395C74.2112 56.5395 76.4928 54.251 76.4928 51.428V46.3165C76.4928 43.4935 74.2112 41.205 71.3964 41.205Z" fill="#00FF88"/>
                                <path d="M30.6252 66.7624C27.8106 66.7624 25.5288 69.0508 25.5288 71.8739V82.0969C25.5288 84.9199 27.8106 87.2083 30.6252 87.2083C33.4399 87.2083 35.7216 84.9199 35.7216 82.0969V79.5411C35.7216 78.1298 36.8625 76.9854 38.2698 76.9854H51.0108C53.8255 76.9854 56.1072 74.697 56.1072 71.8739C56.1072 69.0508 53.8255 66.7624 51.0108 66.7624H30.6252Z" fill="#00FF88"/>
                                <path d="M51.0108 87.2083C48.1961 87.2083 45.9144 89.4968 45.9144 92.3198C45.9144 95.1429 48.1961 97.4313 51.0108 97.4313C53.8255 97.4313 56.1072 95.1429 56.1072 92.3198C56.1072 89.4968 53.8255 87.2083 51.0108 87.2083Z" fill="#00FF88"/>
                            </svg>
                        </div>
                    </div>
                </button>
                <div className="flex flex-col w-full gap-[20px]">
                    <div className="flex flex-row justify-center gap-2 h-full text-3xl text-nowrap bg-secondbackground p-[10px] rounded-2xl">
                        <div className="text-foreground content-center">Подключение</div><div className="content-center">к очереди</div>
                    </div>
                    <div className="flex flex-row h-full gap-[20px] bg-secondbackground p-[20px] rounded-2xl">
                        <input type="text" className="w-full rounded-2xl p-[10px] bg-thirdbackground text-2xl text-textInputt" placeholder="Введите код для подключения"/>
                        {/*Подключение по номеру комнаты*/}
                        <button id="">
                            <div className="flex justify-center bg-background rounded-2xl p-[10px]">
                                <svg className="w-[50px]" viewBox="0 0 102 95">
                                     <path d="M0.13916 15.412V43.291H48.944L32.1803 29.1665C31.2658 28.3556 30.7635 27.2759 30.7805 26.1574C30.7975 25.039 31.3325 23.9704 32.2713 23.1795C33.2102 22.3886 34.4787 21.938 35.8063 21.9236C37.134 21.9093 38.4158 22.3325 39.3784 23.1029L64.8357 44.5482C65.7898 45.3525 66.3257 46.443 66.3257 47.5801C66.3257 48.7171 65.7898 49.8076 64.8357 50.6119L39.3784 72.0572C38.4158 72.8276 37.134 73.2508 35.8063 73.2365C34.4787 73.2222 33.2102 72.7715 32.2713 71.9806C31.3325 71.1897 30.7975 70.1211 30.7805 69.0027C30.7635 67.8842 31.2658 66.8045 32.1803 65.9936L48.944 51.8691H0.13916V79.7481C0.144214 83.7281 2.0233 87.5439 5.36413 90.3583C8.70495 93.1726 13.2346 94.7556 17.9593 94.7598H84.1482C88.8728 94.7556 93.4025 93.1726 96.7433 90.3583C100.084 87.5439 101.963 83.7281 101.968 79.7481V15.412C101.963 11.432 100.084 7.61616 96.7433 4.80184C93.4025 1.98751 88.8728 0.404557 84.1482 0.400299H17.9593C13.2346 0.404557 8.70495 1.98751 5.36413 4.80184C2.0233 7.61616 0.144214 11.432 0.13916 15.412Z" fill="#00FF88"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/*<section className="flex flex-row sm:flex-nowrap flex-wrap gap-[20px] w-full mb-[40px]">*/}
            {/*    <div className="flex flex-col gap-[20px] w-full">*/}
            {/*        <div className="flex flex-row gap-2 h-full justify-center text-3xl text-nowrap bg-secondbackground p-[10px] rounded-2xl">*/}
            {/*            <div className="text-foreground content-center">Создание</div><div className="content-center">очереди</div>*/}
            {/*        </div>*/}
            {/*        <div className="h-full text-center content-center text-2xl text-textInput bg-secondbackground p-[10px] rounded-2xl">Вы еще не создали свою очередь</div>*/}
            {/*    </div>*/}
            {/*    /!*Создение очереди*!/*/}
            {/*    <button className="mx-auto" id="openCreateQueue">*/}
            {/*        <div className="bg-secondbackground rounded-2xl p-[10px]">*/}
            {/*            <div className="bg-background p-[40px] rounded-full">*/}
            {/*                <svg className="stroke-foreground w-[60px]" viewBox="0 0 90 89">*/}
            {/*                    <path d="M45.1165 6.03955L45.1165 82.2957" strokeWidth="12" strokeLinecap="round"/>*/}
            {/*                    <path d="M6.98828 44.1678L83.2444 44.1678" strokeWidth="12" strokeLinecap="round"/>*/}
            {/*                </svg>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </button>*/}
            {/*</section>*/}

            {/*<section className="flex flex-row sm:flex-nowrap flex-wrap gap-[20px] w-full mb-[40px]">*/}
            {/*    <div className="flex flex-col gap-[20px] w-full">*/}
            {/*        <div className="flex flex-row gap-2 h-full justify-center text-3xl text-nowrap bg-secondbackground p-[10px] rounded-2xl">*/}
            {/*            <div className="text-foreground content-center">Управление</div><div className="content-center">очередью</div>*/}
            {/*        </div>*/}
            {/*        <div className="h-full text-center content-center text-2xl text-textInput bg-secondbackground p-[10px] rounded-2xl">Управляйте очередью "название"</div>*/}
            {/*    </div>*/}
            {/*    /!*Управление очередью*!/*/}
            {/*    <button className="mx-auto" id="openAdministrateQueue">*/}
            {/*        <div className="bg-secondbackground rounded-2xl p-[10px]">*/}
            {/*            <div className="bg-background p-[40px] rounded-full">*/}
            {/*                <svg className="fill-foreground w-[60px]" viewBox="0 0 24 24">*/}
            {/*                    <path d="M21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4h6a1,1,0,0,0,0-2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM6,12.76V17a1,1,0,0,0,1,1h4.24a1,1,0,0,0,.71-.29l6.92-6.93h0L21.71,8a1,1,0,0,0,0-1.42L17.47,2.29a1,1,0,0,0-1.42,0L13.23,5.12h0L6.29,12.05A1,1,0,0,0,6,12.76ZM16.76,4.41l2.83,2.83L18.17,8.66,15.34,5.83ZM8,13.17l5.93-5.93,2.83,2.83L10.83,16H8Z"></path>*/}
            {/*                </svg>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </button>*/}
            {/*</section>*/}

            <section className="flex flex-row sm:flex-nowrap flex-wrap gap-[20px] mb-[40px]">
                <div className="flex flex-col gap-[20px] w-full">
                    <div
                        className="flex flex-row gap-2 justify-center text-3xl text-nowrap bg-secondbackground rounded-2xl p-[10px]">
                        <div>Что мы</div>
                        <div className="text-foreground">умеем?</div>
                    </div>
                    <div
                        className="text-2xl text-center text-textInput bg-secondbackground rounded-2xl p-[10px]">
                        Пример текста пример текста
                        Пример текста пример текста
                        Пример текста пример текста
                        Пример текста пример текста
                        Пример текста пример текста
                        Пример текста пример текста
                    </div>
                </div>
                <div className="flex flex-col gap-[20px] w-full">
                    <div className="flex flex-row gap-2 justify-center text-3xl text-nowrap bg-secondbackground rounded-2xl p-[10px]">
                        <div>Используйте наш</div><div className="text-foreground">API</div>
                    </div>
                    <div className="flex flex-row gap-[20px] w-full h-full text-2xl">
                        <div className="flex flex-col justify-center w-full bg-secondbackground rounded-2xl p-[10px]">
                            <div className="flex flex-row gap-2 justify-center text-nowrap">
                                <div className="text-foreground">Swagger</div>
                            </div>
                            <div className="text-center text-textInput">For better models and testing & mocking.</div>
                        </div>
                        <div className="flex flex-col justify-center w-full bg-secondbackground rounded-2xl p-[10px]">
                            <div className="flex flex-row gap-2 justify-center text-nowrap">
                               <div className="text-foreground">Redoc</div>
                            </div>
                            <div className="text-center text-textInput">For better response viewing.</div>
                        </div>
                    </div>
                </div>
            </section>
            {/*<ModalCreateQueue/>*/}
            {/*<ModalAdministrateQueue/>*/}
        </div>
);
}
