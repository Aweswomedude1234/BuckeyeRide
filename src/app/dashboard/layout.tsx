import Link from 'next/link';
import {
  Home,
  Users,
  Calendar,
  User,
  Settings,
  Map,
  Car,
  MessageSquare,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Logo } from '@/components/icons/logo';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { href: '/dashboard/schedule', label: 'My Schedule', icon: <Calendar className="h-5 w-5" /> },
    { href: '/dashboard/matches', label: 'Find Matches', icon: <Users className="h-5 w-5" /> },
    { href: '/dashboard/route-planning', label: 'Route Planner', icon: <Map className="h-5 w-5" /> },
    { href: '/dashboard/groups', label: 'Groups', icon: <Car className="h-5 w-5" /> },
    { href: '/dashboard/chat', label: 'Chat', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/dashboard/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-lg font-semibold text-primary-foreground md:h-12 md:text-base"
          >
            <Logo className="h-6 w-6 transition-all group-hover:scale-110" />
            <span className="font-headline text-lg">BuckeyeRide</span>
          </Link>
          <div className="w-full mt-4 flex flex-col gap-2">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                >
                {link.icon}
                {link.label}
                </Link>
            ))}
          </div>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-full"
            >
                <Settings className="h-5 w-5" />
                Settings
            </Link>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <DashboardHeader navLinks={navLinks} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
