import Header from '@/components/Header';

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="container">
            <Header />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}