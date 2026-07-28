import Button from './Button';

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <div className="flex w-160 max-w-full flex-col gap-5">
      <h3 className="text-lg font-semibold text-gray-900">
        Delete {resourceName}
      </h3>

      <p className="mb-6 text-sm leading-6 text-gray-600">
        Are you sure you want to permanently delete this
        <span className="font-semibold">{resourceName}</span>? This action
        cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>

        <Button variant="danger" loading={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
