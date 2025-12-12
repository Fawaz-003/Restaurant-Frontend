import { useState } from "react";
import { MapPin, Phone, CheckCircle } from "lucide-react";
import { FormInput } from "./FormInput";

export const AddressForm = ({ initialData, onCancel, onSave }) => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.label?.trim()) newErrors.label = "Label is required";
    if (!form.phone?.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "Invalid phone number";
    if (!form.line1?.trim()) newErrors.line1 = "Street address is required";
    if (!form.line2?.trim()) newErrors.line2 = "City is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(form);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Label *"
          value={form.label}
          onChange={(e) => {
            setForm({ ...form, label: e.target.value });
            setErrors(prev => ({ ...prev, label: undefined }));
          }}
          placeholder="Home / Work"
          error={errors.label}
          icon={MapPin}
        />
        <FormInput
          label="Phone *"
          value={form.phone}
          onChange={(e) => {
            setForm({ ...form, phone: e.target.value });
            setErrors(prev => ({ ...prev, phone: undefined }));
          }}
          placeholder="Phone number"
          error={errors.phone}
          icon={Phone}
        />
      </div>

      <FormInput
        label="Address Line 1 *"
        value={form.line1}
        onChange={(e) => {
          setForm({ ...form, line1: e.target.value });
          setErrors(prev => ({ ...prev, line1: undefined }));
        }}
        placeholder="Street, House no."
        error={errors.line1}
      />

      <FormInput
        label="Address Line 2 *"
        value={form.line2}
        onChange={(e) => {
          setForm({ ...form, line2: e.target.value });
          setErrors(prev => ({ ...prev, line2: undefined }));
        }}
        placeholder="City, State, Pincode"
        error={errors.line2}
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
              Save Address
            </>
          )}
        </button>
      </div>
    </div>
  );
};