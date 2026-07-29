import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { updateUser } from '../../services/users';
import Button from '../../ui/Button';

function UpdateUserForm({ user, onCloseModal }) {
  const queryClient = useQueryClient();
  const [previewImg, setPreviewImg] = useState(user.profileImg || null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profileImg: null,
    },
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onCloseModal?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    if (!isDirty) return;

    const payload = { ...data };

    // Skip sending email if unchanged
    if (payload.email === user.email) delete payload.email;

    let body;

    if (payload.profileImg instanceof File) {
      body = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          body.append(key, value);
        }
      });
    } else {
      delete payload.profileImg;
      body = payload;
    }

    mutation.mutate(body);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImg(url);

    setValue('profileImg', file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    return () => {
      if (previewImg?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImg);
      }
    };
  }, [previewImg]);

  const { onChange: profileImgOnChange, ...profileImgRegister } =
    register('profileImg');

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          {...register('name', {
            required: 'Name is required',
          })}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email',
            },
          })}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Phone (optional)
        </label>
        <input
          {...register('phone')}
          placeholder="Enter phone number"
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Profile Image (optional)
        </label>

        <div className="flex items-center gap-4">
          {previewImg && (
            <img
              src={previewImg}
              alt="Profile preview"
              className="h-12 w-12 rounded-full object-cover"
            />
          )}

          <label className="cursor-pointer rounded-md bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300">
            Choose Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...profileImgRegister}
              onChange={(e) => {
                profileImgOnChange(e);
                handleImageChange(e);
              }}
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          type="button"
          onClick={onCloseModal}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={mutation.isPending}
          disabled={!isDirty || mutation.isPending}
        >
          Update
        </Button>
      </div>
    </form>
  );
}

export default UpdateUserForm;
