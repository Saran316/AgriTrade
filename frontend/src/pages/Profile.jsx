import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.get("/users/me");
            setProfile(response.data);
        } catch (error) {
            console.error("Unable to load profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-20 text-center">
                <div className="text-5xl">👤</div>
                <p className="mt-4 text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <p className="text-sm font-semibold uppercase tracking-wide text-green-100">
                        AgriTrade
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        My Profile
                    </h1>

                    <p className="mt-3 text-green-50">
                        Manage your account information.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-3xl px-6 py-10">

                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

                    <div className="flex items-center gap-5 border-b pb-6">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                            👤
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {profile?.name}
                            </h2>

                            <p className="mt-1 text-gray-500">
                                {profile?.email}
                            </p>
                        </div>

                    </div>

                    <div className="mt-8 space-y-5">

                        <div>
                            <p className="text-sm text-gray-500">
                                Full Name
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                                {profile?.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Email Address
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                                {profile?.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Role
                            </p>

                            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {profile?.role || "USER"}
              </span>
                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
}

export default Profile;