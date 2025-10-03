import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  FileText,
  Edit3,
  AlertCircle,
  Upload as CloudUpload,
} from "lucide-react";
import { apiUploadResume } from "../../lib/api";
import { Job, User } from "../../types";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  user: User;
  onApply: (applicationData: {
    coverLetter: string;
    resumeUrl: string;
  }) => Promise<void>;
}

export function JobApplicationModal({
  isOpen,
  onClose,
  job,
  user,
  onApply,
}: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    console.log("user", user);
    if (user.resumeUrl) {
      setResumeUrl(user.resumeUrl);
      setShowUpload(false);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const effectiveResume = (resumeUrl || user.resumeUrl || "").trim();
    if (job.requireResume && !effectiveResume) {
      newErrors.resumeUrl = "Resume URL is required for this job";
    }

    if (coverLetter.length > 2000) {
      newErrors.coverLetter = "Cover letter must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        resumeUrl: "Please upload a PDF file only",
      }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resumeUrl: "File size must be less than 10MB",
      }));
      return;
    }
    setIsUploading(true);
    setErrors((prev) => ({ ...prev, resumeUrl: "" }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      const result = await apiUploadResume(token, file);
      setResumeUrl(result.url);
      setShowUpload(false);
    } catch (err) {
      console.error("Upload error:", err);
      setErrors((prev) => ({
        ...prev,
        resumeUrl: "Failed to upload file. Please try again.",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const effectiveResume = (resumeUrl || user.resumeUrl || "").trim();
      await onApply({
        coverLetter: coverLetter.trim(),
        resumeUrl: effectiveResume,
      });
      onClose();
    } catch (error) {
      console.error("Error applying to job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply to Job</h2>
            <p className="text-gray-600 mt-1">
              {job.title} at {job.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Job Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Location:</span> {job.location}
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {job.type
                  ? job.type
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Experience:</span>{" "}
                {job.experience}
              </div>
              {typeof job?.salary?.min === "number" &&
                typeof job?.salary?.max === "number" && (
                  <div>
                    <span className="font-medium">Salary:</span> ₹
                    {job.salary.min.toLocaleString()} - ₹
                    {job.salary.max.toLocaleString()}
                  </div>
                )}
            </div>
          </div>

          {/* Resume */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Resume{" "}
              {job.requireResume && <span className="text-red-500">*</span>}
            </label>

            {/* Using profile resume */}
            {!showUpload && (user.resumeUrl || resumeUrl) && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <a
                    href={user.resumeUrl || resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-800 underline"
                  >
                    View your profile resume
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Not this resume? Upload new
                </button>
              </div>
            )}

            {/* Upload new resume */}
            {(showUpload || !(user.resumeUrl || resumeUrl)) && (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="apply-resume-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="apply-resume-upload"
                    className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isUploading
                        ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-center">
                      <CloudUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {isUploading
                          ? "Uploading..."
                          : "Click to upload PDF resume"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </label>
                </div>
                {!!user.resumeUrl && showUpload && (
                  <button
                    type="button"
                    onClick={() => {
                      setResumeUrl(user.resumeUrl || "");
                      setShowUpload(false);
                    }}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Use profile resume instead
                  </button>
                )}
              </div>
            )}

            {errors.resumeUrl && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.resumeUrl}</span>
              </p>
            )}
          </div>

          {/* Cover Letter */}
          {job.allowCoverLetter && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Cover Letter (Optional)
              </label>
              <div className="relative">
                <Edit3 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.coverLetter ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                />
              </div>
              {errors.coverLetter && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.coverLetter}</span>
                </p>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Max 2000 characters</span>
                <span
                  className={coverLetter.length > 1800 ? "text-orange-600" : ""}
                >
                  {coverLetter.length}/2000
                </span>
              </div>
            </div>
          )}

          {/* Application Terms */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Application Terms</p>
                <ul className="space-y-1 text-blue-700">
                  <li>
                    • By applying, you confirm that all information provided is
                    accurate
                  </li>
                  <li>
                    • Your application will be shared with the hiring company
                  </li>
                  <li>
                    • You can withdraw your application at any time from your
                    dashboard
                  </li>
                  <li>
                    • The company may contact you for further steps in the
                    hiring process
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>
                {isLoading
                  ? "Submitting..."
                  : isUploading
                  ? "Uploading..."
                  : "Submit Application"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
