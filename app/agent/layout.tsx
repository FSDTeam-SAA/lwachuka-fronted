import { Sidebar } from "@/components/dashboard/Sidebar";

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            <Sidebar />
            <main className="ml-[240px] min-h-screen">
                {children}
            </main>
        </div>
    );
}
