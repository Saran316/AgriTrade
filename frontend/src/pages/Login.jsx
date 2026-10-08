import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, LoaderCircle } from "lucide-react";
import api from "../services/api";
import background from "../assets/agritrade-background.jpg";
import emblem from "../assets/agritrade-emblem.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(25, 8, 5, 0.35), rgba(25, 8, 5, 0.58)), url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-black/10" />

      <section className="relative w-full max-w-[460px] rounded-2xl border border-amber-400/80 bg-black/55 p-7 pt-20 shadow-2xl backdrop-blur-md sm:p-8 sm:pt-20">
        {/* Emblem */}
        <div className="absolute left-1/2 top-0 flex h-28 w-56 -translate-x-1/2 -translate-y-1/3 items-center justify-center rounded-t-full border-2 border-amber-400 bg-green-950/95 shadow-xl">
          <img
            src={emblem}
            alt="AgriTrade emblem"
            className="h-24 w-48 object-contain"
          />
        </div>

        {/* Inner border */}
        <div className="pointer-events-none absolute inset-3 rounded-xl border border-amber-500/40" />

        {/* Heading */}
        <div className="relative text-center">
          <h1 className="text-5xl font-black tracking-tight text-amber-300 sm:text-6xl">
            Agri<span className="text-amber-100">Trade</span>
          </h1>

          <p className="mt-3 text-[10px] font-semibold tracking-[0.25em] text-amber-100/80 sm:text-xs">
            AGRICULTURAL MARKETPLACE
          </p>

          <div className="my-5 flex items-center justify-center gap-3 border-y border-amber-500/40 py-3">
            <span className="text-amber-400">✦</span>
            <span className="text-sm font-semibold tracking-wider text-amber-100">
              FARMERS • BUYERS • GROWTH
            </span>
            <span className="text-amber-400">✦</span>
          </div>
        </div>

        {/* Form */}
        <div className="relative rounded-xl border border-amber-500/30 bg-black/25 p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-amber-400 bg-black/30 shadow-inner focus-within:ring-2 focus-within:ring-amber-300">
              <div className="flex h-full w-14 shrink-0 items-center justify-center bg-gradient-to-br from-amber-300 to-yellow-600 text-green-950">
                <Mail size={25} />
              </div>

              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-full w-full bg-transparent px-4 text-base font-medium text-white outline-none placeholder:text-white/70"
              />
            </div>

            {/* Password */}
            <div className="relative flex h-14 items-center overflow-hidden rounded-2xl border border-amber-400 bg-black/30 shadow-inner focus-within:ring-2 focus-within:ring-amber-300">
              <div className="flex h-full w-14 shrink-0 items-center justify-center bg-gradient-to-br from-amber-300 to-yellow-600 text-green-950">
                <KeyRound size={25} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full w-full bg-transparent px-4 pr-12 text-base font-medium text-white outline-none placeholder:text-white/70"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 rounded-lg p-2 text-amber-100/80 transition hover:bg-white/10 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-amber-200 underline-offset-4 hover:text-amber-100 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-400/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-amber-400 bg-gradient-to-b from-green-800 to-green-950 text-xl font-bold text-amber-200 shadow-lg transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={22} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/80">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-amber-300 underline underline-offset-4 hover:text-amber-100"
            >
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-5 border-t border-amber-500/40 pt-3 text-center text-xs text-amber-100/70">
          Secure access to your AgriTrade account
        </div>
      </section>

      <p className="absolute bottom-4 left-0 w-full text-center text-xs text-amber-100/80">
        © {new Date().getFullYear()} AgriTrade
      </p>
    </main>
  );
}

export default Login;
