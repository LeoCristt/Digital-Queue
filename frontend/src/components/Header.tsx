'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Главная' },
        { href: '/queue', label: 'Очередь' },
        { href: '/profile', label: 'Профиль' },
        { href: '/contact', label: 'Информация' },
    ];

    return (
        <header className="backdrop-blur-xl bg-backgroundHeader width-full flex justify-between sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between" >
                <Link
                    href="/"
                    className="align-center text-[20px]"
                >
                    DQ
                </Link>

                <div className="flex space-x-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${
                                pathname === link.href
                                    ? 'border-b-2 border-foreground'
                                    : 'text-gray-600 hover:text-white'
                            } transition-colors`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex space-x-6 bg-foreground text-black p-2 rounded-2xl shadow-4xl">
                <Link
                    href="/login"
                    className=""
                >
                    <button>Login</button>
                </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;