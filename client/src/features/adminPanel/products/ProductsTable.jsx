import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiXMark } from 'react-icons/hi2';
import { IoIosSearch } from 'react-icons/io';

import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Spinner from '../../../ui/Spinner';
import ConfirmDelete from '../../../ui/ConfirmDelete';

import AddProductForm from './AddProductForm';
import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';

import { deleteProduct, getFilteredProducts } from '../../../services/products';
import useCategories from '../../../hooks/useCategories';
import useSubCategories from '../../../hooks/useSubCategories';
import useDebounce from '../../../hooks/useDebounce';

import Pagination from '../../Products/pagination';
import { GENDERS } from '../../../constants/constants';

function ProductsTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [featured, setFeatured] = useState('all');
  const [stock, setStock] = useState('all');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [gender, setGender] = useState('all');
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [sort, setSort] = useState('createdAt-desc');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const selectedGender = gender === 'all' ? '' : gender;
  const selectedCategory = category === 'all' ? '' : category;

  const { categories = [] } = useCategories({
    gender: selectedGender,
  });

  const { subcategories = [] } = useSubCategories({
    gender: selectedGender,
    category: selectedCategory,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      'products',
      gender,
      category,
      subcategory,
      sort,
      featured,
      stock,
      page,
      debouncedSearch,
    ],
    queryFn: () =>
      getFilteredProducts({
        gender,
        category,
        subcategory,
        featured,
        stock,
        sort,
        page,
        search: debouncedSearch,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  });

  const { mutate: removeProduct } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err?.message || 'Delete failed');
      setDeletingId(null);
    },
  });

  function handleDelete(id) {
    setDeletingId(id);
    removeProduct(id);
  }

  const products = data?.data ?? [];
  const numberOfPages = data?.paginationResult?.numberOfPages || 1;
  const isEmpty = !isLoading && products.length === 0;

  const selectClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary';

  const labelClass =
    'mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground';

  return (
    <Modal>
      <AdminPageLayout
        title="Products"
        headerActions={
          <>
            <Modal.Open opens="add-product">
              <Button variant="primary">Add Product</Button>
            </Modal.Open>

            <Modal.Window name="add-product">
              <AddProductForm />
            </Modal.Window>
          </>
        }
        tableActions={
          <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition focus-within:border-primary">
              <IoIosSearch className="h-5 w-5 shrink-0 text-muted-foreground" />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products by name..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="Clear search"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sort and filters */}
            <div className="flex gap-3">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className={`${selectClass} min-w-0 flex-1`}
              >
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="price-asc">Price (Low → High)</option>
                <option value="price-desc">Price (High → Low)</option>
                <option value="quantity-asc">Stock (Low → High)</option>
                <option value="quantity-desc">Stock (High → Low)</option>
                <option value="sold-desc">Best Selling</option>
                <option value="ratingsAverage-desc">Top Rated</option>
              </select>

              <Button
                variant="secondary"
                className="w-auto shrink-0 px-5"
                onClick={() => setShowFilters(true)}
              >
                Filters
              </Button>
            </div>
          </div>
        }
      >
        {/* Filter overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Filter drawer */}
        {showFilters && (
          <aside className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-sm flex-col border-l border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Catalog
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                aria-label="Close filters"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">All genders</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Subcategory</label>
                <select
                  value={subcategory}
                  onChange={(e) => {
                    setSubcategory(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">All subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Featured</label>
                <select
                  value={featured}
                  onChange={(e) => {
                    setFeatured(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">All products</option>
                  <option value="true">Featured</option>
                  <option value="false">Not featured</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Stock availability</label>
                <select
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">All stock levels</option>
                  <option value=">inStock">In stock</option>
                  <option value="outOfStock">Out of stock</option>
                </select>
              </div>
            </div>

            <div className="border-t border-border p-6">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </aside>
        )}

        {/* Products */}
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="space-y-4 lg:hidden">
              {isEmpty ? (
                <div className="rounded-xl border border-dashed border-border py-16 text-center">
                  <p className="font-medium text-foreground">
                    No products found
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={product.imageCover}
                        alt={product.name}
                        className="h-24 w-24 shrink-0 rounded-lg border border-border object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 font-semibold text-foreground">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.category?.name}
                          {product.subcategory?.name &&
                            ` / ${product.subcategory.name}`}
                        </p>

                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {product.gender}
                        </p>

                        <p className="mt-3 font-semibold text-foreground">
                          {product.price}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-md border px-2 py-1 text-xs ${
                            product.quantity === 0
                              ? 'border-border bg-accent text-muted-foreground'
                              : 'border-primary/20 bg-accent text-foreground'
                          }`}
                        >
                          {product.quantity === 0
                            ? 'Out of stock'
                            : `${product.quantity} in stock`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-t border-border bg-background/50 px-3 py-3 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Sold</p>
                        <p className="mt-1 font-semibold text-foreground">
                          {product.sold}
                        </p>
                      </div>

                      <div className="border-x border-border">
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className="mt-1 font-semibold text-foreground">
                          {product.ratingsAverage?.toFixed(1) || '0.0'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Featured
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                          {product.featured ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-border p-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`${product._id}`)}
                      >
                        Edit
                      </Button>

                      <Modal.Open
                        opens={`delete-product-mobile-${product._id}`}
                      >
                        <Button
                          variant="dangerOutline"
                          size="sm"
                          className="flex-1"
                          loading={deletingId === product._id}
                        >
                          Delete
                        </Button>
                      </Modal.Open>

                      <Modal.Window
                        name={`delete-product-mobile-${product._id}`}
                      >
                        <ConfirmDelete
                          onCloseModal={() => {}}
                          resourceName="product"
                          disabled={deletingId === product._id}
                          onConfirm={() => handleDelete(product._id)}
                        />
                      </Modal.Window>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
              <DataTable
                head={
                  <>
                    <th className="px-4 py-4 text-left font-semibold">Photo</th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Product
                    </th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Category
                    </th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Subcategory
                    </th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Gender
                    </th>
                    <th className="px-4 py-4 text-left font-semibold">
                      Featured
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Price
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Stock
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Sold
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Rating
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </>
                }
              >
                {isEmpty ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-16 text-center text-muted-foreground"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition-colors hover:bg-accent/50"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={product.imageCover}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg border border-border object-cover"
                        />
                      </td>

                      <td className="max-w-48 truncate px-4 py-3 font-medium text-foreground">
                        {product.name}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {product.category?.name || '—'}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {product.subcategory?.name || '—'}
                      </td>

                      <td className="px-4 py-3 capitalize text-muted-foreground">
                        {product.gender}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-md border border-border bg-accent px-2 py-1 text-xs text-foreground">
                          {product.featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center font-medium">
                        {product.price}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="rounded-md border border-border bg-accent px-2 py-1 text-xs text-foreground">
                          {product.quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">{product.sold}</td>

                      <td className="px-4 py-3 text-center">
                        {product.ratingsAverage?.toFixed(1) || '0.0'} (
                        {product.ratingsQuantity})
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`${product._id}`)}
                          >
                            Edit
                          </Button>

                          <Modal.Open
                            opens={`delete-product-desktop-${product._id}`}
                          >
                            <Button
                              variant="dangerOutline"
                              size="sm"
                              loading={deletingId === product._id}
                            >
                              Delete
                            </Button>
                          </Modal.Open>

                          <Modal.Window
                            name={`delete-product-desktop-${product._id}`}
                          >
                            <ConfirmDelete
                              onCloseModal={() => {}}
                              resourceName="product"
                              disabled={deletingId === product._id}
                              onConfirm={() => handleDelete(product._id)}
                            />
                          </Modal.Window>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </DataTable>
            </div>
          </>
        )}

        <Pagination
          currentPage={page}
          onPageChange={setPage}
          numberOfPages={numberOfPages}
        />
      </AdminPageLayout>
    </Modal>
  );
}

export default ProductsTable;
