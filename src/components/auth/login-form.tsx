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
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/graphql/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Input = {
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
  } = useForm<Input>({
    mode: 'onChange',
  });
  const [login, { data }] = useMutation(LOGIN);
  const router = useRouter();

  useEffect(() => {
    if (data) router.push('/');
  }, [data, router]);

  const onSubmit: SubmitHandler<Input> = (data) => {
    login({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    });
    reset();
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register('email', {
                    required: 'Email is require field!',
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Please enter valid email!',
                    },
                  })}
                />
                {errors?.email && (
                  <div style={{ color: 'red' }}>{errors.email.message}</div>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register('password', {
                    required: 'Password is require field!',
                    minLength: 8,
                  })}
                />
                {errors?.password && (
                  <div style={{ color: 'red' }}>{errors.password.message}</div>
                )}
                {errors?.password && (
                  <div style={{ color: 'red' }}>
                    {errors.password.type === 'minLength'
                      ? 'Passwords must contain at least 8 characters.'
                      : ''}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
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
