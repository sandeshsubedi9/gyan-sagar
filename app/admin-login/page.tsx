"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, KeyRound, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(passkey);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Authentication failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background visual details (Harmonious premium dark mode look) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-slate-950 to-slate-950 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />

      {/* Login Card container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700/60 m-4">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-4 animate-pulse">
            <ShieldAlert className="h-8 w-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            GyanSagar Admin Portal
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            This area is restricted. Please enter the admin passkey to verify your identity.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Admin Passkey
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <KeyRound className="h-5 w-5" />
              </span>
              <input
                type={showPasskey ? "text" : "password"}
                placeholder="••••••••••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition duration-200 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPasskey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 font-medium mt-1.5 animate-bounce">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !passkey.trim()}
            className="w-full py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-950/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying Passkey...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Verify and Access
              </>
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-x-2 text-xs font-medium text-slate-400 hover:text-white transition duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
