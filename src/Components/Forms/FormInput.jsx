import React from "react";

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error,
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      )}
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white text-slate-800 transition focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-300 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      >
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent text-sm placeholder:text-slate-400"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

