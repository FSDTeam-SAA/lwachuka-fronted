import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AgentDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-slate-100">
                <h1 className="text-3xl font-bold mb-6 text-slate-800">Agent/Owner Dashboard</h1>
                <div className="space-y-4">
                    <p className="text-slate-600">Welcome back, {session.user?.firstName} {session.user?.lastName}</p>
                    <div className="bg-[#f0f7f9] p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-700 mb-2">Session Data</h3>
                        <pre className="text-sm overflow-auto text-slate-600 break-all">
                            {JSON.stringify(session.user, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
