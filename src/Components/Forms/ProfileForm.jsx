import { useState } from "react";
import { User, Phone, Mail, CheckCircle } from "lucide-react";
import { FormInput } from "./FormInput";

export const ProfileForm = ({ initialData, onCancel, onSave }) => {
  const [form, setForm] = useState(initialData || {
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Name is required";
    if (!form.email?.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phone?.trim()) newErrors.phone = "Phone is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(form);
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Name *"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          icon={User}
        />
        <FormInput
          label="Phone *"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          icon={Phone}
        />
      </div>
      
      <FormInput
        label="Email *"
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        icon={Mail}
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};