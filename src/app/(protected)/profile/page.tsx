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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            aria-invalid={!!errors.firstName}
            {...register('firstName', { required: 'First name is required' })}
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
            pattern: { value: EMAIL_RE, message: 'Please enter a valid email' },
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
      <Button
        type="submit"
        className="w-full sm:w-auto sm:justify-self-end"
        disabled={!isDirty || update.isPending}
      >
        {update.isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}

export default function ProfilePage() {
  const { data: user, isLoading, error } = useMe();
  const logout = useLogout();
  const deleteMe = useDeleteMe();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-4 lg:p-8">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {isLoading && <div className="bg-muted h-80 animate-pulse rounded-xl" />}
      {error && (
        <p role="alert" className="text-destructive">
          Error: {error.message}
        </p>
      )}
      {user && <ProfileForm user={user} />}

      <section className="space-y-3 border-t pt-6">
        <h2 className="text-lg font-medium">Account</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            Log out
          </Button>
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
                <AlertDialogAction onClick={() => deleteMe.mutate()}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  );
}
