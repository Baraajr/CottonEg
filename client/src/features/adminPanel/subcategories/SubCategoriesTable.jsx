import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';

import useSubCategories from '../../../hooks/useSubCategories';
import useCategories from '../../../hooks/useCategories';

import { deleteSubCategory } from '../../../services/subcategories';
import AddSubCategoryForm from './AddSubCategoryForm';
import UpdateSubCategoryForm from './UpdateSubCategoryForm';

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

function SubCategoriesTable() {
  const { categories = [] } = useCategories();
  const { subcategories = [], isPending } = useSubCategories();

  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { mutate: remove } = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed');
      setDeletingId(null);
    },
  });

  function handleDelete(id) {
    setDeletingId(id);
    remove(id);
  }

  return (
    <Modal>
      <AdminPageLayout
        title="Subcategories"
        actions={
          <Modal.Open opens="add-subcategory">
            <Button variant="primary" className="w-full sm:w-auto">
              Add SubCategory
            </Button>
          </Modal.Open>
        }
      >
        <Modal.Window name="add-subcategory">
          <AddSubCategoryForm categories={categories} />
        </Modal.Window>

        {isPending && <Spinner />}

        {!isPending && (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block">
              <DataTable
                head={
                  <>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Genders</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </>
                }
              >
                {subcategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No subcategories found
                    </td>
                  </tr>
                )}

                {subcategories.map((sc) => (
                  <tr key={sc._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{sc.name}</td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {sc.category?.name ?? '—'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {sc.genders?.map((gender) => (
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
                        <Modal.Open opens={`edit-${sc._id}`}>
                          <button className="text-sm text-yellow-600 hover:underline">
                            Edit
                          </button>
                        </Modal.Open>

                        <Modal.Window name={`edit-${sc._id}`}>
                          <UpdateSubCategoryForm
                            subcategory={sc}
                            categories={categories}
                          />
                        </Modal.Window>

                        <Modal.Open opens={`delete-${sc._id}`}>
                          <button
                            disabled={deletingId === sc._id}
                            className="text-sm text-red-600 hover:underline disabled:opacity-50"
                          >
                            {deletingId === sc._id ? <SpinnerMini /> : 'Delete'}
                          </button>
                        </Modal.Open>

                        <Modal.Window name={`delete-${sc._id}`}>
                          <ConfirmDelete
                            resourceName="subcategory"
                            disabled={deletingId === sc._id}
                            onCloseModal={() => {}}
                            onConfirm={() => handleDelete(sc._id)}
                          />
                        </Modal.Window>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </div>

            {/* ================= MOBILE ULTRA COMPACT ================= */}
            <div className="md:hidden space-y-2">
              {subcategories.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  No subcategories found
                </div>
              )}

              {subcategories.map((sc) => (
                <div
                  key={sc._id}
                  className="bg-white border rounded-md p-3 flex items-center justify-between"
                >
                  {/* LEFT */}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{sc.name}</p>

                    <p className="text-xs text-gray-500 truncate">
                      {sc.category?.name ?? '—'}
                    </p>

                    <div className="flex gap-1 flex-wrap mt-1">
                      {sc.genders?.map((gender) => (
                        <span
                          key={gender}
                          className={`px-2 py-0.5 rounded-full text-[10px] capitalize ${GENDER_STYLES[gender]}`}
                        >
                          {gender}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    <Modal.Open opens={`edit-${sc._id}`}>
                      <button className="text-xs px-2 py-1 text-yellow-600">
                        Edit
                      </button>
                    </Modal.Open>

                    <Modal.Open opens={`delete-${sc._id}`}>
                      <button className="text-xs px-2 py-1 text-red-600">
                        Delete
                      </button>
                    </Modal.Open>
                  </div>

                  {/* MODALS */}
                  <Modal.Window name={`edit-${sc._id}`}>
                    <UpdateSubCategoryForm
                      subcategory={sc}
                      categories={categories}
                    />
                  </Modal.Window>

                  <Modal.Window name={`delete-${sc._id}`}>
                    <ConfirmDelete
                      resourceName="subcategory"
                      disabled={deletingId === sc._id}
                      onCloseModal={() => {}}
                      onConfirm={() => handleDelete(sc._id)}
                    />
                  </Modal.Window>
                </div>
              ))}
            </div>
          </>
        )}
      </AdminPageLayout>
    </Modal>
  );
}

export default SubCategoriesTable;
