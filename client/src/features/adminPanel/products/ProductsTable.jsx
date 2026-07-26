import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
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
import SpinnerMini from '../../../ui/SpinnerMini';

function ProductsTable() {
  const { categories = [] } = useCategories();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const filtersKey = useMemo(() => ({ category, sort }), [category, sort]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, sort, page],
    queryFn: () =>
      getFilteredProducts({
        sort,
        page,
      }),

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

  // this needs to filter by category subcategory

  const products = data?.data ?? [];
  const totalPages = data?.paginationResult?.numberOfPages ?? 1;
  const isEmpty = !isLoading && products.length === 0;

  return (
    <Modal>
      <AdminPageLayout
        title="Products"
        actions={
          <>
            <Modal.Open opens="add-product">
              <Button variant="primary">Add Product</Button>
            </Modal.Open>

            <Modal.Window name="add-product">
              <AddProductForm />
            </Modal.Window>
          </>
        }
      >
        {isLoading && <Spinner />}

        {!isLoading && (
          <DataTable
            head={
              <>
                <th className="px-4 py-3 text-left">Photo</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
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
                <td colSpan={9} className="py-10 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={product.imageCover}
                      className="h-14 w-14 rounded border object-cover"
                    />
                  </td>
                  <td className="truncate px-4 py-3 font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">{product.category?.name}</td>
                  <td
                    className={`px-4 py-3 ${
                      product.featured ? 'text-green-400' : 'text-red-500'
                    }`}
                  >
                    {String(product.featured)}
                  </td>{' '}
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
                      {/* Edit */}
                      <NavLink
                        to={product._id}
                        className="text-xs text-yellow-600 hover:underline"
                      >
                        Edit
                      </NavLink>

                      {/* Delete — opens confirmation first */}
                      <Modal.Open opens={`delete-product-${product._id}`}>
                        <button
                          disabled={deletingId === product._id}
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            <SpinnerMini />
                          ) : (
                            'Delete'
                          )}
                        </button>
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
        )}

        {/* Pagination stays same */}
      </AdminPageLayout>
    </Modal>
  );
}

export default ProductsTable;
