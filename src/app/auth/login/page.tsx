import { LoginForm } from '@/components/auth/login-form';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center px-4 py-10">
      <ThemeToggle className="absolute top-4 right-4" />
      <LoginForm className="w-full max-w-sm" />
    </main>
  );
}
