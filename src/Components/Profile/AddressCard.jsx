import { MapPin } from "lucide-react";

export const AddressCard = ({ address, onEdit }) => (
  <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-orange-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
          <MapPin className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            {address.label}
            {address.isDefault && (
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                Default
              </span>
            )}
          </h3>
          <p className="text-sm text-slate-500">{address.phone}</p>
        </div>
      </div>

      <button
        onClick={() => onEdit(address)}
        className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors duration-200 hover:scale-110 transform"
      >
        Edit
      </button>
    </div>

    <p className="text-slate-700">{address.line1}</p>
    <p className="text-slate-600 text-sm">{address.line2}</p>
  </div>
);