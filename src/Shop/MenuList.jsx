const MenuList = ({ sections }) => (
  <div className="space-y-6">
    {sections.map((section) => (
      <div
        key={section.title}
        className="rounded-3xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {section.title}
          </h2>
          <span className="text-xs uppercase tracking-[0.4rem] text-slate-400">
            {section.items.length} items
          </span>
        </div>
        <ul className="mt-4 space-y-3">
          {section.items.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-600"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-400">Made-to-order</p>
              </div>
              <p className="font-semibold text-slate-900">{item.price}</p>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default MenuList;

