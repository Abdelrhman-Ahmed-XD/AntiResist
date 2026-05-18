import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { signIn, resetPassword } from "../firebase/auth";
import { getSupporter } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [resetting, setResetting] = useState(false);

  // Already signed in redirect away
  if (user) {
    navigate(`/profile/${user.uid}`, { replace: true });
    return null;
  }

  function validate() {
    const e = {};
    if (!email.trim())    e.email    = "Email is required.";
    if (!password)        e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const { user: u } = await signIn(email.trim(), password);
      // Resolve supporter doc to get the uid for profile link
      const supporter = await getSupporter(u.uid);
      toast.success("Welcome back!");
      navigate(supporter ? `/profile/${u.uid}` : "/");
    } catch (err) {
      const code = err.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setErrors({ email: "No account found with this email." });
      } else if (code === "auth/wrong-password") {
        setErrors({ password: "Incorrect password." });
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please wait a moment and try again.");
      } else {
        toast.error(err.message ?? "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setErrors({ email: "Enter your email above to reset your password." });
      return;
    }
    setResetting(true);
    try {
      await resetPassword(email.trim());
      toast.success("Password reset email sent check your inbox.");
    } catch {
      toast.error("Could not send reset email. Check the address and try again.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen py-16">
        <div className="max-w-md mx-auto px-4">

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="bg-primary px-8 py-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={20} strokeWidth={1.5} className="text-white/80" />
                <span className="text-white/80 text-sm font-medium">AntiResist Campaign</span>
              </div>
              <h1 className="text-2xl font-semibold text-white mb-1">Welcome back</h1>
              <p className="text-white/70 text-sm">Sign in to manage your profile and campaign contribution.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@hospital.eg"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className={inputCls(errors.email)}
                />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className="text-sm font-medium text-dark">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetting}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    {resetting ? "Sending…" : "Forgot password?"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                    className={inputCls(errors.password) + " pr-11"}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-dark"
                  >
                    {showPass
                      ? <EyeOff size={16} strokeWidth={1.5} />
                      : <Eye    size={16} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal text-white font-medium py-3 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <p className="text-center text-sm text-secondary">
                New to AntiResist?{" "}
                <Link to="/join" className="text-primary hover:underline font-medium">
                  Join the movement
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function inputCls(hasError) {
  return [
    "w-full px-4 py-2.5 rounded-xl border text-sm text-dark placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors",
    hasError ? "border-danger" : "border-gray-200",
  ].join(" ");
}
