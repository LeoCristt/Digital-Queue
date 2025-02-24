import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
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
        <h2 className="text-center text-2xl text-white mb-6">Регистрация</h2>
        <form id="register_form" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="email">
              Почта
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
              id="email"
              name="email"
              required
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="login">
              Логин
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
              id="login"
              name="login"
              required
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">
              Пароль
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
              id="password1"
              name="password"
              required
              type="password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300" htmlFor="password-again">
              Повтор пароля
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
              id="password2"
              name="password-again"
              required
              type="password"
            />
          </div>
          <div id="code_container" className="hidden">
            <label className="block text-sm font-medium text-gray-300">
              Введите код, который пришел вам на почту
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-gray-700 text-white"
              id="code"
            />
          </div>
          <div className="flex items-center">
            <input
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              id="personalData"
              name="personalData"
              type="checkbox"
              required
            />
            <label className="ml-2 block text-sm text-gray-300" htmlFor="personalData">
              Согласие на обработку персональных данных
            </label>
          </div>
          <div>
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-colorbutton hover:bg-foregroundhover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="submit"
            >
              Зарегистрироваться
            </button>
          </div>
          <div id="message" className="hidden flex items-center justify-center flex-col">
            <label className="ml-2 block text-sm text-red-500" id="response-message"></label>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-foreground hover:text-foregroundhover">
              Нажми, чтобы войти
            </Link>
          </p>
        </div>
      </div>
  );
}