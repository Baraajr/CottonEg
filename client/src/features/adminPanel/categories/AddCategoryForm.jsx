import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createCategory } from '../../../services/category';
import SpinnerMini from '../../../ui/SpinnerMini';
import { GENDERS } from '../../../constants/constants';

function AddCategoryForm({ onCloseModal }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category added successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset();
      onCloseModal?.();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to add category');
    },
  });

  function onSubmit(data) {
    mutate({ name: data.name, genders: data.genders });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label>
        Category name <span className="text-red-500">*</span>
      </label>
      <input
        {...register('name', { required: 'Category name is required' })}
        className="input"
      />
      {errors.name && (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      )}

      <label>
        Genders <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4">
        {GENDERS.map((gender) => (
          <label
            key={gender}
            className="flex items-center gap-2 cursor-pointer capitalize"
          >
            <input
              type="checkbox"
              value={gender}
              {...register('genders', {
                required: 'Select at least one gender',
              })}
            />
            {gender}
          </label>
        ))}
      </div>
      {errors.genders && (
        <p className="text-red-500 text-xs">{errors.genders.message}</p>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCloseModal}
          disabled={isPending}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 text-sm bg-black text-white rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          {isPending ? <SpinnerMini /> : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default AddCategoryForm;
