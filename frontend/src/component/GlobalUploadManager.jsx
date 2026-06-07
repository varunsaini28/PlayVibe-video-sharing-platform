// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { removeUpload } from "../redux/uploadSlice";

// const STATUS_LABEL = {
//   uploading: "Uploading...",
//   completed: "Completed",
//   error: "Failed",
// };

// const GlobalUploadManager = () => {
//   const uploads = useSelector((state) => state.upload.uploads);
//   const dispatch = useDispatch();

//   // ✅ Warn user before closing tab during active upload
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (uploads.some((item) => item.status === "uploading")) {
//         e.preventDefault();
//         e.returnValue = "Uploads are in progress. Are you sure you want to leave?";
//       }
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [uploads]);

//   // ✅ Auto-remove completed uploads after 4 seconds
//   useEffect(() => {
//     uploads.forEach((upload) => {
//       if (upload.status === "completed") {
//         const timer = setTimeout(() => {
//           dispatch(removeUpload(upload.id));
//         }, 4000);
//         return () => clearTimeout(timer);
//       }
//     });
//   }, [uploads, dispatch]);

//   if (!uploads.length) return null;

//   return (
//     <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-80">
//       {uploads.map((upload) => (
//         <div
//           key={upload.id}
//           className="bg-[#111827] border border-gray-700 rounded-2xl p-4 shadow-xl text-white"
//         >
//           {/* Header */}
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-semibold">{upload.label}</p>
//               <p
//                 className={`text-xs mt-0.5 ${
//                   upload.status === "error"
//                     ? "text-red-400"
//                     : upload.status === "completed"
//                     ? "text-green-400"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {STATUS_LABEL[upload.status] ?? upload.status}
//               </p>
//             </div>

//             {/* ✅ Only show X when not actively uploading */}
//             {upload.status !== "uploading" && (
//               <button
//                 onClick={() => dispatch(removeUpload(upload.id))}
//                 className="text-gray-400 hover:text-white text-lg leading-none shrink-0"
//                 type="button"
//                 aria-label="Dismiss"
//               >
//                 ×
//               </button>
//             )}
//           </div>

//           {/* Progress bar */}
//           <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
//             <div
//               className={`h-full rounded-full transition-all duration-300 ${
//                 upload.status === "error"
//                   ? "bg-red-500"
//                   : upload.status === "completed"
//                   ? "bg-green-500"
//                   : "bg-blue-500"
//               }`}
//               style={{ width: `${Math.min(upload.progress ?? 0, 100)}%` }}
//             />
//           </div>

//           {/* Footer */}
//           <div className="mt-1.5 flex justify-between text-[11px] text-gray-400">
//             <span>{Math.min(upload.progress ?? 0, 100)}%</span>
//             {upload.status === "uploading" && upload.progress < 100 && (
//               <span>please don't close the tab</span>
//             )}
//             {upload.status === "uploading" && upload.progress >= 100 && (
//               <span>processing...</span>
//             )}
//             {upload.error && (
//               <span className="text-red-400 truncate max-w-[180px]">
//                 {upload.error}
//               </span>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GlobalUploadManager;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUpload } from "../redux/uploadSlice";

const GlobalUploadManager = () => {
  const uploads = useSelector((state) => state.upload.uploads);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (uploads.some((item) => item.status === "uploading" || item.status === "compressing")) {
        e.preventDefault();
        e.returnValue = "Upload in progress. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [uploads]);

  useEffect(() => {
    uploads.forEach((upload) => {
      if (upload.status === "completed") {
        const timer = setTimeout(() => dispatch(removeUpload(upload.id)), 4000);
        return () => clearTimeout(timer);
      }
    });
  }, [uploads, dispatch]);

  if (!uploads.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-80">
      {uploads.map((upload) => {
        const isActive = upload.status === "uploading" || upload.status === "compressing";
        const isCompressing = upload.status === "compressing";
        const isCompleted = upload.status === "completed";
        const isError = upload.status === "error";

        const statusLabel = isCompressing
          ? "Compressing..."
          : upload.status === "uploading"
          ? "Uploading..."
          : isCompleted
          ? "Completed"
          : isError
          ? "Failed"
          : upload.status;

        const barColor = isError
          ? "bg-red-500"
          : isCompleted
          ? "bg-green-500"
          : isCompressing
          ? "bg-yellow-400"
          : "bg-blue-500";

        const progress = Math.min(upload.progress ?? 0, 100);

        return (
          <div
            key={upload.id}
            className="bg-[#111827] border border-gray-700 rounded-2xl p-4 shadow-xl text-white"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{upload.label}</p>
                <p
                  className={`text-xs mt-0.5 ${
                    isError
                      ? "text-red-400"
                      : isCompleted
                      ? "text-green-400"
                      : isCompressing
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {statusLabel}
                </p>
              </div>
              {!isActive && (
                <button
                  onClick={() => dispatch(removeUpload(upload.id))}
                  className="text-gray-400 hover:text-white text-lg leading-none shrink-0"
                  type="button"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Footer */}
            <div className="mt-1.5 flex justify-between text-[11px] text-gray-400">
              <span>{progress}%</span>
              {isCompressing && (
                <span className="text-yellow-400">reducing file size...</span>
              )}
              {upload.status === "uploading" && progress < 100 && (
                <span>please don't close the tab</span>
              )}
              {upload.status === "uploading" && progress >= 100 && (
                <span>processing...</span>
              )}
              {upload.error && (
                <span className="text-red-400 truncate max-w-[180px]">{upload.error}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalUploadManager;