import { X, Upload, AlertCircle } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import type { EventDto } from '../../lib/api';

// Configuration: Maximum file size for Monthly Event resources
// NOTE: Frontend limit is 25MB, but actual uploads are constrained by provider (Cloudinary)
// Current Cloudinary account limit for raw uploads: 10MB
const MAX_RESOURCE_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB (provider limit)
const MAX_RESOURCE_FILE_SIZE_DISPLAY = '10 MB';

// Resource type detection from file extension
const RESOURCE_TYPE_MAP: Record<string, 'ppt' | 'pptx' | 'pdf' | 'doc' | 'docx' | 'notes'> = {
  '.ppt': 'ppt',
  '.pptx': 'pptx',
  '.pdf': 'pdf',
  '.doc': 'doc',
  '.docx': 'docx',
  '.txt': 'notes',
};

const ALLOWED_EXTENSIONS = new Set(['.ppt', '.pptx', '.pdf', '.doc', '.docx', '.txt']);

function getResourceTypeFromFile(filename: string): 'ppt' | 'pptx' | 'pdf' | 'doc' | 'docx' | 'notes' | null {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return RESOURCE_TYPE_MAP[ext] || null;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

interface MonthlyEventFormProps {
  event: EventDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function MonthlyEventForm({
  event,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: MonthlyEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    description: '',
    speakerName: '',
    speakerLinkedin: '',
    bannerFile: null as File | null,
    published: true,
  });

  const [resourceData, setResourceData] = useState({
    resourceFile: null as File | null,
    resourceTitle: '',
    resourceType: 'pptx' as 'ppt' | 'pptx' | 'pdf' | 'doc' | 'docx' | 'notes',
  });

  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<{ name: string; size: string } | null>(null);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        domain: event.domain || '',
        description: event.description || '',
        speakerName: event.speaker?.name || '',
        speakerLinkedin: event.speaker?.linkedinUrl || '',
        bannerFile: null,
        published: event.published ?? true,
      });
      
      if (event.image) {
        setPreviewBanner(event.image);
      }
    } else {
      setFormData({
        title: '',
        domain: '',
        description: '',
        speakerName: '',
        speakerLinkedin: '',
        bannerFile: null,
        published: true,
      });
      setPreviewBanner(null);
    }
    
    setResourceData({
      resourceFile: null,
      resourceTitle: '',
      resourceType: 'pptx',
    });
    setPreviewResource(null);
    setResourceError(null);
  }, [event, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!event;

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, bannerFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResourceError(null);

    if (!file) {
      setPreviewResource(null);
      setResourceData({
        resourceFile: null,
        resourceTitle: '',
        resourceType: 'pptx',
      });
      return;
    }

    // Validate file extension
    const filename = file.name.toLowerCase();
    const ext = filename.slice(filename.lastIndexOf('.'));
    
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      setResourceError(`File type not allowed. Accepted types: .ppt, .pptx, .pdf, .doc, .docx`);
      setPreviewResource(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_RESOURCE_FILE_SIZE_BYTES) {
      setResourceError(
        `File is too large. Maximum allowed size is ${MAX_RESOURCE_FILE_SIZE_DISPLAY}. ` +
        `Your file is ${formatFileSize(file.size)}.`
      );
      setPreviewResource(null);
      return;
    }

    // Auto-detect resource type from extension
    const detectedType = getResourceTypeFromFile(file.name);
    
    setResourceData({
      resourceFile: file,
      resourceTitle: '',
      resourceType: detectedType || 'pptx',
    });
    
    setPreviewResource({
      name: file.name,
      size: formatFileSize(file.size),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Event Title is required');
      return;
    }
    
    if (!formData.speakerName.trim()) {
      alert('Speaker Name is required');
      return;
    }

    if (resourceError) {
      alert('Please fix the resource file error before submitting');
      return;
    }
    
    await onSubmit({
      ...formData,
      isMonthlyEvent: true,
      resource: resourceData.resourceFile ? resourceData : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Monthly Event' : 'Create Monthly Event'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Archive a completed FutureGPT Monthly Meetup and preserve speaker resources
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            {/* Event Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                {previewBanner ? (
                  <div className="space-y-2">
                    <img 
                      src={previewBanner} 
                      alt="Banner preview" 
                      className="h-32 w-full object-cover rounded"
                    />
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                      <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                        Change Image
                      </span>
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Event Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., AI Security & Autonomous Agents"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain / Topic
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g., Cybersecurity, Artificial Intelligence, Leadership"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief overview of what was discussed in this event..."
                  />
                </div>
              </div>
            </div>

            {/* Speaker Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Speaker Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.speakerName}
                    onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker LinkedIn URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.speakerLinkedin}
                    onChange={(e) => setFormData({ ...formData, speakerLinkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>

            {/* Event Resource / Material */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Resource / Material</h3>
              <div className="space-y-4">
                {/* Resource Error Message */}
                {resourceError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">File Error</p>
                      <p className="text-sm text-red-700 mt-1">{resourceError}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resource
                    <span className="text-gray-500 font-normal ml-2">
                      (Max {MAX_RESOURCE_FILE_SIZE_DISPLAY})
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                    {previewResource ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 font-medium">{previewResource.name}</p>
                        <p className="text-xs text-gray-600">{previewResource.size}</p>
                        <label className="inline-block">
                          <input
                            type="file"
                            accept=".ppt,.pptx,.pdf,.doc,.docx,.txt"
                            onChange={handleResourceChange}
                            className="hidden"
                          />
                          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                            Change File
                          </span>
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".ppt,.pptx,.pdf,.doc,.docx,.txt"
                          onChange={handleResourceChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center py-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            PPT, PPTX, PDF, DOC, DOCX, or Notes (TXT)
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max {MAX_RESOURCE_FILE_SIZE_DISPLAY}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {resourceData.resourceFile && !resourceError && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resource Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={resourceData.resourceTitle}
                        onChange={(e) => setResourceData({ ...resourceData, resourceTitle: e.target.value })}
                        placeholder="e.g., Keynote Presentation"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resource Type
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={resourceData.resourceType}
                        onChange={(e) => setResourceData({ ...resourceData, resourceType: e.target.value as any })}
                      >
                        <option value="ppt">PowerPoint (.ppt)</option>
                        <option value="pptx">PowerPoint (.pptx)</option>
                        <option value="pdf">PDF Document (.pdf)</option>
                        <option value="doc">Word Document (.doc)</option>
                        <option value="docx">Word Document (.docx)</option>
                        <option value="notes">Notes (.txt)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-detected from file: <span className="font-medium">{resourceData.resourceType}</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Publishing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Publish Event</span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Unchecked events are saved as drafts and won't be visible to users
              </p>
            </div>
          </div>
        </form>

        <div className="border-t border-gray-200 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }))}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
