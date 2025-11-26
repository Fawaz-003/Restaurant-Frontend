const MenuCollection = ({ collection }) => (
  <div className="rounded-2xl border border-slate-200 p-6 text-left transition hover:border-slate-300">
    <p className="text-xs uppercase tracking-[0.4rem] text-amber-600">
      collection
    </p>
    <h3 className="mt-2 text-xl font-semibold text-slate-900">
      {collection.title}
    </h3>
    <p className="mt-1 text-sm text-slate-500">{collection.description}</p>
    <ul className="mt-4 space-y-2 text-sm text-slate-600">
      {collection.items.map((item) => (
        <li key={item}>• {item}</li>
      ))}
    </ul>
  </div>
);

export default MenuCollection;

