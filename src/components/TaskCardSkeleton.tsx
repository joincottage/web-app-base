export default function TaskCardSkeleton() {
  return (
    <div className="px-4 py-4 w-full animate-pulse">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 bg-gray-200 rounded-full"></div>
          <div>
            <div className="mb-2 h-3 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-5 w-14 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-8">
        <div className="h-3 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="flex space-x-3">
          <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}
