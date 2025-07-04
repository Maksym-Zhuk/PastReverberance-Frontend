import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center">
      <LoginForm className="max-sm:w-80 w-90" />
    </div>
  );
}
