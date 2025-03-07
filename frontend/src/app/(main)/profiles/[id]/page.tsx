"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ModalSettings from '@/components/ModalSettings';

interface UserProfile {
  username: string;
  avatar_url: string;
}
export default function Home() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }
        console.log('Fetching profile for user ID:', userId);

        const response = await fetch(`http://localhost:8000/api/profiles/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Пользователь не найден');
          }
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, router]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-background items-center justify-items-center">
      <main className="flex items-center justify-center flex-col m-[120px]">
      {userData ? (
        <>
        <img src={userData.avatar_url}
          className="profile-user-img rounded-full w-40 h-40 object-cover " />
        <h1 className="text-4xl m-6 border-b-2 border-foreground text-stroke">{userData.username}</h1>
        </> ) : (
        <p>Ошибка загрузки данных пользователя</p>
      )}
        <div className="m-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-secondbackground p-3 rounded-2xl">
            {/* Стандарт */}
            <div className="flex flex-col items-center gap-2 p-2">
              <svg viewBox="0 0 169 104" className="w-full max-w-[169px] fill-foreground">
                <path d="M148.72 0.0893555H20.139C9.18629 0.0893555 0.276611 9.00068 0.276611 19.953V38.349V44.2393L6.10584 45.0756C9.47589 45.5588 12.0176 48.4894 12.0176 51.8923C12.0176 55.2929 9.47721 58.2235 6.10879 58.7067L0.276611 59.5403V65.4337V83.8322C0.276611 94.7823 9.18629 103.694 20.139 103.694H148.72C159.672 103.694 168.582 94.7823 168.582 83.8322V65.556V59.0706L162.104 58.7679C158.422 58.5956 155.537 55.5743 155.537 51.8926C155.537 48.2109 158.422 45.19 162.106 45.0151L168.582 44.7097V38.2273V19.9534C168.582 9.00067 159.673 0.0893555 148.72 0.0893555ZM161.787 38.2273C154.526 38.5699 148.741 44.5477 148.741 51.8926C148.741 59.2379 154.526 65.2157 161.787 65.5556V83.8319C161.787 91.047 155.936 96.8976 148.72 96.8976H20.139C12.9225 96.8976 7.07228 91.047 7.07228 83.8319V65.4333C13.7072 64.483 18.8132 58.7915 18.8132 51.8923C18.8132 44.9934 13.7072 39.3019 7.07228 38.349V19.953C7.07228 12.7356 12.9229 6.88502 20.139 6.88502H148.72C155.936 6.88502 161.787 12.7356 161.787 19.953V38.2273Z"/>
                <path d="M43.7912 76.9277H39.2956V88.6529H43.7912V76.9277Z"/>
                <path d="M43.7912 56.3284H39.2956V68.0536H43.7912V56.3284Z"/>
                <path d="M43.7912 35.7268H39.2956V47.4543H43.7912V35.7268Z"/>
                <path d="M43.7912 15.1301H39.2956V26.8553H43.7912V15.1301Z"/>
              </svg>
              <p className="text-lg font-medium text-gray-300">Стандарт</p>
              <input type="radio" name="skin" className="w-5 h-5 text-accent bg-gray-700 border-2 border-gray-500 rounded-full cursor-pointer focus:ring-0"/>
            </div>
            {/* Выживший */}
            <div className="flex flex-col items-center gap-2 p-2">
              <svg viewBox="0 0 169 104" className="w-full max-w-[169px] fill-skinsurvivor">
                <path d="M148.72 0.0893555H20.139C9.18629 0.0893555 0.276611 9.00068 0.276611 19.953V38.349V44.2393L6.10584 45.0756C9.47589 45.5588 12.0176 48.4894 12.0176 51.8923C12.0176 55.2929 9.47721 58.2235 6.10879 58.7067L0.276611 59.5403V65.4337V83.8322C0.276611 94.7823 9.18629 103.694 20.139 103.694H148.72C159.672 103.694 168.582 94.7823 168.582 83.8322V65.556V59.0706L162.104 58.7679C158.422 58.5956 155.537 55.5743 155.537 51.8926C155.537 48.2109 158.422 45.19 162.106 45.0151L168.582 44.7097V38.2273V19.9534C168.582 9.00067 159.673 0.0893555 148.72 0.0893555ZM161.787 38.2273C154.526 38.5699 148.741 44.5477 148.741 51.8926C148.741 59.2379 154.526 65.2157 161.787 65.5556V83.8319C161.787 91.047 155.936 96.8976 148.72 96.8976H20.139C12.9225 96.8976 7.07228 91.047 7.07228 83.8319V65.4333C13.7072 64.483 18.8132 58.7915 18.8132 51.8923C18.8132 44.9934 13.7072 39.3019 7.07228 38.349V19.953C7.07228 12.7356 12.9229 6.88502 20.139 6.88502H148.72C155.936 6.88502 161.787 12.7356 161.787 19.953V38.2273Z"/>
                <path d="M43.7912 76.9277H39.2956V88.6529H43.7912V76.9277Z"/>
                <path d="M43.7912 56.3284H39.2956V68.0536H43.7912V56.3284Z"/>
                <path d="M43.7912 35.7268H39.2956V47.4543H43.7912V35.7268Z"/>
                <path d="M43.7912 15.1301H39.2956V26.8553H43.7912V15.1301Z"/>
              </svg>
              <p className="text-lg font-medium text-gray-300">Выживший</p>
              <input type="radio" name="skin" className="w-5 h-5 text-accent bg-gray-700 border-2 border-gray-500 rounded-full cursor-pointer focus:ring-0"/>
            </div>
            {/*Легенда*/}
            <div className="flex flex-col items-center gap-2 p-2">
              <svg viewBox="0 0 169 104" className="w-full max-w-[169px] fill-skinlegend">
                <path d="M148.72 0.0893555H20.139C9.18629 0.0893555 0.276611 9.00068 0.276611 19.953V38.349V44.2393L6.10584 45.0756C9.47589 45.5588 12.0176 48.4894 12.0176 51.8923C12.0176 55.2929 9.47721 58.2235 6.10879 58.7067L0.276611 59.5403V65.4337V83.8322C0.276611 94.7823 9.18629 103.694 20.139 103.694H148.72C159.672 103.694 168.582 94.7823 168.582 83.8322V65.556V59.0706L162.104 58.7679C158.422 58.5956 155.537 55.5743 155.537 51.8926C155.537 48.2109 158.422 45.19 162.106 45.0151L168.582 44.7097V38.2273V19.9534C168.582 9.00067 159.673 0.0893555 148.72 0.0893555ZM161.787 38.2273C154.526 38.5699 148.741 44.5477 148.741 51.8926C148.741 59.2379 154.526 65.2157 161.787 65.5556V83.8319C161.787 91.047 155.936 96.8976 148.72 96.8976H20.139C12.9225 96.8976 7.07228 91.047 7.07228 83.8319V65.4333C13.7072 64.483 18.8132 58.7915 18.8132 51.8923C18.8132 44.9934 13.7072 39.3019 7.07228 38.349V19.953C7.07228 12.7356 12.9229 6.88502 20.139 6.88502H148.72C155.936 6.88502 161.787 12.7356 161.787 19.953V38.2273Z"/>
                <path d="M43.7912 76.9277H39.2956V88.6529H43.7912V76.9277Z"/>
                <path d="M43.7912 56.3284H39.2956V68.0536H43.7912V56.3284Z"/>
                <path d="M43.7912 35.7268H39.2956V47.4543H43.7912V35.7268Z"/>
                <path d="M43.7912 15.1301H39.2956V26.8553H43.7912V15.1301Z"/>
              </svg>
              <p className="text-lg font-medium text-gray-300">Легенда</p>
              <input type="radio" name="skin" className="w-5 h-5 text-accent bg-gray-700 border-2 border-gray-500 rounded-full cursor-pointer focus:ring-0"/>
            </div>
          </div>
        </div>
        <div className="flex justify-center m-1.5">
          <button id="openSettings" type="button">
            <svg className="fill-secondbackground hover:fill-foreground transition-all"
              width="50px"
              viewBox="0 0 24 24" version="1.1">
              <path
                d="M10.75,2.56687 C11.5235,2.12029 12.4765,2.12029 13.25,2.56687 L13.25,2.56687 L19.5443,6.20084 C20.3178,6.64743 20.7943,7.47274 20.7943,8.36591 L20.7943,8.36591 L20.7943,15.6339 C20.7943,16.527 20.3178,17.3523 19.5443,17.7989 L19.5443,17.7989 L13.25,21.4329 C12.4765,21.8795 11.5235,21.8795 10.75,21.4329 L10.75,21.4329 L4.45581,17.7989 C3.68231,17.3523 3.20581,16.527 3.20581,15.6339 L3.20581,15.6339 L3.20581,8.36591 C3.20581,7.47274 3.68231,6.64743 4.45581,6.20084 L4.45581,6.20084 L10.75,2.56687 Z M12.0000075,8.99989 C10.3431491,8.99989 9.0000075,10.3430316 9.0000075,11.99989 C9.0000075,13.6567184 10.3431491,14.99989 12.0000075,14.99989 C13.6568209,14.99989 14.9999925,13.6567184 14.9999925,11.99989 C14.9999925,10.3430316 13.6568209,8.99989 12.0000075,8.99989 Z">
              </path>
            </svg>
          </button>
        </div>
      </main>
      <ModalSettings userData={userData!}/>
    </div>
  );
}