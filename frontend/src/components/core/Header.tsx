"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';
import { LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';

export default function Header() {
  const { logout, isLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="py-4 px-8 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          Svara<span className="text-blue-400">AI</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/projects" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <FolderKanban size={16} /> Projects
              </Link>
              <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
                <LogOut size={16} /> Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}