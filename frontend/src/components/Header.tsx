'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: string;
}

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode<TokenPayload>(token);
                    setUserId(decoded.sub);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Invalid token:", error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        }
    }, []);

    const links = [
        {
            href: '/',
            label: 'Главная'
        },
        {
            href: '/queue',
            label: 'Очередь'
        },
        { 
            href: userId ? `/profiles/${userId}` : '/login', 
            label: 'Профиль', 
            authRequired: false 
        },
        {
            href: '/contact',
            label: 'Информация'
        },
    ];
    const handleProtectedNavigation = (path: string) => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            router.push(path);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        setUserId(null);
        router.push('/');
    };

    return (
        <header className="backdrop-blur-xl bg-backgroundHeader w-full flex justify-between sticky top-0 z-50 mt-2">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="align-center text-[20px]">
                    DQ
                </Link>

                <div className="flex space-x-6">
                    {links.map((link) => {
                        if (link.authRequired) {
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => handleProtectedNavigation(link.href)}
                                    className={`${pathname === link.href ? 'border-b-2 border-foreground' : 'text-gray-600 hover:text-white'} transition-colors cursor-pointer`}
                                >
                                    {link.label}
                                </button>
                            );
                        }
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${pathname === link.href ? 'border-b-2 border-foreground' : 'text-gray-600 hover:text-white'} transition-colors`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex space-x-6 bg-foreground text-black p-2 rounded-2xl shadow-4xl">
                    {isAuthenticated ? (
                        <button onClick={handleLogout}>Выйти</button>
                    ) : (
                        <Link href="/login">
                            <button>Войти</button>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;