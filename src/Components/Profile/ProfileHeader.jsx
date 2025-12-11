import { Mail, Phone, Edit3 } from "lucide-react";

export const ProfileHeader = ({ user, onEditProfile, isLoaded }) => (
  <div className="bg-orange-500 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white/30">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold mb-2">{user.name}</h1>

            <div className="space-y-1">
              <p className="text-white/90 flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                {user.phone}
              </p>

              <p className="text-white/90 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="group flex items-center text-sm gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold border border-white/30 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Edit3 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          EDIT PROFILE
        </button>
      </div>
    </div>
  </div>
);