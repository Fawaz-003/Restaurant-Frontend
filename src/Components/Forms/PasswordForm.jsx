import { useState } from "react";
import { Lock, CheckCircle } from "lucide-react";
import { FormInput } from "./FormInput";

export const PasswordForm = ({ onCancel, onSave }) => {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.current) newErrors.current = "Current password is required";
    if (!form.newPass) newErrors.newPass = "New password is required";
    else if (form.newPass.length < 6) newErrors.newPass = "Password must be at least 6 characters";
    if (!form.confirm) newErrors.confirm = "Please confirm your password";
    else if (form.newPass !== form.confirm) newErrors.confirm = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onSave(form);
      setForm({ current: "", newPass: "", confirm: "" });
    }, 1500);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">Password Updated!</h4>
        <p className="text-slate-600">Your password has been changed successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormInput
        label="Current Password *"
        type="password"
        value={form.current}
        onChange={(e) => {
          setForm({ ...form, current: e.target.value });
          setErrors(prev => ({ ...prev, current: undefined }));
        }}
        placeholder="Enter current password"
        error={errors.current}
        icon={Lock}
      />

      <FormInput
        label="New Password *"
        type="password"
        value={form.newPass}
        onChange={(e) => {
          setForm({ ...form, newPass: e.target.value });
          setErrors(prev => ({ ...prev, newPass: undefined }));
        }}
        placeholder="Enter new password"
        error={errors.newPass}
      />

      <FormInput
        label="Confirm New Password *"
        type="password"
        value={form.confirm}
        onChange={(e) => {
          setForm({ ...form, confirm: e.target.value });
          setErrors(prev => ({ ...prev, confirm: undefined }));
        }}
        placeholder="Confirm new password"
        error={errors.confirm}
      />

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Password requirements:</strong> At least 6 characters with a mix of letters and numbers.
        </p>
      </div>

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
              Updating...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Update Password
            </>
          )}
        </button>
      </div>
    </div>
  );
};