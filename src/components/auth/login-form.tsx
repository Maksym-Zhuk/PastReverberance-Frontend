'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { EMAIL_RE, FieldError } from './field-error';

type FormInput = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({ mode: 'onTouched' });
  const login = useLogin();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    login.mutate(
      { email: data.email.trim(), password: data.password },
      {
        onSuccess: () => {
          reset();
          router.push('/');
          router.refresh();
        },
      },
    );
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  aria-required
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: EMAIL_RE,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
                <FieldError id="email-error" message={errors.email?.message} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  aria-required
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <FieldError
                  id="password-error"
                  message={errors.password?.message}
                />
              </div>
              {login.error && (
                <div role="alert" className="text-destructive text-sm">
                  {login.error.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={login.isPending}
              >
                {login.isPending ? 'Signing in…' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
