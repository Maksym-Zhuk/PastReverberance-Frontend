import SidebarDesktop from '@/components/Nav/Sidebars/SidebarDesktop';
import SidebarMobile from '@/components/Nav/Sidebars/SidebarMobile';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground mx-auto flex min-h-[100dvh] w-full max-w-[1650px] lg:flex-row">
      <SidebarDesktop />
      <main className="min-w-0 flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <SidebarMobile />
    </div>
  );
}
