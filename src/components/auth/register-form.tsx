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
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { REGISTER } from '@/graphql/auth';
import { useRouter } from 'next/navigation';
import { EMAIL_RE, FieldError } from './field-error';

type FormInput = {
  profile: { firstName: string; lastName: string };
  email: string;
  password: string;
};

// mirrors the server's IsStrongPassword defaults so users see the rules up front
const PASSWORD_HINT =
  'At least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.';
const isStrong = (p: string) =>
  p.length >= 8 &&
  /[a-z]/.test(p) &&
  /[A-Z]/.test(p) &&
  /\d/.test(p) &&
  /[^A-Za-z0-9]/.test(p);

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
<<<<<<< Updated upstream
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
=======
  } = useForm<FormInput>({ mode: 'onTouched' });
  const registerUser = useRegister();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    registerUser.mutate(
      {
        email: data.email.trim(),
        password: data.password,
        profile: {
          firstName: data.profile.firstName.trim(),
          lastName: data.profile.lastName.trim(),
        },
      },
      {
        onSuccess: () => {
          reset();
          router.push('/');
          router.refresh();
        },
      },
    );
>>>>>>> Stashed changes
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    aria-required
                    aria-invalid={!!errors.profile?.firstName}
                    aria-describedby="firstName-error"
                    {...register('profile.firstName', {
                      required: 'First name is required',
                      validate: (v) => !!v.trim() || 'First name is required',
                    })}
                  />
                  <FieldError
                    id="firstName-error"
                    message={errors.profile?.firstName?.message}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    aria-required
                    aria-invalid={!!errors.profile?.lastName}
                    aria-describedby="lastName-error"
                    {...register('profile.lastName', {
                      required: 'Last name is required',
                      validate: (v) => !!v.trim() || 'Last name is required',
                    })}
                  />
                  <FieldError
                    id="lastName-error"
                    message={errors.profile?.lastName?.message}
                  />
                </div>
              </div>
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
                  autoComplete="new-password"
                  aria-required
                  aria-invalid={!!errors.password}
                  aria-describedby="password-hint password-error"
                  {...register('password', {
                    required: 'Password is required',
                    validate: (v) => isStrong(v) || PASSWORD_HINT,
                  })}
                />
                <p id="password-hint" className="text-muted-foreground text-xs">
                  {PASSWORD_HINT}
                </p>
                <FieldError
                  id="password-error"
                  message={errors.password?.message}
                />
              </div>
<<<<<<< Updated upstream
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
=======
              {registerUser.error && (
                <div role="alert" className="text-destructive text-sm">
                  {registerUser.error.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={registerUser.isPending}
              >
                {registerUser.isPending ? 'Creating account…' : 'Register'}
              </Button>
>>>>>>> Stashed changes
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
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
