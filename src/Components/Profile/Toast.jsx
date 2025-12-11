import { CheckCircle } from "lucide-react";

export const Toast = ({ message, type = "success", onClose }) => (
  <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slideIn ${
    type === "success" 
      ? "bg-green-50 border border-green-200 text-green-800" 
      : "bg-blue-50 border border-blue-200 text-blue-800"
  }`}>
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  </div>
);