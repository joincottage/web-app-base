export default function ReviewTaskEmptyState() {
  return (
    <div className="my-2 w-[15rem] bg-gray-50 border-2 border-white rounded-lg animate-pulse">
      <div className="mx-4 mt-4 flex justify-between">
        <div className="">
          <div className="mb-2 h-4 w-44 bg-gray-200 rounded"></div>
          <div className="mb-2 h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="ml-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </div>
      </div>
      <div className="mt-2 mx-4 mb-4 h-5 w-52 bg-gray-200 rounded"></div>
    </div>
  );
}
