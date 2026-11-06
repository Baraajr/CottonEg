import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiLayers, FiPlus } from 'react-icons/fi';

import useSubCategories from '../../../hooks/useSubCategories';
import useCategories from '../../../hooks/useCategories';

import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import ConfirmDelete from '../../../ui/ConfirmDelete';
import Spinner from '../../../ui/Spinner';

import { deleteSubCategory } from '../../../services/subCategories';
import AddSubCategoryForm from './AddSubCategoryForm';
import UpdateSubCategoryForm from './UpdateSubCategoryForm';

import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';

function SubCategoriesTable() {
  const { categories = [] } = useCategories();
  const { subcategories = [], isPending } = useSubCategories();

  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { mutate: removeSubCategory } = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      toast.success('Subcategory deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to delete subcategory');
      setDeletingId(null);
    },
  });

  function handleDelete(id) {
    setDeletingId(id);
    removeSubCategory(id);
  }

  if (isPending) return <Spinner />;

  return (
    <Modal>
      <AdminPageLayout
        title="Subcategories"
        headerActions={
          <Modal.Open opens="add-subcategory">
            <Button>
              <span className="flex items-center gap-2">
                <FiPlus size={16} />
                Add Subcategory
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
                  <th className="px-6 py-4 text-left font-medium">
                    Subcategory
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Category</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Available for
                  </th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </>
              }
            >
              {subcategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <FiLayers
                      size={28}
                      className="mx-auto mb-3 text-muted-foreground"
                    />
                    <p className="font-serif text-lg text-foreground">
                      No subcategories yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create your first subcategory to organize your products.
                    </p>
                  </td>
                </tr>
              )}

              {subcategories.map((subcategory) => (
                <tr
                  key={subcategory._id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-background"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                        <FiLayers size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {subcategory.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {subcategory.category?.name ?? '—'}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {subcategory.genders?.length ? (
                        subcategory.genders.map((gender) => (
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
                      <Modal.Open
                        opens={`update-subcategory-${subcategory._id}`}
                      >
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Modal.Open>

                      <Modal.Window
                        name={`update-subcategory-${subcategory._id}`}
                      >
                        <UpdateSubCategoryForm
                          subcategory={subcategory}
                          categories={categories}
                        />
                      </Modal.Window>

                      <Modal.Open
                        opens={`delete-subcategory-${subcategory._id}`}
                      >
                        <Button
                          size="sm"
                          variant="dangerOutline"
                          loading={deletingId === subcategory._id}
                        >
                          Delete
                        </Button>
                      </Modal.Open>

                      <Modal.Window
                        name={`delete-subcategory-${subcategory._id}`}
                      >
                        <ConfirmDelete
                          resourceName="subcategory"
                          disabled={deletingId === subcategory._id}
                          onCloseModal={() => {}}
                          onConfirm={() => handleDelete(subcategory._id)}
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

      <Modal.Window name="add-subcategory">
        <AddSubCategoryForm categories={categories} />
      </Modal.Window>
    </Modal>
  );
}

export default SubCategoriesTable;
