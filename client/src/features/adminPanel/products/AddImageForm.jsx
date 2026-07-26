import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addImage } from '../../../services/products';
import toast from 'react-hot-toast';

function AddImageForm({ productId, onCloseModal }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => addImage({ id: productId, data: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', productId]);
      toast.success('Image uploaded successfully');
      onCloseModal?.();
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to upload image');
    },
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('addImage', file);

    mutate(formData);
  };

  return (
    <div className="p-6 w-80">
      <h2 className="text-lg font-semibold mb-4">Add Image</h2>

      <label className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="mx-auto h-32 w-32 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 text-sm">
            Click to select an image
          </span>
        )}
      </label>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          disabled={!file || isPending}
          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isPending ? 'Uploading…' : 'Upload'}
        </button>
        <button
          onClick={onCloseModal}
          className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddImageForm;
