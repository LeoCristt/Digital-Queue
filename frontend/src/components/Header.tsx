'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
    sub: string;
}

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('access_token');
            }
        } else {
        }
    }, []);

    const links = [
        {
            href: '/',
            label: 'Главная'
        },
        {
            href: '/queue',
            label: 'Очередь',
        },
        {
            href: `/profiles/${userId}`,
            label: 'Профиль',
            authRequired: true
        },
    ];

    const handleProtectedNavigation = (path: string) => {
        if (userId == null) {
            router.push('/login');
        } else {
            router.push(path);
        }
    };

    return (
        <header className="backdrop-blur-xl bg-backgroundHeader w-full sticky top-0 z-50 py-2 px-4">
            <nav
                className="hidden container px-4 py-2 sm:flex items-center justify-between text-lg"> {/* Уменьшил padding и размер шрифта */}
                <Link href="/" className="align-center text-xl"> {/* Уменьшил размер шрифта */}
                    DQ
                </Link>

                <div className="flex space-x-6">
                    {links.map((link) => {

                        return link.authRequired ? (
                            <button
                                key={link.href}
                                onClick={() => handleProtectedNavigation(link.href)}
                                className={`${pathname === link.href ? 'border-b-2 border-foreground' : 'text-trhirdbackground hover:text-textColor'} transition-colors cursor-pointer`}
                            >
                                {link.label}
                            </button>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${pathname === link.href ? 'border-b-2 border-foreground' : 'text-trhirdbackground hover:text-textColor'} transition-colors`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>


                <div className="space-x-6"></div>
            </nav>
        </header>
    );
};

export default Header;
