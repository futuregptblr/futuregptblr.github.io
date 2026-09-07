import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Calendar } from 'lucide-react';
import {
  apiAdminListMonthlyEvents,
  apiCreateEvent,
  apiCreateEventResource,
  apiUpdateEvent,
  apiDeleteEvent,
  apiCloudinarySign,
  type EventDto,
} from '../../lib/api';
import { MonthlyEventCard } from './MonthlyEventCard';
import { MonthlyEventForm } from './MonthlyEventForm';

interface MonthlyEventsManagementProps {
  token?: string | null;
}

export function MonthlyEventsManagement({ token }: MonthlyEventsManagementProps) {
  const [monthlyEvents, setMonthlyEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);

  useEffect(() => {
    loadMonthlyEvents();
  }, []);

  async function loadMonthlyEvents() {
    try {
      setLoading(true);
      if (!token) {
        setMonthlyEvents([]);
        return;
      }

      const events = await apiAdminListMonthlyEvents(token);
      setMonthlyEvents(events);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load monthly events');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File, folder = 'futuregpt/events'): Promise<string> {
    if (!token) throw new Error('Not authenticated');
    const sign = await apiCloudinarySign(token, { folder });

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sign.apiKey);
    form.append('timestamp', String(sign.timestamp));
    form.append('folder', sign.folder);
    form.append('signature', sign.signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      {
        method: 'POST',
        body: form,
      },
    );
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.secure_url as string;
  }

  function openCreateForm() {
    setEditingEvent(null);
    setFormOpen(true);
  }

  function openEditForm(event: EventDto) {
    setEditingEvent(event);
    setFormOpen(true);
  }

  async function handleDelete(event: EventDto) {
    if (!event._id) return;
    if (!window.confirm('Delete this monthly event?')) return;

    try {
      setLoading(true);
      if (token) {
        await apiDeleteEvent(token, event._id);
      }
      toast.success('Monthly event deleted');
      await loadMonthlyEvents();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Monthly Events Management</h2>
          <p className="text-gray-600 mt-1">
            Manage completed FutureGPT Monthly Meetups and the resources shared by their speakers.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Monthly Event
        </button>
      </div>

      {/* Events Grid */}
      {monthlyEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-4">No monthly events yet.</p>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Monthly Event
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monthlyEvents.map((event) => (
            <MonthlyEventCard
              key={event._id}
              event={event}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <MonthlyEventForm
        event={editingEvent}
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEvent(null);
        }}
        isLoading={loading}
        onSubmit={async (formData: any) => {
          if (!token) return;
          try {
            setLoading(true);

            let bannerImageUrl = editingEvent?.image || '';

            // Handle banner image upload
            if (formData.bannerFile) {
              bannerImageUrl = await handleUpload(formData.bannerFile, 'futuregpt/events');
            }

            const payload: Partial<EventDto> = {
              title: formData.title,
              description: formData.description || undefined,
              domain: formData.domain || undefined,
              isMonthlyEvent: true,
              published: formData.published,
              image: bannerImageUrl || undefined,
              speaker: {
                name: formData.speakerName || undefined,
                linkedinUrl: formData.speakerLinkedin || undefined,
              },
            };

            let savedEvent: EventDto | null = editingEvent ?? null;

            if (editingEvent && editingEvent._id) {
              savedEvent = await apiUpdateEvent(token, editingEvent._id, payload);
              toast.success('Monthly event updated');
            } else {
              savedEvent = await apiCreateEvent(token, payload);
              toast.success('Monthly event created');
            }

            if (!savedEvent?._id) {
              throw new Error('Monthly event was not saved successfully');
            }

            // Handle resource file upload after the event exists, so it is attached to the right event
            if (formData.resource?.resourceFile) {
              try {
                const resourceSign = await apiCloudinarySign(token, {
                  folder: 'futuregpt/event-resources',
                  resource_type: 'raw',
                });

                const resourceForm = new FormData();
                resourceForm.append('file', formData.resource.resourceFile);
                resourceForm.append('api_key', resourceSign.apiKey);
                resourceForm.append('timestamp', String(resourceSign.timestamp));
                resourceForm.append('folder', resourceSign.folder);
                resourceForm.append('signature', resourceSign.signature);
                resourceForm.append('resource_type', 'raw');

                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${resourceSign.cloudName}/raw/upload`,
                  {
                    method: 'POST',
                    body: resourceForm,
                  },
                );

                if (!res.ok) {
                  const errorData = await res.json().catch(() => ({}));

                  if (res.status === 400 && errorData.error?.message?.includes('size')) {
                    throw new Error(
                      'File exceeds the storage provider limit. ' +
                      'The current maximum file size for uploads is 10 MB. ' +
                      'Please reduce the file size or contact support.'
                    );
                  }

                  throw new Error(
                    errorData.error?.message ||
                    'Resource upload failed. Please check the file format and try again.'
                  );
                }

                const json = await res.json();
                const resourceFileUrl = json.secure_url as string;

                const resourceTypeMap: Record<string, string> = {
                  ppt: 'ppt',
                  pptx: 'ppt',
                  pdf: 'pdf',
                  doc: 'doc',
                  docx: 'doc',
                  notes: 'notes',
                };

                await apiCreateEventResource(token, savedEvent._id, {
                  title: formData.resource.resourceTitle || formData.title,
                  type: resourceTypeMap[formData.resource.resourceType] || 'notes',
                  fileUrl: resourceFileUrl,
                  speaker: {
                    name: formData.speakerName || undefined,
                    linkedinUrl: formData.speakerLinkedin || undefined,
                  },
                  isPublic: true,
                  requiresAuthentication: true,
                });
              } catch (uploadError: any) {
                throw new Error(`Resource upload failed: ${uploadError.message}`);
              }
            }

            await loadMonthlyEvents();
            setFormOpen(false);
            setEditingEvent(null);
          } catch (error: any) {
            toast.error(error.message || 'Failed to save monthly event');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
