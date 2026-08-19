import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';

import AddProductForm from './AddProductForm';

import { deleteProduct, getFilteredProducts } from '../../../services/products';
import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';
import ConfirmDelete from '../../../ui/ConfirmDelete';
import useCategories from '../../../hooks/useCategories';
import { HiXMark } from 'react-icons/hi2';
import Spinner from '../../../ui/Spinner';
import { IoIosSearch } from 'react-icons/io';
import useDebounce from '../../../hooks/useDebounce';
import Pagination from '../../Products/pagination';
import { GENDERS } from '../../../constants/constants';
import useSubCategories from '../../../hooks/useSubCategories';

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
          <div className="w-full space-y-3">
            {/* Search */}
            <div className="w-full border-b border-gray-200 bg-white py-2">
              <div className="flex items-center gap-2">
                <IoIosSearch className="h-5 w-5 shrink-0 text-gray-500" />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products..."
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>

            {/* Sort + Filters */}
            <div className="flex w-full gap-2">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="min-w-0 flex-1 cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Newest</option>
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
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Filter drawer */}
        {showFilters && (
          <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Filters</h2>

              <button onClick={() => setShowFilters(false)}>
                <HiXMark className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-4">
              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium">Gender</label>

                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded border p-2"
                >
                  <option value="all">All</option>

                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded border p-2"
                >
                  <option value="all">All</option>

                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subcategory
                </label>

                <select
                  value={subcategory}
                  onChange={(e) => {
                    setSubcategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded border p-2"
                >
                  <option value="all">All</option>

                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Featured
                </label>

                <select
                  value={featured}
                  onChange={(e) => {
                    setFeatured(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded border p-2"
                >
                  <option value="all">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium">Stock</label>

                <select
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded border p-2"
                >
                  <option value="all">All</option>
                  <option value=">inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {isLoading && <Spinner />}

        {!isLoading && (
          <>
            {/* ================= MOBILE ================= */}
            <div className="space-y-3 lg:hidden">
              {isEmpty ? (
                <div className="py-10 text-center text-gray-500">
                  No products found
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <img
                        src={product.imageCover}
                        alt={product.name}
                        className="h-20 w-20 shrink-0 rounded-md border object-cover"
                      />

                      {/* Main information */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {product.category?.name}
                          {product.subcategory?.name &&
                            ` • ${product.subcategory.name}`}
                        </p>

                        <p className="mt-1 text-xs capitalize text-gray-500">
                          {product.gender}
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <span className="font-semibold">{product.price}</span>

                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              product.quantity === 0
                                ? 'bg-red-100 text-red-600'
                                : 'bg-green-100 text-green-600'
                            }`}
                          >
                            Stock: {product.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product stats */}
                    <div className="mt-3 grid grid-cols-3 border-t pt-3 text-center text-xs">
                      <div>
                        <p className="text-gray-500">Sold</p>
                        <p className="mt-1 font-medium">{product.sold}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Rating</p>
                        <p className="mt-1 font-medium">
                          {product.ratingsAverage?.toFixed(1) || '0.0'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Featured</p>
                        <p
                          className={`mt-1 font-medium ${
                            product.featured ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {product.featured ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2 border-t pt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`${product._id}`)}
                      >
                        Edit
                      </Button>

                      <Modal.Open opens={`delete-product-${product._id}`}>
                        <Button
                          variant="dangerOutline"
                          size="sm"
                          className="flex-1"
                          loading={deletingId === product._id}
                        >
                          Delete
                        </Button>
                      </Modal.Open>

                      <Modal.Window name={`delete-product-${product._id}`}>
                        <ConfirmDelete
                          resourceName="product"
                          disabled={deletingId === product._id}
                          onCloseModal={() => {}}
                          onConfirm={() => handleDelete(product._id)}
                        />
                      </Modal.Window>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden lg:block">
              <DataTable
                head={
                  <>
                    <th className="px-4 py-3 text-left">Photo</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Subcategory</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-left">Featured</th>
                    <th className="px-4 py-3 text-center">Price</th>
                    <th className="px-4 py-3 text-center">Stock</th>
                    <th className="px-4 py-3 text-center">Sold</th>
                    <th className="px-4 py-3 text-center">Rating</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </>
                }
              >
                {isEmpty ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-10 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={product.imageCover}
                          alt={product.name}
                          className="h-14 w-14 rounded border object-cover"
                        />
                      </td>

                      <td className="max-w-50 truncate px-4 py-3 font-medium">
                        {product.name}
                      </td>

                      <td className="px-4 py-3">{product.category?.name}</td>

                      <td className="px-4 py-3">{product.subcategory?.name}</td>

                      <td className="px-4 py-3">{product.gender}</td>

                      <td
                        className={`px-4 py-3 ${
                          product.featured ? 'text-green-400' : 'text-red-500'
                        }`}
                      >
                        {String(product.featured)}
                      </td>

                      <td className="px-4 py-3 text-center">{product.price}</td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            product.quantity === 0
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">{product.sold}</td>

                      <td className="px-4 py-3 text-center">
                        {product.ratingsAverage?.toFixed(1)} (
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

                          <Modal.Open opens={`delete-product-${product._id}`}>
                            <Button
                              variant="dangerOutline"
                              size="sm"
                              loading={deletingId === product._id}
                            >
                              Delete
                            </Button>
                          </Modal.Open>

                          <Modal.Window name={`delete-product-${product._id}`}>
                            <ConfirmDelete
                              resourceName="product"
                              disabled={deletingId === product._id}
                              onCloseModal={() => {}}
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
