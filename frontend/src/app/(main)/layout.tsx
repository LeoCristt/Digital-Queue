import Header from '@/components/Header';

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="main-container">
            <Header />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}