import Header from '@/components/Header';
import MobileNavbar from "@/components/MobileNavbar"

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
            <MobileNavbar/>
        </div>
    )
}