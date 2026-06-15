import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-x-hidden">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}