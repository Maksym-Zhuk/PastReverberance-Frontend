import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center">
      <RegisterForm className="max-sm:w-80 w-90" />
    </div>
  );
}
