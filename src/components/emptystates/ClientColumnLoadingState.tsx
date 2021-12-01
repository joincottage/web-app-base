const clientTabPlaceholderStyle = {
  width: '119px',
  height: '72px',
  padding: '9px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function ClientColumnLoadingState() {
  return (
    <div className="animate-pulse">
      <div
        className="text-center text-gray-600 text-sm"
        style={clientTabPlaceholderStyle}
      >
        All
      </div>
      <div
        className="flex flex-col justify-center w-14"
        style={clientTabPlaceholderStyle}
      >
        <div className="mb-2 mx-auto bg-gray-200 w-6 h-6 rounded-full"></div>
        <div className="bg-gray-200 w-full h-3 rounded"></div>
      </div>
      <div
        className="flex flex-col justify-center w-14"
        style={clientTabPlaceholderStyle}
      >
        <div className="mb-2 mx-auto bg-gray-200 w-6 h-6 rounded-full"></div>
        <div className="bg-gray-200 w-full h-3 rounded"></div>
      </div>
      <div
        className="flex flex-col justify-center w-14"
        style={clientTabPlaceholderStyle}
      >
        <div className="mb-2 mx-auto bg-gray-200 w-6 h-6 rounded-full"></div>
        <div className="bg-gray-200 w-full h-3 rounded"></div>
      </div>
    </div>
  );
}
