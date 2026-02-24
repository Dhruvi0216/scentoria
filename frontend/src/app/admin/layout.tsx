import Link from "next/link";
import { LayoutDashboard, Database, Settings } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold tracking-tight mb-6">Admin Panel</h2>
                    <nav className="space-y-2">
                        <Link
                            href="/admin/scrape"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Scraping Manager
                        </Link>
                        <Link
                            href="/admin/perfumes"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Database className="w-4 h-4" />
                            Perfumes
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-secondary/10">
                {children}
            </main>
        </div>
    );
}
