import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addImage } from '../../../services/products';
import toast from 'react-hot-toast';
import Button from '../../../ui/Button';

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
    <div className="w-80 p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Product gallery
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Add Image
        </h2>
      </div>

      <label className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-5 text-center transition-colors hover:border-primary">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="h-40 w-full rounded-lg object-contain"
            />
            <span className="mt-3 text-xs text-muted-foreground">
              Click to change image
            </span>
          </>
        ) : (
          <>
            <div className="mb-3 rounded-full bg-accent px-4 py-4 text-primary">
              <span className="text-2xl">+</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              Click to select an image
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              Choose an image from your device
            </span>
          </>
        )}
      </label>

      <div className="mt-6 flex gap-3">
        <Button
          onClick={handleSubmit}
          loading={isPending}
          disabled={!file}
          className="flex-1"
        >
          Upload
        </Button>

        <Button variant="secondary" onClick={onCloseModal} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default AddImageForm;
