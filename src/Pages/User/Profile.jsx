import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

const mockUser = {
  name: "Avery Patel",
  email: "avery@demo.com",
  favoriteCuisine: "Seasonal comfort food",
  memberSince: "July 2021",
};

const Profile = () => {
  const navigate = useNavigate();
  const { token, logout, userData } = useAppContext();
  const displayUser = userData || mockUser;

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4rem] text-amber-600">
            Account
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back, {displayUser.name?.split(" ")[0] || "Guest"}
          </h1>
          <p className="text-sm text-slate-500">
            This view represents the global profile layout shared across roles.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">
              Primary details
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              {displayUser.name}
            </h2>
            <p className="text-sm text-slate-500">{displayUser.email}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">
              Preferences
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              {displayUser.favoriteCuisine || mockUser.favoriteCuisine}
            </h2>
            <p className="text-sm text-slate-500">
              Member since {displayUser.memberSince || mockUser.memberSince}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-amber-600 hover:text-amber-600"
        >
          Sign out
        </button>
      </div>
    </section>
  );
};

export default Profile;

