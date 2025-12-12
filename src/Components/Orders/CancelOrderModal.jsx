import { useState } from "react";
import { X, AlertTriangle, XCircle } from "lucide-react";

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId, isLoading }) => {
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const commonReasons = [
    "Changed my mind",
    "Found a better deal",
    "Order placed by mistake",
    "Item not needed anymore",
    "Delivery time too long",
    "Other",
  ];

  // Reset form when modal closes
  const handleClose = () => {
    setReason("");
    setSelectedReason("");
    onClose();
  };

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other" ? reason : selectedReason || reason;
    if (!finalReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }
    onConfirm(finalReason);
    // Reset form after confirmation
    setReason("");
    setSelectedReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cancel Order</h3>
                <p className="text-sm text-slate-500">Order #{orderId}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Once cancelled, this action cannot be undone. Admin and seller will be notified. You will receive a refund if payment was made.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {commonReasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedReason(r);
                      if (r !== "Other") setReason("");
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${
                      selectedReason === r
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {selectedReason === "Other" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Please specify <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || (!selectedReason && !reason.trim())}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;

