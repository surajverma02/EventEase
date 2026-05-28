import { Info } from 'lucide-react';

export default function DemoCredentials() {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Mode</h4>
          <p className="text-xs text-blue-700 mb-3">
            This is a frontend demo. Use any credentials to login and explore the interface.
          </p>
          <div className="space-y-2 text-xs text-blue-700">
            <p><strong>Note:</strong> Backend API is not connected in this demo.</p>
            <p><strong>Tip:</strong> Try exploring the dashboard, events, and settings pages!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
