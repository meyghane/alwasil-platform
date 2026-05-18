'use client';
import { usePathname } from 'next/navigation';
import ChatBot from './ChatBot';

export default function ChatBotWrapper() {
 const path = usePathname();
 // Pas de ChatBot sur les pages admin/modo (elles ont ChatInterne)
 if (path.startsWith('/admin') || path.startsWith('/modo')) return null;
 return <ChatBot />;
}
