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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
        <div
          className="relative bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-[90vw] sm:max-w-md lg:max-w-lg transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-slate-200">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
                  Cancel Order
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                  Order #{orderId?.substring(0, 20)}{orderId?.length > 20 ? "..." : ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Note Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                <strong className="font-semibold">Note:</strong> Once cancelled, this action cannot be undone. Admin and seller will be notified. You will receive a refund if payment was made.
              </p>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2 sm:mb-3">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 sm:space-y-2.5">
                {commonReasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedReason(r);
                      if (r !== "Other") setReason("");
                    }}
                    disabled={isLoading}
                    className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base ${
                      selectedReason === r
                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                    } ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Reason Textarea */}
            {selectedReason === "Other" && (
              <div>
                <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2 sm:mb-3">
                  Please specify <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason..."
                  rows={3}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-xs text-slate-500 mt-1.5 sm:mt-2">
                  Please provide a detailed reason for cancellation.
                </p>
              </div>
            )}

            {/* Error Message if no reason selected */}
            {!selectedReason && !reason.trim() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-red-700">
                  Please select or enter a reason for cancellation.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 lg:p-6 border-t border-slate-200">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
            >
              Keep Order
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || (!selectedReason && !reason.trim())}
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Cancel Order</span>
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