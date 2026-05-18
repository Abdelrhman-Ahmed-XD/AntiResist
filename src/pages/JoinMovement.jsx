import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { signUp } from "../firebase/auth";
import { addSupporter } from "../firebase/firestore";

const SPECIALTIES = [
  "Doctor",
  "Pharmacist",
  "Nurse",
  "Medical Student",
  "Pharmacy Student",
  "Other",
];

const INITIAL = {
  name: "",
  email: "",
  password: "",
  confirm: "",
  specialty: "",
  workplace: "",
  comment: "",
};

export default function JoinMovement() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())             e.name      = "Full name is required.";
    if (!form.email.trim())            e.email     = "Email is required.";
    if (form.password.length < 6)      e.password  = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) e.confirm  = "Passwords do not match.";
    if (!form.specialty)               e.specialty = "Please select your specialty.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setLoading(true);
    try {
      const { user } = await signUp(form.email.trim(), form.password);
      await addSupporter(user.uid, {
        name:      form.name.trim(),
        specialty: form.specialty,
        workplace: form.workplace.trim(),
        comment:   form.comment.trim(),
      });
      toast.success("Welcome to AntiResist! Your profile is live.");
      navigate(`/profile/${user.uid}`);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({ email: "This email is already registered. Sign in instead." });
      } else {
        toast.error(err.message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen py-16">
        <div className="max-w-lg mx-auto px-4">

          {/* Card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="bg-primary px-8 py-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={20} strokeWidth={1.5} className="text-white/80" />
                <span className="text-white/80 text-sm font-medium">AntiResist Campaign</span>
              </div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                Join the movement
              </h1>
              <p className="text-white/70 text-sm leading-relaxed">
                Add your name to the wall of healthcare professionals fighting
                antimicrobial resistance across Egypt.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">

              {/* Full name */}
              <Field label="Full name" error={errors.name}>
                <input
                  type="text"
                  placeholder="Dr. Ahmed Hassan"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={input(errors.name)}
                />
              </Field>

              {/* Email */}
              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  placeholder="you@hospital.eg"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={input(errors.email)}
                />
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={input(errors.password) + " pr-11"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-dark"
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff size={16} strokeWidth={1.5} />
                      : <Eye    size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              </Field>

              {/* Confirm password */}
              <Field label="Confirm password" error={errors.confirm}>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  className={input(errors.confirm)}
                />
              </Field>

              {/* Specialty */}
              <Field label="Specialty" error={errors.specialty}>
                <select
                  value={form.specialty}
                  onChange={(e) => set("specialty", e.target.value)}
                  className={input(errors.specialty) + " bg-white"}
                >
                  <option value="">Select your specialty…</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              {/* Workplace (optional) */}
              <Field label="Workplace" hint="Optional" error={errors.workplace}>
                <input
                  type="text"
                  placeholder="Hospital or institution name"
                  value={form.workplace}
                  onChange={(e) => set("workplace", e.target.value)}
                  className={input(errors.workplace)}
                />
              </Field>

              {/* Comment (optional) */}
              <Field label="Your message" hint="Optional  shown on your public profile" error={errors.comment}>
                <textarea
                  rows={3}
                  placeholder="Why does fighting AMR matter to you?"
                  value={form.comment}
                  onChange={(e) => set("comment", e.target.value)}
                  className={input(errors.comment) + " resize-none"}
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal text-white font-medium py-3 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Creating your profile…" : "Join AntiResist"}
              </button>

              <p className="text-center text-sm text-secondary">
                Already registered?{" "}
                <Link to="/sign-in" className="text-primary hover:underline font-medium">
                  Sign in
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

function Field({ label, hint, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-dark">{label}</label>
        {hint && <span className="text-xs text-secondary">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

function input(hasError) {
  return [
    "w-full px-4 py-2.5 rounded-xl border text-sm text-dark placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors",
    hasError ? "border-danger" : "border-gray-200",
  ].join(" ");
}
