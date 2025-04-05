import { Toaster } from "@/components/ui/sonner";
import "./style.css";

import "./tailwind.css";

export default function LayoutDefault({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen">
            {children}
            <Toaster />
        </div>
    );
}
