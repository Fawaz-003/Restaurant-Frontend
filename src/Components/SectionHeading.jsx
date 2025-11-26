const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-2 text-center">
    {eyebrow && (
      <p className="text-xs uppercase tracking-[0.4rem] text-amber-600">
        {eyebrow}
      </p>
    )}
    <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
    {description && <p className="text-slate-500">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default SectionHeading;

