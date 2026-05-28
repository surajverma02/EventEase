import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, Upload } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { toast } from 'sonner';

const categories = [
  'TECHNOLOGY',
  'MUSIC',
  'SPORTS',
  'EDUCATION',
  'BUSINESS',
  'WORKSHOP',
  'ENTERTAINMENT',
  'CULTURAL',
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    category: 'TECHNOLOGY',
    startTime: '',
    endTime: '',
    maxAttendees: '',
    status: 'UPCOMING',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await eventsAPI.create({
        ...formData,
        maxAttendees: parseInt(formData.maxAttendees),
      });

      // Upload banner if provided
      if (bannerFile && response.data.id) {
        const formDataBanner = new FormData();
        formDataBanner.append('file', bannerFile);
        await eventsAPI.uploadBanner(response.data.id, formDataBanner);
      }

      toast.success('Event created successfully!');
      navigate('/events');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h1 className="text-2xl font-semibold text-[#0F172A]">Create New Event</h1>
          <p className="text-[#64748B] mt-1">Fill in the details to create a new event</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">
              Event Banner
            </label>
            <div className="relative">
              {bannerPreview ? (
                <div className="relative h-48 rounded-lg overflow-hidden border-2 border-[#E2E8F0]">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview('');
                    }}
                    className="absolute top-2 right-2 px-3 py-1 bg-white rounded-lg text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#E2E8F0] rounded-lg cursor-pointer hover:border-[#EA580C] transition-colors">
                  <Upload className="h-12 w-12 text-[#64748B] mb-2" />
                  <span className="text-sm font-medium text-[#64748B]">
                    Click to upload banner image
                  </span>
                  <span className="text-xs text-[#94A3B8] mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#0F172A] mb-2">
              Event Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#0F172A] mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent resize-none"
              placeholder="Enter event description"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#0F172A] mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[#0F172A] mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-[#0F172A] mb-2">
              Venue *
            </label>
            <input
              id="venue"
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              placeholder="Enter venue location"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-[#0F172A] mb-2">
                Start Time *
              </label>
              <input
                id="startTime"
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-[#0F172A] mb-2">
                End Time *
              </label>
              <input
                id="endTime"
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              />
            </div>
          </div>

          {/* Max Attendees */}
          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium text-[#0F172A] mb-2">
              Maximum Attendees *
            </label>
            <input
              id="maxAttendees"
              type="number"
              required
              min="1"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              placeholder="Enter maximum number of attendees"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-6 py-2.5 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-8 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
