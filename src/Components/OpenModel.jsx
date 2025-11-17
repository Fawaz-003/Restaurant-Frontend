const OpenModel = ({
  isOpen,
  title,
  message,
  btnMessage,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800/10 flex justify-center items-center z-50">
      <div className="flex flex-col gap-5 items-center w-100 bg-gray-50 p-7 px-10 shadow-lg shadow-gray-400 rounded-xl">
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75"
              stroke="#DC2626"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-gray-900 font-semibold text-xl">{title}</h2>
        <p className="text-sm text-gray-600 text-center">{message}</p>
        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            {btnMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenModel;
