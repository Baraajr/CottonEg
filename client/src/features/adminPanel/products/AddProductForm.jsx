import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  FaTrash,
  FaPlus,
  FaUpload,
  FaImage,
  FaBox,
  FaTag,
  FaInfoCircle,
} from 'react-icons/fa';

import { createProduct } from '../../../services/products';
import useSubCategories from '../../../hooks/useSubCategories';
import useCategories from '../../../hooks/useCategories';
import Button from '../../../ui/Button';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const DEFAULT_VARIANT = {
  size: 'M',
  color: { name: 'Black', hex: '#000000' },
  quantity: 0,
  sku: '',
};

const inputClass = `
  w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-gray-900
  outline-none transition placeholder:text-gray-400
  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
  disabled:cursor-not-allowed disabled:bg-gray-50
`;

function getInputClass(error) {
  return `${inputClass} ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-gray-200'
  }`;
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3 border-b border-gray-200 pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <FaInfoCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function validateImage(file) {
  if (!file) return 'Please select an image';

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, and WEBP images are allowed';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be smaller than 5 MB';
  }

  return true;
}

function ImageUpload({ label, error, preview, multiple, ...props }) {
  return (
    <Field
      label={label}
      required={!multiple}
      error={error}
      hint={
        multiple
          ? 'You can select multiple images'
          : 'JPG, PNG or WEBP · Max 5 MB'
      }
    >
      <label
        className={`
          group relative flex min-h-36 cursor-pointer flex-col items-center
          justify-center overflow-hidden rounded-xl border-2 border-dashed
          transition
          ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-hover:bg-gray-200">
              {multiple ? (
                <FaImage className="h-4 w-4" />
              ) : (
                <FaUpload className="h-4 w-4" />
              )}
            </div>

            <span className="text-xs font-semibold text-gray-700">
              Click to upload
            </span>

            <span className="mt-1 text-xs text-gray-400">
              {multiple ? 'Choose gallery images' : 'Upload cover image'}
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="sr-only"
          {...props}
        />
      </label>
    </Field>
  );
}

export default function AddProductForm({ onCloseModal }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      gender: '',
      category: '',
      subcategory: '',
      material: '',
      fit: '',
      price: '',
      priceAfterDiscount: '',
      imageCover: null,
      images: [],
      variants: [DEFAULT_VARIANT],
    },
  });

  const queryClient = useQueryClient();

  const selectedCategory = useWatch({ control, name: 'category' });
  const selectedGender = useWatch({ control, name: 'gender' });
  const imageCover = useWatch({ control, name: 'imageCover' });
  const images = useWatch({ control, name: 'images' });

  const { categories = [] } = useCategories({
    gender: selectedGender,
  });

  const { subcategories = [] } = useSubCategories({
    gender: selectedGender,
    category: selectedCategory,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  // Reset dependent fields when their parent changes.
  useEffect(() => {
    setValue('category', '');
    setValue('subcategory', '');
  }, [selectedGender, setValue]);

  useEffect(() => {
    setValue('subcategory', '');
  }, [selectedCategory, setValue]);

  // Image previews.
  const coverPreview = useMemo(() => {
    const file = imageCover?.[0];
    return file ? URL.createObjectURL(file) : null;
  }, [imageCover]);

  const galleryPreviews = useMemo(() => {
    if (!images?.length) return [];

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

    onError: (err) => {
      toast.error(err?.message || 'Failed to add product');
    },
  });

  function onSubmit(data) {
    const formData = new FormData();

    formData.append('name', data.name.trim());
    formData.append('description', data.description.trim());
    formData.append('gender', data.gender);
    formData.append('price', data.price);

    if (data.priceAfterDiscount) {
      formData.append('priceAfterDiscount', data.priceAfterDiscount);
    }

    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory || '');
    formData.append('material', data.material?.trim() || '');
    formData.append('fit', data.fit || '');
    formData.append('variants', JSON.stringify(data.variants));

    if (data.imageCover?.[0]) {
      formData.append('imageCover', data.imageCover[0]);
    }

    if (data.images?.length) {
      Array.from(data.images).forEach((img) => {
        formData.append('images', img);
      });
    }

    mutate(formData);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-9 pb-2"
    >
      {/* Basic information */}
      <section>
        <SectionHeader
          icon={FaInfoCircle}
          title="Product information"
          description="Add the essential details of your product."
        />

        <div className="flex flex-col gap-5">
          <Field label="Product name" required error={errors.name?.message}>
            <input
              {...register('name', {
                required: 'Product name is required',
                validate: (value) =>
                  value.trim().length >= 3 ||
                  'Name must be at least 3 characters',
                maxLength: {
                  value: 100,
                  message: 'Name cannot exceed 100 characters',
                },
              })}
              placeholder="e.g. Classic Crewneck Tee"
              className={getInputClass(errors.name)}
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
                validate: (value) =>
                  value.trim().length >= 10 ||
                  'Description must be at least 10 characters',
                maxLength: {
                  value: 2000,
                  message: 'Description cannot exceed 2000 characters',
                },
              })}
              rows={4}
              placeholder="Describe the product, its materials, fit, and styling..."
              className={`${getInputClass(errors.description)} resize-y`}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Gender" required error={errors.gender?.message}>
              <select
                {...register('gender', {
                  required: 'Please select a gender',
                })}
                className={getInputClass(errors.gender)}
              >
                <option value="">Select gender</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </Field>

            <Field label="Category" required error={errors.category?.message}>
              <select
                disabled={!selectedGender}
                {...register('category', {
                  required: 'Please select a category',
                })}
                className={getInputClass(errors.category)}
              >
                <option value="">
                  {selectedGender ? 'Select category' : 'Select gender first'}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Subcategory" error={errors.subcategory?.message}>
              <select
                disabled={!selectedCategory}
                {...register('subcategory')}
                className={getInputClass(errors.subcategory)}
              >
                <option value="">
                  {selectedCategory
                    ? 'Select subcategory'
                    : 'Select category first'}
                </option>

                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fit">
              <select {...register('fit')} className={inputClass}>
                <option value="">Select fit</option>
                {['Slim', 'Regular', 'Relaxed', 'Oversized', 'Skinny'].map(
                  (fit) => (
                    <option key={fit} value={fit.toLowerCase()}>
                      {fit}
                    </option>
                  ),
                )}
              </select>
            </Field>
          </div>

          <Field label="Material" error={errors.material?.message}>
            <input
              {...register('material', {
                maxLength: {
                  value: 100,
                  message: 'Material cannot exceed 100 characters',
                },
              })}
              placeholder="e.g. 100% cotton"
              className={getInputClass(errors.material)}
            />
          </Field>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <SectionHeader
          icon={FaTag}
          title="Pricing"
          description="Set the regular price and optional sale price."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Regular price" required error={errors.price?.message}>
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value > 0) ||
                    'Price must be greater than zero',
                })}
                placeholder="0.00"
                className={`${getInputClass(errors.price)} pr-14`}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                EGP
              </span>
            </div>
          </Field>

          <Field
            label="Sale price"
            hint="Optional. Must be lower than the regular price."
            error={errors.priceAfterDiscount?.message}
          >
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="0.01"
                {...register('priceAfterDiscount', {
                  setValueAs: (value) => (value === '' ? '' : Number(value)),
                  validate: (value) => {
                    if (value === '') return true;

                    if (!Number.isFinite(value) || value <= 0) {
                      return 'Sale price must be greater than zero';
                    }

                    if (Number(value) >= Number(getValues('price'))) {
                      return 'Sale price must be lower than regular price';
                    }

                    return true;
                  },
                })}
                onBlur={() => trigger('priceAfterDiscount')}
                placeholder="0.00"
                className={`${getInputClass(errors.priceAfterDiscount)} pr-14`}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                EGP
              </span>
            </div>
          </Field>
        </div>
      </section>

      {/* Images */}
      <section>
        <SectionHeader
          icon={FaImage}
          title="Product images"
          description="Upload a cover image and additional gallery images."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <ImageUpload
              label="Cover image"
              preview={coverPreview}
              error={errors.imageCover?.message}
              {...register('imageCover', {
                required: 'Cover image is required',
                validate: (files) => {
                  if (!files?.length) return 'Cover image is required';
                  return validateImage(files[0]);
                },
              })}
            />
          </div>

          <div className="flex flex-col gap-3">
            <ImageUpload
              label="Gallery images"
              multiple
              {...register('images', {
                validate: (files) => {
                  if (!files?.length) return true;

                  for (const file of Array.from(files)) {
                    const result = validateImage(file);
                    if (result !== true) return result;
                  }

                  return true;
                },
              })}
              error={errors.images?.message}
            />
          </div>
        </div>

        {galleryPreviews.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Gallery preview ({galleryPreviews.length})
            </p>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryPreviews.map((src, index) => (
                <div
                  key={src}
                  className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  <img
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Variants */}
      <section>
        <SectionHeader
          icon={FaBox}
          title="Product variants"
          description="Define available sizes, colors, and stock quantities."
        />

        <div className="flex flex-col gap-4">
          {errors.variants?.root?.message && (
            <p className="text-xs font-medium text-red-500">
              {errors.variants.root.message}
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Variant {String(index + 1).padStart(2, '0')}
                </span>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <FaTrash className="h-3 w-3" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                  label="Size"
                  required
                  error={errors.variants?.[index]?.size?.message}
                >
                  <select
                    {...register(`variants.${index}.size`, {
                      required: 'Size is required',
                    })}
                    className={getInputClass(errors.variants?.[index]?.size)}
                  >
                    {SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Stock quantity"
                  required
                  error={errors.variants?.[index]?.quantity?.message}
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    {...register(`variants.${index}.quantity`, {
                      required: 'Quantity is required',
                      valueAsNumber: true,
                      validate: (value) =>
                        (Number.isInteger(value) && value >= 0) ||
                        'Quantity must be a non-negative whole number',
                    })}
                    className={getInputClass(
                      errors.variants?.[index]?.quantity,
                    )}
                  />
                </Field>

                <Field
                  label="SKU"
                  required
                  error={errors.variants?.[index]?.sku?.message}
                >
                  <input
                    {...register(`variants.${index}.sku`, {
                      required: 'SKU is required',
                      validate: (value) =>
                        value.trim().length > 0 || 'SKU cannot be empty',
                    })}
                    placeholder="SKU-001"
                    className={getInputClass(errors.variants?.[index]?.sku)}
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
                <Field
                  label="Color name"
                  required
                  error={errors.variants?.[index]?.color?.name?.message}
                >
                  <input
                    {...register(`variants.${index}.color.name`, {
                      required: 'Color name is required',
                      validate: (value) =>
                        value.trim().length > 0 || 'Color name cannot be empty',
                    })}
                    placeholder="e.g. Midnight Black"
                    className={getInputClass(
                      errors.variants?.[index]?.color?.name,
                    )}
                  />
                </Field>

                <Field
                  label="Color"
                  required
                  error={errors.variants?.[index]?.color?.hex?.message}
                >
                  <input
                    type="color"
                    {...register(`variants.${index}.color.hex`, {
                      required: 'Color is required',
                      pattern: {
                        value: /^#[0-9A-Fa-f]{6}$/,
                        message: 'Invalid color',
                      },
                    })}
                    className="h-11 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({
                ...DEFAULT_VARIANT,
                color: { ...DEFAULT_VARIANT.color },
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 transition hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900"
          >
            <FaPlus className="h-3 w-3" />
            Add another variant
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-5 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:-mx-6 sm:flex-row sm:justify-end sm:px-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCloseModal}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" loading={isPending} disabled={isPending}>
          Create product
        </Button>
      </div>
    </form>
  );
}
