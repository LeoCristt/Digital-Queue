import Link from 'next/link';
import Image from 'next/image';


export default function Login() {
  return (
    <div className="bg-secondbackground p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex justify-center mb-6">
        <Link href="/">
          <Image
            src="/images/logo.png" 
            alt="Logo"
            width={50}
            height={50}
            className="h-12"
          />
        </Link>
      </div>
      <h2 className="text-center text-2xl text-white mb-6">Авторизация</h2>
      <form id="login_form" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300" htmlFor="email/login">
            Адрес электронной почты
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
            id="email/login"
            name="email/login"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300" htmlFor="name/login">
            Имя пользователя
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
            id="name/login"
            name="name/login"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300" htmlFor="password">
            Пароль
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
            id="password/login"
            name="password/login"
            required
            type="password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300" htmlFor="repeatpassword">
            Пароль
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
            id="repeatpassword/login"
            name="repeatpassword/login"
            required
            type="password"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              className="h-4 w-4 text-textColor focus:ring-textColor border-gray-600 rounded bg-gray-700"
              id="remember_me"
              name="remember_me"
              type="checkbox"
            />  
            <label className="ml-2 block text-sm text-gray-300" htmlFor="remember_me">
              Запомнить меня
            </label>
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-textColor hover:text-textColor">
              Забыл пароль?
            </Link>
          </div>
        </div>
        <div>
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-textColor bg-colorbutton hover:bg-foregroundhover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
          >
            Войти
          </button>
        </div>
        <div id="message" style={{ display: 'none' }} className="flex items-center justify-center">
          <label className="ml-2 block text-sm text-red-500" id="response-message"></label>
        </div>
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Или продолжить с</span>
          </div>
        </div>
        <div className="grid gap-3">
          <div>
            <Link
              href="/login/yandex"
              className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
              <span className="sr-only">Войти через Яндекс</span>
              Яндекс
            </Link>
          </div>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Нет аккаунта?{' '}
          <Link href="/register" className="font-medium text-foreground hover:text-foregroundhover">
            Нажми, чтобы зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}