"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DropzoneUpload } from "@/components/teacher/DropzoneUpload";
import { Button } from "@/components/ui/Button";
import { contentService } from "@/services/content.service";
import { uploadContentSchema } from "@/utils/validators";
import { SUBJECTS } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadContentSchema),
    defaultValues: { rotationDuration: 30 },
  });

  const mutation = useMutation({
    mutationFn: (formData) => contentService.uploadContent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myContent"] });
      toast.success("Content uploaded! Pending principal approval.");
      reset();
      setFile(null);
      router.push("/teacher/my-content");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Upload failed. Please try again.",
      );
    },
  });

  const onSubmit = (data) => {
    if (!file) {
      setFileError("Please select a file to upload");
      return;
    }
    setFileError("");

    const formData = new FormData();
    formData.append("teacherId", user.id);
    formData.append("teacherName", user.name);
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) formData.append(k, v);
    });
    formData.append("file", file);

    mutation.mutate(formData);
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/teacher/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
            <p className="text-gray-500 text-sm">
              Fill in the details and upload your educational content
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
        >
          <FormField label="Title" required error={errors.title?.message}>
            <input
              {...register("title")}
              placeholder="e.g. Introduction to Photosynthesis"
              className={inputClass}
            />
          </FormField>

          <FormField label="Subject" required error={errors.subject?.message}>
            <select {...register("subject")} className={inputClass}>
              <option value="">Select a subject...</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Brief description of the content..."
              className={inputClass + " resize-none"}
            />
          </FormField>

          <FormField label="Content File" required error={fileError}>
            <DropzoneUpload
              onFileChange={(f) => {
                setFile(f);
                if (f) setFileError("");
              }}
              error={fileError}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Start Time"
              required
              error={errors.startTime?.message}
            >
              <input
                {...register("startTime")}
                type="datetime-local"
                className={inputClass}
              />
            </FormField>
            <FormField
              label="End Time"
              required
              error={errors.endTime?.message}
            >
              <input
                {...register("endTime")}
                type="datetime-local"
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField
            label="Rotation Duration (seconds)"
            error={errors.rotationDuration?.message}
          >
            <input
              {...register("rotationDuration")}
              type="number"
              min="1"
              placeholder="30"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              How long each content item stays on screen
            </p>
          </FormField>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setFile(null);
              }}
            >
              Reset
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              <Send className="w-4 h-4" />
              Submit for Approval
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
