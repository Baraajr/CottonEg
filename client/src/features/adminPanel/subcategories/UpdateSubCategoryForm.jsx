import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateSubCategory } from '../../../services/subCategories';
import { GENDERS } from '../../../constants/constants';
import Button from '../../../ui/Button';

function UpdateSubCategoryForm({ subcategory, categories = [], onCloseModal }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: subcategory.name,
      category: subcategory.category?._id,
      genders: subcategory.genders,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateSubCategory,
    onSuccess: () => {
      toast.success('Subcategory updated successfully');
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      onCloseModal?.();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update subcategory');
    },
  });

  function onSubmit(data) {
    mutate({
      id: subcategory._id,
      name: data.name,
      category: data.category,
      genders: data.genders,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label>Subcategory name</label>
      <input
        {...register('name', { required: 'Subcategory name is required' })}
        className="input"
      />
      {errors.name && (
        <p className="text-xs text-red-500">{errors.name.message}</p>
      )}

      <label>Category</label>
      <select
        {...register('category', { required: 'Select a category' })}
        className="input"
      >
        <option value="">Select category</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {errors.category && (
        <p className="text-xs text-red-500">{errors.category.message}</p>
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

        <Button type="submit" loading={isPending} disabled={!isDirty}>
          Update
        </Button>
      </div>
    </form>
  );
}

export default UpdateSubCategoryForm;
