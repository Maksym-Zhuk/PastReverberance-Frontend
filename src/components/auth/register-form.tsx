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
import { useEffect } from 'react';
import { REGISTER } from '@/graphql/auth';
import { useRouter } from 'next/navigation';

interface profile {
  firstName: string;
  lastName: string;
}

type Input = {
  profile: profile;
  email: string;
  password: string;
};

export function RegisterForm({
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
  const [login, { data }] = useMutation(REGISTER);
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
          profile: {
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
          },
        },
      },
    });
    reset();
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Enter your login and email below to register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="firstName">FirstName</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="FirstName"
                  required
                  {...register('profile.firstName', {
                    required: 'Login is require field!',
                  })}
                />
                {errors?.profile?.firstName && (
                  <div style={{ color: 'red' }}>
                    {errors.profile.firstName.message}
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastName">LastName</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="LastName"
                  required
                  {...register('profile.lastName', {
                    required: 'Login is require field!',
                  })}
                />
                {errors?.profile?.lastName && (
                  <div style={{ color: 'red' }}>
                    {errors.profile.lastName.message}
                  </div>
                )}
              </div>
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
                  Register
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Do you have an account?{' '}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
