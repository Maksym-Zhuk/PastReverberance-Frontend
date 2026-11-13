'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FieldError, EMAIL_RE } from '@/components/auth/field-error';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThemeSelect } from '@/components/ThemeToggle';
import { useDeleteMe, useLogout, useMe, useUpdateMe } from '@/hooks/useAuth';
import { errorMessage } from '@/lib/api';
import type { User } from '@/types/api';

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
};

function ProfileForm({ user }: { user: User }) {
  const update = useUpdateMe();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Values>({
    defaultValues: {
      firstName: user.profile?.firstName ?? '',
      lastName: user.profile?.lastName ?? '',
      email: user.email,
      description: user.profile?.description ?? '',
    },
  });

  const onSubmit = (v: Values) =>
    update.mutate(
      { ...v, email: v.email.trim() },
      {
        onSuccess: (u) => {
          toast.success('Profile saved');
          reset({
            firstName: u.profile?.firstName ?? '',
            lastName: u.profile?.lastName ?? '',
            email: u.email,
            description: u.profile?.description ?? '',
          });
        },
        onError: (e) => toast.error(errorMessage(e)),
      },
    );

  return (
    <Card>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Your name and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                aria-invalid={!!errors.firstName}
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              <FieldError id="fn-err" message={errors.firstName?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                aria-invalid={!!errors.lastName}
                {...register('lastName', { required: 'Last name is required' })}
              />
              <FieldError id="ln-err" message={errors.lastName?.message} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_RE,
                  message: 'Please enter a valid email',
                },
              })}
            />
            <FieldError id="email-err" message={errors.email?.message} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">About you</Label>
            <Textarea
              id="description"
              className="h-28 resize-none"
              {...register('description')}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!isDirty || update.isPending}
          >
            {update.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

const initials = (u: User) =>
  (
    `${u.profile?.firstName?.[0] ?? ''}${u.profile?.lastName?.[0] ?? ''}` ||
    u.email[0]
  ).toUpperCase();

function Row({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between ${className ?? ''}`}
    >
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { data: user, isLoading, error } = useMe();
  const logout = useLogout();
  const deleteMe = useDeleteMe();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 lg:p-8">
      <header className="flex items-center gap-4">
        {user ? (
          <>
            <div
              aria-hidden
              className="bg-primary text-primary-foreground flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
            >
              {initials(user)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold">
                {[user.profile?.firstName, user.profile?.lastName]
                  .filter(Boolean)
                  .join(' ') || 'Profile'}
              </h1>
              <p className="text-muted-foreground truncate text-sm">
                {user.email}
              </p>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-semibold">Profile</h1>
        )}
      </header>

      {isLoading && <div className="bg-muted h-96 animate-pulse rounded-xl" />}
      {error && (
        <p role="alert" className="text-destructive">
          Error: {error.message}
        </p>
      )}
      {user && <ProfileForm user={user} />}

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how the app looks to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelect />
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 [&>div]:py-5">
        <Row title="Log out" description="Sign out on this device.">
          <Button
            variant="outline"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            Log out
          </Button>
        </Row>
        <Row
          title="Delete account"
          description="Permanently remove your profile and all your photos."
          className="border-destructive/30 border-t"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your profile and all your photos will be removed permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: 'destructive' })}
                  onClick={() => deleteMe.mutate()}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </Card>
    </div>
  );
}
