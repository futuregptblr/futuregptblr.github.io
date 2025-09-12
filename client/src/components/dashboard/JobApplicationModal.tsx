import React, { useState, useEffect } from 'react';
import { X, Send, FileText, Edit3, AlertCircle } from 'lucide-react';
import { Job, User } from '../../types';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  user: User;
  onApply: (applicationData: { coverLetter: string; resumeUrl: string }) => Promise<void>;
}

export function JobApplicationModal({ isOpen, onClose, job, user, onApply }: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user.resumeUrl) {
      setResumeUrl(user.resumeUrl);
    }
  }, [user.resumeUrl]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (job.requireResume && !resumeUrl.trim()) {
      newErrors.resumeUrl = 'Resume URL is required for this job';
    }

    if (resumeUrl && !/^https?:\/\/.+/.test(resumeUrl)) {
      newErrors.resumeUrl = 'Please enter a valid URL starting with http:// or https://';
    }

    if (coverLetter.length > 2000) {
      newErrors.coverLetter = 'Cover letter must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onApply({
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl.trim()
      });
      onClose();
    } catch (error) {
      console.error('Error applying to job:', error);
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
            <p className="text-gray-600 mt-1">{job.title} at {job.companyName}</p>
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
                <span className="font-medium">Type:</span> {job.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div>
                <span className="font-medium">Experience:</span> {job.experience}
              </div>
              {job.salary && (
                <div>
                  <span className="font-medium">Salary:</span> ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Resume URL */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Resume URL {job.requireResume && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.resumeUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
            {errors.resumeUrl && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.resumeUrl}</span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              {user.resumeUrl ? (
                <span className="text-green-600">✓ Using your profile resume</span>
              ) : (
                'Upload your resume to a cloud service (Google Drive, Dropbox, etc.) and paste the link here'
              )}
            </p>
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
                    errors.coverLetter ? 'border-red-500' : 'border-gray-300'
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
                <span className={coverLetter.length > 1800 ? 'text-orange-600' : ''}>
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
                  <li>• By applying, you confirm that all information provided is accurate</li>
                  <li>• Your application will be shared with the hiring company</li>
                  <li>• You can withdraw your application at any time from your dashboard</li>
                  <li>• The company may contact you for further steps in the hiring process</li>
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
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isLoading ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
