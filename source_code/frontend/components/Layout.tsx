import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import '../styles/globals.css'
export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            {pathname !== '/' && <Navbar />}
            <main>{children}</main>
        </>
    );
}
