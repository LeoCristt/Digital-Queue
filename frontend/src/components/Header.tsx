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
        <header className="bg-background width-full flex justify-between sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between" >
                <Link
                    href=""
                    className="text-white align-center text-[20px]"
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
                                    ? 'text-white border-b-2 border-foreground'
                                    : 'text-gray-600 hover:text-white'
                            } transition-colors`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex space-x-6 bg-foreground text-black p-2 rounded-2xl shadow-4xl">
                    <button>Login</button>
                </div>
            </nav>
        </header>
    );
};

export default Header;