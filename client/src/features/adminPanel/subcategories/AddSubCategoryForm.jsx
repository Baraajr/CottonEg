import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createSubCategory } from '../../../services/subcategories';
import SpinnerMini from '../../../ui/SpinnerMini';
import { GENDERS } from '../../../constants/constants';

function AddSubCategoryForm({ categories = [], onCloseModal }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => {
      toast.success('SubCategory created');
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      onCloseModal?.();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to create subcategory');
    },
  });

  function onSubmit(data) {
    mutate({
      name: data.name,
      categoryId: data.categoryId,
      genders: data.genders,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label>
        Subcategory Name <span className="text-red-500">*</span>
      </label>
      <input
        {...register('name', { required: 'Name is required' })}
        className="input"
      />
      {errors.name && (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      )}

      <label>
        Category <span className="text-red-500">*</span>{' '}
      </label>
      <select
        {...register('categoryId', { required: 'Select a category' })}
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
        <p className="text-red-500 text-xs">{errors.category.message}</p>
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
          className="px-4 py-2 text-sm border rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 text-sm bg-black text-white rounded-lg"
        >
          {isPending ? <SpinnerMini /> : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default AddSubCategoryForm;
