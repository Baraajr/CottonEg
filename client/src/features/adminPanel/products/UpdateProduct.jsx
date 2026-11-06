import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import {
  getProduct,
  deleteVariant,
  deleteImage,
  updateProduct,
} from '../../../services/products';

import Modal from '../../../ui/Modal';

import AddImageForm from './AddImageForm';
import AddVariantForm from './AddVariantForm';
import EditVariantForm from './EditVariantForm';
import ConfirmDelete from '../../../ui/ConfirmDelete';
import useCategories from '../../../hooks/useCategories';
import useSubCategories from '../../../hooks/useSubCategories';
import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button';
import IconButton from '../../../ui/IconButton';

// ─── Field components ─────────────────────────────────────────────────────────
function FieldRow({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50';

// ─── Main ─────────────────────────────────────────────────────────────────────
function UpdateProduct() {
  const { categories = [] } = useCategories();
  const { subcategories = [] } = useSubCategories();

  const { productId } = useParams();
  const queryClient = useQueryClient();
  const coverInputRef = useRef(null);

  // local form state
  const [fields, setFields] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // ── FETCH PRODUCT ──
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    onSuccess: (res) => {
      const p = res?.data || {};
      setFields((prev) =>
        prev
          ? prev
          : {
              name: p.name || '',
              description: p.description || '',
              gender: p.gender || '',
              price: p.price ?? '',
              priceAfterDiscount: p.priceAfterDiscount ?? '',
              material: p.material || '',
              fit: p.fit || '',
              season: p.season || [],
              tags: (p.tags || []).join(', '),
              featured: p.featured ?? false,
              isActive: p.isActive ?? true,
              category: p.category?._id || p.category || '',
              subcategory: p.subcategory?._id || p.subcategory || '',
            },
      );
    },
  });

  const product = data?.data || {};
  const images = product.images || [];
  const variants = product.variants || [];

  const initFields = () => {
    if (fields) return;
    setFields({
      name: product.name || '',
      description: product.description || '',
      gender: product.gender || '',
      price: product.price ?? '',
      priceAfterDiscount: product.priceAfterDiscount ?? '',
      material: product.material || '',
      fit: product.fit || '',
      season: product.season || [],
      tags: (product.tags || []).join(', '),
      featured: product.featured ?? false,
      isActive: product.isActive ?? true,
      category: product.category?._id || product.category || '',
      subcategory: product.subcategory?._id || product.subcategory || '',
    });
  };

  if (!isLoading && !fields) initFields();

  // ── MUTATION: UPDATE PRODUCT FIELDS ──
  const { mutate: runUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (payload) => updateProduct({ id: productId, data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setCoverFile(null);
      setCoverPreview(null);
      toast.success('Product updated');
    },
    onError: (err) => toast.error(err?.message || 'Update failed'),
  });

  // ── MUTATION: DELETE VARIANT ──
  const { mutate: runDeleteVariant } = useMutation({
    mutationFn: (variantId) => deleteVariant({ id: productId, variantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success('Variant deleted');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete variant'),
  });

  // ── MUTATION: DELETE IMAGE ──
  const { mutate: runDeleteImage } = useMutation({
    mutationFn: (imageId) => deleteImage({ id: productId, imageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success('Image deleted');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete image'),
  });

  // ── FIELD CHANGE ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSeasonToggle = (s) => {
    setFields((prev) => ({
      ...prev,
      season: prev.season.includes(s)
        ? prev.season.filter((x) => x !== s)
        : [...prev.season, s],
    }));
  };

  // ── COVER CHANGE ──
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // ── SUBMIT ──
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields) return;

    const tagsArray = fields.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (coverFile) {
      const fd = new FormData();
      fd.append('imageCover', coverFile);
      fd.append('name', fields.name);
      fd.append('description', fields.description);
      fd.append('gender', fields.gender);
      fd.append('price', fields.price);
      if (fields.priceAfterDiscount !== '')
        fd.append('priceAfterDiscount', fields.priceAfterDiscount);
      fd.append('material', fields.material);
      fd.append('fit', fields.fit);
      fields.season.forEach((s) => fd.append('season', s));
      tagsArray.forEach((t) => fd.append('tags', t));
      fd.append('featured', fields.featured);
      fd.append('isActive', fields.isActive);
      fd.append('category', fields.category);
      fd.append('subcategory', fields.subcategory);
      runUpdate(fd);
    } else {
      runUpdate({
        name: fields.name,
        description: fields.description,
        gender: fields.gender,
        price: Number(fields.price),
        ...(fields.priceAfterDiscount !== '' && {
          priceAfterDiscount: Number(fields.priceAfterDiscount),
        }),
        material: fields.material,
        fit: fields.fit,
        season: fields.season,
        tags: tagsArray,
        featured: fields.featured,
        isActive: fields.isActive,
        category: fields.category,
        subcategory: fields.subcategory,
      });
    }
  };

  // ── LOADING / ERROR ──
  if (isLoading || !fields) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Failed to load product
      </div>
    );
  }

  const SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all-season'];
  const FITS = ['slim', 'regular', 'relaxed', 'oversized', 'skinny'];

  return (
    <Modal>
      <div className=" flex max-w-4xl flex-col gap-10 ">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product management / Editing
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                product.isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-accent text-muted-foreground'
              }`}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </span>

            {product.featured && (
              <span className="rounded-md border border-border bg-accent px-3 py-1.5 text-xs font-medium text-foreground">
                Featured
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* COVER IMAGE */}
          <section>
            <SectionTitle>Cover Image</SectionTitle>

            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                <img
                  src={coverPreview || product.imageCover}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />

                {coverPreview && (
                  <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                    New
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-center gap-3">
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {coverPreview
                    ? 'New cover selected — it will be uploaded when you save your changes.'
                    : 'Choose a new cover image to replace the current product image.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {coverPreview ? 'Change again' : 'Choose new cover'}
                  </Button>

                  {coverPreview && (
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                    >
                      Discard
                    </Button>
                  )}
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </div>
            </div>
          </section>

          {/* BASIC INFO */}
          <section className="flex flex-col gap-5">
            <SectionTitle>Basic Information</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldRow label="Name">
                  <input
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    className={inputCls}
                    required
                    minLength={3}
                    maxLength={60}
                  />
                </FieldRow>
              </div>

              <div className="sm:col-span-2">
                <FieldRow label="Description">
                  <textarea
                    name="description"
                    value={fields.description}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputCls} resize-none`}
                    required
                    minLength={10}
                  />
                </FieldRow>
              </div>

              <FieldRow label="Gender">
                <select
                  name="gender"
                  value={fields.gender}
                  onChange={handleChange}
                  className={inputCls}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </FieldRow>

              <FieldRow label="Price (EGP)">
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={fields.price}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </FieldRow>

              <FieldRow label="Price After Discount">
                <input
                  name="priceAfterDiscount"
                  type="number"
                  min="0"
                  value={fields.priceAfterDiscount}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Leave empty if none"
                />
              </FieldRow>

              <FieldRow label="Material">
                <input
                  name="material"
                  value={fields.material}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. 100% Cotton"
                />
              </FieldRow>

              <FieldRow label="Fit">
                <select
                  name="fit"
                  value={fields.fit}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">— Select fit —</option>
                  {FITS.map((f) => (
                    <option key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
              </FieldRow>

              <FieldRow label="Category">
                <select
                  name="category"
                  value={fields.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFields((p) => ({
                      ...p,
                      category: value,
                      subcategory: '',
                    }));
                  }}
                  className={inputCls}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FieldRow>

              <FieldRow label="Subcategory">
                <select
                  name="subcategory"
                  value={fields.subcategory}
                  onChange={handleChange}
                  className={inputCls}
                  required
                  disabled={!fields.category}
                >
                  <option value="">Select subcategory</option>

                  {subcategories
                    .filter((s) =>
                      typeof s.category === 'object'
                        ? s.category._id === fields.category
                        : s.category === fields.category,
                    )
                    .map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </FieldRow>

              <div className="sm:col-span-2">
                <FieldRow label="Tags (comma-separated)">
                  <input
                    name="tags"
                    value={fields.tags}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g. sale, new, trending"
                  />
                </FieldRow>
              </div>
            </div>
          </section>

          {/* SEASON */}
          <section>
            <SectionTitle>Season</SectionTitle>

            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="secondary"
                  active={fields.season.includes(s)}
                  activeClassName="!bg-primary !border-primary !text-primary-foreground"
                  onClick={() => handleSeasonToggle(s)}
                  className="rounded-full"
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </section>

          {/* FLAGS */}
          <section>
            <SectionTitle>Visibility & Flags</SectionTitle>

            <div className="flex flex-wrap gap-8">
              <Toggle
                label="Active"
                checked={fields.isActive}
                onChange={(v) => setFields((p) => ({ ...p, isActive: v }))}
              />

              <Toggle
                label="Featured"
                checked={fields.featured}
                onChange={(v) => setFields((p) => ({ ...p, featured: v }))}
              />
            </div>
          </section>

          {/* SAVE */}
          <div className="flex justify-end border-t border-border pt-6">
            <Button type="submit" loading={isUpdating}>
              {coverFile ? 'Save with new cover' : 'Save changes'}
            </Button>
          </div>
        </form>

        {/* GALLERY IMAGES */}
        <section className="border-t border-border pt-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <SectionTitle noMargin>Gallery Images</SectionTitle>

            <Modal.Open opens="add-image">
              <Button variant="secondary">
                <FaPlus className="h-3.5 w-3.5" />
                Add image
              </Button>
            </Modal.Open>
          </div>

          <Modal.Window name="add-image">
            <AddImageForm productId={productId} />
          </Modal.Window>

          {images.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No gallery images yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <img
                    src={img.url}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    alt=""
                  />

                  <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-2 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
                    <Modal.Open opens={`del-img-${img._id}`}>
                      <div>
                        <IconButton variant="danger" size="sm">
                          ✕
                        </IconButton>
                      </div>
                    </Modal.Open>
                  </div>

                  <Modal.Window name={`del-img-${img._id}`}>
                    <ConfirmDelete
                      resourceName="image"
                      onConfirm={() => runDeleteImage(img._id)}
                    />
                  </Modal.Window>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VARIANTS */}
        <section className="border-t border-border pt-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <SectionTitle noMargin>Variants</SectionTitle>

            <Modal.Open opens="add-variant">
              <Button variant="secondary">
                <FaPlus className="h-3.5 w-3.5" />
                Add variant
              </Button>
            </Modal.Open>
          </div>

          <Modal.Window name="add-variant">
            <AddVariantForm productId={productId} />
          </Modal.Window>

          {variants.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No variants yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {variants.map((v) => (
                    <tr
                      key={v._id}
                      className="transition-colors hover:bg-accent/50"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {v.size}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border border-border"
                            style={{ backgroundColor: v.color?.hex }}
                          />
                          <span className="text-foreground">
                            {v.color?.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-foreground">
                        {v.quantity}
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {v.sku || '—'}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Modal.Open opens={`edit-${v._id}`}>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </Modal.Open>

                          <Modal.Window name={`edit-${v._id}`}>
                            <EditVariantForm
                              productId={productId}
                              variant={v}
                            />
                          </Modal.Window>

                          <Modal.Open opens={`del-variant-${v._id}`}>
                            <Button size="sm" variant="dangerOutline">
                              Delete
                            </Button>
                          </Modal.Open>

                          <Modal.Window name={`del-variant-${v._id}`}>
                            <ConfirmDelete
                              resourceName="variant"
                              onConfirm={() => runDeleteVariant(v._id)}
                            />
                          </Modal.Window>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function SectionTitle({ children, noMargin }) {
  return (
    <h2
      className={`text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground ${
        noMargin ? '' : 'mb-5'
      }`}
    >
      {children}
    </h2>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-10 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>

      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

export default UpdateProduct;
