import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../services/users';
import SpinnerMini from '../../ui/SpinnerMini';

function UpdateUserForm({ user, onCloseModal }) {
  const queryClient = useQueryClient();
  const [previewImg, setPreviewImg] = useState(user.profileImg || null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profileImg: null, // will hold File object
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
    // Skip sending email if unchanged
    if (data.email === user.email) delete data.email;

    let body;
    if (data.profileImg instanceof File) {
      body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) body.append(key, value);
      });
    } else {
      body = data; // JSON
    }

    mutation.mutate(body);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImg(URL.createObjectURL(file));
    setValue('profileImg', file, { shouldValidate: true }); // important
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          {...register('email', { required: 'Email is required' })}
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
              {...register('profileImg')}
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCloseModal}
          className="rounded-md border px-4 py-2 text-sm"
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <SpinnerMini /> : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default UpdateUserForm;
