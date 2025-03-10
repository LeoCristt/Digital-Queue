import Header from '@/components/Header';
import MobileNavbar from "@/components/MobileNavbar"

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col justify-between container h-screen">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <MobileNavbar/>
        </div>
    )
}