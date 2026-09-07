import { Edit2, Trash2, Eye } from 'lucide-react';
import type { EventDto } from '../../lib/api';

interface MonthlyEventCardProps {
  event: EventDto;
  onEdit: (event: EventDto) => void;
  onDelete: (event: EventDto) => void;
}

export function MonthlyEventCard({
  event,
  onEdit,
  onDelete,
}: MonthlyEventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Banner Image */}
      {event.image && (
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          {!event.published && (
            <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 rounded text-xs font-semibold">
              Draft
            </div>
          )}
          {event.published && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Published
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Event Title and Domain */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
            {event.title}
          </h3>
          {event.domain && (
            <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
              {event.domain}
            </p>
          )}
        </div>

        {/* Speaker Information */}
        {event.speaker?.name && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{event.speaker.name}</p>
            {event.speaker.linkedinUrl && (
              <a
                href={event.speaker.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View LinkedIn →
              </a>
            )}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs font-medium transition-colors"
            title="Edit event"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={() => onDelete(event)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition-colors"
            title="Delete event"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
