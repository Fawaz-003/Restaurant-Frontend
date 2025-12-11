import { ChevronRight } from "lucide-react";

export const MenuItem = ({ icon: Icon, label, id, activeSection, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`group w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
      activeSection === id
        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
        : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg transition-all duration-300 ${
          activeSection === id
            ? "bg-white/20"
            : "bg-slate-100 group-hover:bg-orange-100 group-hover:text-orange-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-semibold">{label}</span>
    </div>

    <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
      activeSection === id ? "translate-x-1" : "group-hover:translate-x-1"
    }`} />
  </button>
);