export const FormInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  error, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getPaddingClasses = () => {
    let padding = "";
    if (Icon && type === "password") padding = "px-10";
    else if (Icon) padding = "pl-10 pr-4";
    else if (type === "password") padding = "pl-4 pr-10";
    else padding = "px-4";
    return padding;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          {label}
          {error && <span className="text-red-500 text-xs">• {error}</span>}
        </label>
      )}
      <div className={`relative transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
        {Icon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-orange-500' : 'text-slate-400'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
            ${getPaddingClasses()}
            ${error
              ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
              : isFocused
              ? 'border-orange-400 focus:ring-orange-400 focus:border-transparent'
              : 'border-slate-300 focus:ring-orange-400 focus:border-transparent'
            }
          `}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};