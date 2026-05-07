"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectSchema } from "@/utils/validators";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  contentTitle,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rejectSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    await onConfirm(data.reason);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reject Content">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <p className="text-sm text-red-700">
            You are about to reject: <strong>{contentTitle}</strong>
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("reason")}
            rows={4}
            placeholder="Provide a clear reason so the teacher can improve their content..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
          {errors.reason && (
            <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            Confirm Rejection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
