import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/core/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}