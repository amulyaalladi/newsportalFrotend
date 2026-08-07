




const ReadMorePopup = ({ open = false, onClose = () => {}, title = "Read more", content = "Here is some more information about this item.", actionLabel = "Close" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 p-6 text-slate-100 shadow-2xl shadow-slate-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">Learn more about this story and explore additional details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
          <p>{content}</p>
          <p>
            This popup can be used as a reusable component in the home page when a user wants to view the full article preview or read more details about a story.
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadMorePopup;
