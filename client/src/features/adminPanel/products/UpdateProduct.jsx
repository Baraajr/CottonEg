import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import {
  getProduct,
  deleteVariant,
  deleteImage,
  updateProduct,
} from '../../../services/products';

import Modal from '../../../ui/Modal';
import toast from 'react-hot-toast';

import AddImageForm from './AddImageForm';
import AddVariantForm from './AddVariantForm';
import EditVariantForm from './EditVariantForm';
import ConfirmDelete from '../../../ui/ConfirmDelete';
import useCategories from '../../../hooks/useCategories';
import useSubCategories from '../../../hooks/useSubCategories';
import Spinner from '../../../ui/Spinner';

// ─── Field components ─────────────────────────────────────────────────────────
function FieldRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

// ─── Main ─────────────────────────────────────────────────────────────────────
function UpdateProduct() {
  const { categories = [] } = useCategories();
  const { subcategories = [] } = useSubCategories();

  const { productId } = useParams();
  const queryClient = useQueryClient();
  const coverInputRef = useRef(null);

  // local form state
  const [fields, setFields] = useState(null); // null = not yet initialised
  const [coverPreview, setCoverPreview] = useState(null); // new cover preview url
  const [coverFile, setCoverFile] = useState(null); // new cover File object

  // ── FETCH PRODUCT ──
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    onSuccess: (res) => {
      const p = res?.data || {};
      // Initialise form fields from product only once
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

  // Keep fields in sync with first load
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
      // Send as FormData so multer can handle imageCover
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
      // No new cover → send plain JSON
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
      <div className="p-6 text-red-600 text-sm">Failed to load product</div>
    );
  }

  const SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all-season'];
  const FITS = ['slim', 'regular', 'relaxed', 'oversized', 'skinny'];

  return (
    <Modal>
      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Editing
            </p>
            <h1 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                product.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
            {product.featured && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
                Featured
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* ── SECTION: Cover Image ── */}
          <section>
            <SectionTitle>Cover Image</SectionTitle>

            <div className="flex items-start gap-5">
              {/* Current / preview */}
              <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                <img
                  src={coverPreview || product.imageCover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {coverPreview && (
                  <span className="absolute top-1 left-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">
                    New
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 justify-center pt-2">
                <p className="text-sm text-gray-500">
                  {coverPreview
                    ? 'New cover selected — will be uploaded on save.'
                    : 'Replace the current cover image.'}
                </p>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="self-start px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {coverPreview ? 'Change again' : 'Choose new cover'}
                </button>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                    className="self-start text-xs text-red-500 hover:underline"
                  >
                    Discard new cover
                  </button>
                )}
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

          {/* ── SECTION: Basic Info ── */}
          <section className="flex flex-col gap-4">
            <SectionTitle>Basic Info</SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    rows={3}
                    className={inputCls + ' resize-none'}
                    required
                    minLength={10}
                  />
                </FieldRow>

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
              </div>

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
                      subcategory: '', // reset when category changes
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

          {/* ── SECTION: Season ── */}
          <section>
            <SectionTitle>Season</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSeasonToggle(s)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition ${
                    fields.season.includes(s)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* ── SECTION: Flags ── */}
          <section>
            <SectionTitle>Visibility & Flags</SectionTitle>
            <div className="flex gap-6">
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

          {/* ── SAVE BUTTON ── */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
            >
              {isUpdating
                ? 'Saving…'
                : coverFile
                  ? 'Save with new cover'
                  : 'Save changes'}
            </button>
          </div>
        </form>

        {/* ── SECTION: Gallery Images ── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <SectionTitle noMargin>Gallery Images</SectionTitle>
            <Modal.Open opens="add-image">
              <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 transition">
                + Add image
              </button>
            </Modal.Open>
          </div>

          <Modal.Window name="add-image">
            <AddImageForm productId={productId} />
          </Modal.Window>

          {images.length === 0 ? (
            <p className="text-sm text-gray-400">No gallery images yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square"
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <Modal.Open opens={`del-img-${img._id}`}>
                    <button className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                      ✕
                    </button>
                  </Modal.Open>
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

        {/* ── SECTION: Variants ── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <SectionTitle noMargin>Variants</SectionTitle>
            <Modal.Open opens="add-variant">
              <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 transition">
                + Add variant
              </button>
            </Modal.Open>
          </div>

          <Modal.Window name="add-variant">
            <AddVariantForm productId={productId} />
          </Modal.Window>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">No variants yet.</p>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Size
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Color
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Qty
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      SKU
                    </th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2.5 font-medium">{v.size}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                            style={{ backgroundColor: v.color?.hex }}
                          />
                          <span>{v.color?.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">{v.quantity}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-gray-500">
                        {v.sku || '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-2">
                          <Modal.Open opens={`edit-${v._id}`}>
                            <button className="text-xs px-2.5 py-1 border rounded-lg hover:bg-gray-100 transition">
                              Edit
                            </button>
                          </Modal.Open>

                          <Modal.Window name={`edit-${v._id}`}>
                            <EditVariantForm
                              productId={productId}
                              variant={v}
                            />
                          </Modal.Window>

                          <Modal.Open opens={`del-variant-${v._id}`}>
                            <button className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
                              Delete
                            </button>
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
      className={`text-xs font-semibold uppercase tracking-widest text-gray-400 ${
        noMargin ? '' : 'mb-4'
      }`}
    >
      {children}
    </h2>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export default UpdateProduct;
