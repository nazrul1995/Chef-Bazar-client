import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const DeleteModal = ({ isOpen, closeModal, onConfirm }) => {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Delete Review
          </DialogTitle>

          <p className="mt-3 text-sm text-gray-600">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default DeleteModal
