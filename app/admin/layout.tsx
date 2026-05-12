import Navbar from '@/app/components/Navbar';
import AdminSidebar from '@/app/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar admin />
      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <AdminSidebar />
        {children}
      </main>
    </>
  );
}
