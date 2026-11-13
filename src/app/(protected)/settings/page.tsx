'use client';
import { Button } from '@/components/ui/button';
import { ThemeSelect } from '@/components/ThemeToggle';
import { useLogout } from '@/hooks/useAuth';

export default function Settings() {
  const logout = useLogout();
  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-4 lg:p-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Appearance</h2>
        <ThemeSelect />
      </section>
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg font-medium">Session</h2>
        <Button
          variant="outline"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          Log out
        </Button>
      </section>
    </div>
  );
}
