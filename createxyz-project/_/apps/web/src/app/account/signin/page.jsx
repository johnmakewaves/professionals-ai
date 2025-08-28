import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin: "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        OAuthCreateAccount: "Couldn't create an account with this sign-in method. Try another option.",
        EmailCreateAccount: "This email can't be used to create an account. It may already exist.",
        Callback: "Something went wrong during sign-in. Please try again.",
        OAuthAccountNotLinked: "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin: "Incorrect email or password. Try again or reset your password.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration: "Sign-in isn't working right now. Please try again later.",
        Verification: "Your sign-in link has expired. Request a new one.",
      };

      setError(errorMessages[err.message] || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://www.create.xyz/images/logoipsum/365"
              alt="AI Expert Hub Logo"
              className="w-8 h-8 mr-3"
            />
            <div>
              <span className="text-2xl font-bold text-[#1E1E1E] dark:text-white">AI Expert</span>
              <span className="text-2xl font-bold text-[#219079] dark:text-[#4DD0B1] ml-1">Hub</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1E1E1E] dark:text-white mb-2">Welcome Back</h1>
          <p className="text-[#70757F] dark:text-[#A8ADB4]">Sign in to continue your conversations with AI experts</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl text-[#1E1E1E] dark:text-white placeholder-[#B4B4B4] dark:placeholder-[#70757F] focus:outline-none focus:border-[#219079] dark:focus:border-[#4DD0B1] transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl text-[#1E1E1E] dark:text-white placeholder-[#B4B4B4] dark:placeholder-[#70757F] focus:outline-none focus:border-[#219079] dark:focus:border-[#4DD0B1] transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white py-3 px-6 rounded-2xl font-semibold hover:from-[#1E8169] hover:to-[#8AB05E] dark:hover:from-[#3BC4A3] dark:hover:to-[#A8C75C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#70757F] dark:text-[#A8ADB4]">
            Don't have an account?{" "}
            <a 
              href="/account/signup" 
              className="text-[#219079] dark:text-[#4DD0B1] hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}