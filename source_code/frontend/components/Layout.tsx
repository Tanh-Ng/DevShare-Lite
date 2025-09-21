import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { ToastContainer } from './Toast';
import FloatingActionButton from './FloatingActionButton';
import ProgressBar from './ProgressBar';
import { useToast } from '../hooks/useToast';
import '../styles/globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { toasts, removeToast } = useToast();

    return (
        <>
            <ProgressBar />
            {pathname !== '/' && <Navbar />}
            <main className={pathname !== '/' ? 'pt-20' : ''}>
                {children}
            </main>
            {pathname !== '/' && <FloatingActionButton />}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </>
    );
}
