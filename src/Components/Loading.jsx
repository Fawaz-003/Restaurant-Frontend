import { loaderColors } from "../../colors.js";

const Loading = ({ message = "Loading...", variant = "red" }) => {
  const color = loaderColors[variant] || loaderColors.red;

  return (
    <div className="fixed inset-0 bg-gray-800/10 flex justify-center items-center z-50">
      <div className="flex flex-row gap-5 bg-white p-7 px-10 shadow-2xl rounded-xl">
        {/* Spinner */}
        <div
          className={`w-7 h-7 border-5 rounded-full animate-spin bg-gradient-to-r
            ${color.top} ${color.right} ${color.bottom} ${color.left}`}
        ></div>
        {/* Message */}
        <p className="text-gray-900 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
