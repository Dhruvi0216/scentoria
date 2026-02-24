import Link from "next/link";

export function Navbar() {
    return (
        <nav className="border-b border-input bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    SCENTORIA
                </Link>
                <div className="text-sm text-muted-foreground">
                    {/* Placeholder for future menu or search */}
                    beta
                </div>
            </div>
        </nav>
    );
}
