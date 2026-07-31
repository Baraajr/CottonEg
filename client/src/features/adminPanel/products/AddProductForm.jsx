import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

import { createProduct } from '../../../services/products';
import useSubCategories from '../../../hooks/useSubCategories';
import useCategories from '../../../hooks/useCategories';
import SpinnerMini from '../../../ui/SpinnerMini';
import Button from '../../../ui/Button';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const DEFAULT_VARIANT = {
  size: 'M',
  color: { name: 'black', hex: '#000000' },
  quantity: 0,
  sku: '',
};

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-gray-100">
      <span className="text-gray-500 text-lg">{icon}</span>
      <span className="text-xs font-bold tracking-widest text-gray-700 uppercase">
        {title}
      </span>
    </div>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && (
          <span className="text-gray-400 font-normal ml-1.5 text-xs">
            required
          </span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition placeholder:text-gray-400';

const selectClass = inputClass;

export default function AddProductForm({ onCloseModal }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { variants: [DEFAULT_VARIANT] },
  });

  const selectedCategory = useWatch({
    control,
    name: 'category',
  });

  const selectedGender = useWatch({
    control,
    name: 'gender',
  });

  const queryClient = useQueryClient();

  const { categories = [] } = useCategories({ gender: selectedGender });

  const { subcategories = [] } = useSubCategories({
    gender: selectedGender,
    category: selectedCategory,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const imageCover = useWatch({
    control,
    name: 'imageCover',
  });

  const images = useWatch({
    control,
    name: 'images',
  });

  const coverPreview = imageCover?.[0]
    ? URL.createObjectURL(imageCover[0])
    : null;

  const galleryPreviews = useMemo(() => {
    if (!images) return [];

    return Array.from(images).map((file) => URL.createObjectURL(file));
  }, [images]);
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [coverPreview, galleryPreviews]);

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Product added successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      reset();
      onCloseModal?.();
    },
    onError: (err) => toast.error(err?.message || 'Failed to add product'),
  });

  function onSubmit(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('gender', data.gender);
    formData.append('price', data.price);
    if (data.priceAfterDiscount)
      formData.append('priceAfterDiscount', data.priceAfterDiscount);
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory || '');
    formData.append('material', data.material || '');
    formData.append('fit', data.fit || '');
    formData.append('variants', JSON.stringify(data.variants));
    if (data.imageCover?.[0]) formData.append('imageCover', data.imageCover[0]);
    if (data.images?.length) {
      Array.from(data.images).forEach((img) => formData.append('images', img));
    }
    mutate(formData);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 py-1"
    >
      {/* ── Basic info ── */}
      <section>
        <SectionHeader icon="📋" title="Basic info" />
        <div className="flex flex-col gap-4">
          <Field label="Product name" required error={errors.name?.message}>
            <input
              {...register('name', { required: 'Product name is required' })}
              placeholder="e.g. Classic Crewneck Tee"
              className={inputClass}
            />
          </Field>

          <Field
            label="Description"
            required
            error={errors.description?.message}
          >
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              })}
              rows={3}
              placeholder="Describe the product — materials, fit, and styling notes..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Gender" required error={errors.gender?.message}>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className={selectClass}
            >
              <option value="">Select gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required error={errors.category?.message}>
              <select
                disabled={!selectedGender}
                {...register('category', { required: 'Category is required' })}
                className={selectClass}
              >
                {!selectedGender ? (
                  <option value="">Select a gender first</option>
                ) : (
                  <>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Field>

            <Field label="Subcategory">
              <select
                {...register('subcategory')}
                className={selectClass}
                disabled={!selectedCategory}
              >
                {!selectedCategory ? (
                  <option value="">Select a category first</option>
                ) : (
                  <>
                    <option value="">Select subcategory</option>
                    {subcategories.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Material">
              <input
                {...register('material')}
                placeholder="e.g. 100% cotton"
                className={inputClass}
              />
            </Field>

            <Field label="Fit">
              <select {...register('fit')} className={selectClass}>
                <option value="">Select fit</option>
                {['Slim', 'Regular', 'Relaxed', 'Oversized', 'Skinny'].map(
                  (f) => (
                    <option key={f} value={f.toLowerCase()}>
                      {f}
                    </option>
                  ),
                )}
              </select>
            </Field>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section>
        <SectionHeader icon="💲" title="Pricing" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price" required error={errors.price?.message}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
                placeholder="0.00"
                className={`${inputClass} pl-7`}
              />
            </div>
          </Field>

          <Field label="Sale price" hint="Leave blank if no discount applies">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('priceAfterDiscount')}
                placeholder="0.00"
                className={`${inputClass} pl-7`}
              />
            </div>
          </Field>
        </div>
      </section>

      {/* ── Images ── */}
      <section>
        <SectionHeader icon="🖼" title="Images" />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Cover image"
            required
            error={errors.imageCover?.message}
          >
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-xs font-medium text-gray-500">
                Click to upload
              </span>
              <span className="text-xs text-gray-400">JPG, PNG or WEBP</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('imageCover', {
                  required: 'Cover image is required',
                })}
              />
            </label>
          </Field>

          {coverPreview && (
            <div className="mt-3">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
            </div>
          )}

          <Field label="Gallery images">
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="text-xs font-medium text-gray-500">
                Click to upload
              </span>
              <span className="text-xs text-gray-400">
                Multiple files allowed
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                {...register('images')}
              />
            </label>
          </Field>
          {galleryPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {galleryPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-full h-24 object-cover rounded-lg border"
                  alt={`preview-${i}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Variants ── */}
      <section>
        <SectionHeader icon="◼" title="Variants" />
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-4"
            >
              {/* Variant header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1">
                  Variant {index + 1}
                </span>
                {fields.length > 1 && (
                  <Button
                    variant="textDanger"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Size">
                  <select
                    {...register(`variants.${index}.size`)}
                    className={selectClass}
                  >
                    {SIZES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Stock qty">
                  <input
                    type="number"
                    min="0"
                    {...register(`variants.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className={inputClass}
                  />
                </Field>

                <Field label="SKU">
                  <input
                    {...register(`variants.${index}.sku`)}
                    placeholder="SKU-001"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Field label="Color name">
                    <input
                      {...register(`variants.${index}.color.name`)}
                      placeholder="e.g. Midnight Black"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Color
                  </label>
                  <input
                    type="color"
                    {...register(`variants.${index}.color.hex`)}
                    className="w-11 h-10.5 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" onClick={() => append(DEFAULT_VARIANT)}>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add variant
          </Button>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 border-t-2 border-gray-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCloseModal}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" loading={isPending}>
          Create Product
        </Button>
      </div>
    </form>
  );
}
