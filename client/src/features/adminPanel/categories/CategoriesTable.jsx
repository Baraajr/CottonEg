import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiTag, FiPlus, FiLayers } from 'react-icons/fi';

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
        headerActions={
          <Modal.Open opens="add-category">
            <Button>
              <span className="flex items-center gap-2">
                <FiPlus size={16} />
                Add Category
              </span>
            </Button>
          </Modal.Open>
        }
      >
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <DataTable
              head={
                <>
                  <th className="px-6 py-4 text-left font-medium">Category</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Available for
                  </th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </>
              }
            >
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <FiTag
                      size={28}
                      className="mx-auto mb-3 text-muted-foreground"
                    />
                    <p className="font-serif text-lg text-foreground">
                      No categories yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create your first category to organize your products.
                    </p>
                  </td>
                </tr>
              )}

              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-background"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                        <FiTag size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {category.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {category.genders?.length ? (
                        category.genders.map((gender) => (
                          <span
                            key={gender}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium capitalize text-muted-foreground"
                          >
                            {gender}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not specified
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
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
          </div>
        </div>
      </AdminPageLayout>

      <Modal.Window name="add-category">
        <AddCategoryForm />
      </Modal.Window>
    </Modal>
  );
}

export default CategoriesTable;
