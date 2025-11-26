const ShopDetails = ({ shop }) => (
  <div className="space-y-4 rounded-3xl border border-slate-200 p-6">
    <div>
      <p className="text-xs uppercase tracking-[0.4rem] text-amber-600">
        Restaurant
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">
        {shop.name}
      </h1>
      <p className="mt-2 text-sm text-slate-500">{shop.description}</p>
    </div>

    <dl className="grid gap-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
      <div>
        <dt className="uppercase tracking-[0.3rem] text-slate-400">
          Delivery
        </dt>
        <dd className="mt-1 text-base font-semibold text-slate-900">
          {shop.deliveryTime}
        </dd>
      </div>
      <div>
        <dt className="uppercase tracking-[0.3rem] text-slate-400">
          Rating
        </dt>
        <dd className="mt-1 text-base font-semibold text-slate-900">
          ★ {shop.rating} ({shop.reviewsCount} reviews)
        </dd>
      </div>
      <div>
        <dt className="uppercase tracking-[0.3rem] text-slate-400">Cuisines</dt>
        <dd className="mt-1 text-base font-semibold text-slate-900">
          {shop.cuisines.join(", ")}
        </dd>
      </div>
    </dl>

    <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">
          Address
        </p>
        <p className="mt-1 font-medium text-slate-900">{shop.address}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">
          Hours
        </p>
        <p className="mt-1 font-medium text-slate-900">{shop.hours}</p>
      </div>
    </div>
  </div>
);

export default ShopDetails;

