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

    // 1. Filter out empty, null, or undefined fields (like an empty phone string)
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== '' && value !== null && value !== undefined,
      ),
    );

    const payload = { ...cleanedData };

    if (payload.email === user.email) delete payload.email;

    let body;

    if (payload.profileImg instanceof File) {
      body = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        body.append(key, value);
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
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="label">Name</label>
        <input
          {...register('name', {
            required: 'Name is required',
          })}
          className="input"
        />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email',
            },
          })}
          className="input"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <label className="label">Phone (optional)</label>
        <input
          {...register('phone')}
          placeholder="Enter phone number"
          className="input"
        />
      </div>

      <div>
        <label className="label">Profile Image (optional)</label>

        <div className="flex items-center gap-4">
          {previewImg && (
            <img
              src={previewImg}
              alt="Profile preview"
              className="h-14 w-14 rounded-full border border-border object-cover"
            />
          )}

          <label className="cursor-pointer rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
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

      <div className="flex justify-end gap-3 border-t border-border pt-4">
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
