export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">Loading Gallery</h2>
        <p className="text-gray-400">Please wait while we fetch your photos...</p>
      </div>
    </div>
  );
}