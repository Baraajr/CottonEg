import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import useCategories from '../../../hooks/useCategories';
import Modal from '../../../ui/Modal';
import AddCategoryForm from './AddCategoryForm';
import UpdateCategoryForm from './UpdateCategoryForm';
import { deleteCategory } from '../../../services/category';
import Button from '../../../ui/Button';
import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';
import ConfirmDelete from '../../../ui/ConfirmDelete';
import Spinner from '../../../ui/Spinner';
import SpinnerMini from '../../../ui/SpinnerMini';

const GENDER_STYLES = {
  men: 'bg-blue-100 text-blue-800',
  women: 'bg-pink-100 text-pink-800',
  kids: 'bg-green-100 text-green-800',
};

function CategoriesTable() {
  const { categories = [], isPending } = useCategories();

  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { mutate: removeCategory } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to delete category');
      setDeletingId(null);
    },
  });

  function handleDelete(id) {
    setDeletingId(id);
    removeCategory(id);
  }

  if (isPending) return <Spinner />;

  return (
    <Modal>
      <AdminPageLayout
        title="Categories"
        actions={
          <Modal.Open opens="add-category">
            <Button variant="primary">Add Category</Button>
          </Modal.Open>
        }
      >
        <DataTable
          head={
            <>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Genders</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </>
          }
        >
          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          )}

          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium">{category.name}</td>

              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {category.genders?.map((gender) => (
                    <span
                      key={gender}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${GENDER_STYLES[gender]}`}
                    >
                      {gender}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Modal.Open opens={`update-category-${category._id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Modal.Open>

                  <Modal.Window name={`update-category-${category._id}`}>
                    <UpdateCategoryForm category={category} />
                  </Modal.Window>

                  <Modal.Open opens={`delete-category-${category._id}`}>
                    <Button
                      size="sm"
                      variant="dangerOutline"
                      loading={deletingId === category._id}
                    >
                      Delete
                    </Button>
                  </Modal.Open>

                  <Modal.Window name={`delete-category-${category._id}`}>
                    <ConfirmDelete
                      resourceName="category"
                      disabled={deletingId === category._id}
                      onCloseModal={() => {}}
                      onConfirm={() => handleDelete(category._id)}
                    />
                  </Modal.Window>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </AdminPageLayout>

      <Modal.Window name="add-category">
        <AddCategoryForm />
      </Modal.Window>
    </Modal>
  );
}

export default CategoriesTable;
