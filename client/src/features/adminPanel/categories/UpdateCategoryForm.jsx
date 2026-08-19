import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateCategory } from '../../../services/category';
import SpinnerMini from '../../../ui/SpinnerMini';
import { GENDERS } from '../../../constants/constants';
import Button from '../../../ui/Button';

function UpdateCategoryForm({ category, onCloseModal }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: category.name,
      genders: category.genders,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onCloseModal?.();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update category');
    },
  });

  function onSubmit(data) {
    mutate({ id: category._id, name: data.name, genders: data.genders });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label>Category name</label>
      <input
        {...register('name', { required: 'Category name is required' })}
        className="input"
      />
      {errors.name && (
        <p className="text-xs text-red-500">{errors.name.message}</p>
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
        <p className="text-xs text-red-500">{errors.genders.message}</p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCloseModal}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={isPending}
          disabled={!isDirty || isPending}
        >
          Update
        </Button>
      </div>
    </form>
  );
}

export default UpdateCategoryForm;
