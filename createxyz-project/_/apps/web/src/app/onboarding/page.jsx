import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [preferredName, setPreferredName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if user is not authenticated
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!preferredName.trim()) {
      setError("Please enter a preferred name");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferred_name: preferredName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferred name");
      }

      // Redirect to dashboard
      window.location.href = "/";
    } catch (err) {
      console.error("Error saving preferred name:", err);
      setError("Failed to save your preferred name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#219079] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#70757F] dark:text-[#A8ADB4]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://www.create.xyz/images/logoipsum/365"
              alt="AI Expert Hub Logo"
              className="w-8 h-8 mr-3"
            />
            <div>
              <span className="text-2xl font-bold text-[#1E1E1E] dark:text-white">
                AI Expert
              </span>
              <span className="text-2xl font-bold text-[#219079] dark:text-[#4DD0B1] ml-1">
                Hub
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1E1E1E] dark:text-white mb-4">
            Welcome to AI Expert Hub!
          </h1>
          <p className="text-[#70757F] dark:text-[#A8ADB4] mb-2">
            What would you like our AI professionals to call you?
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">
            This name will be used in all your conversations and can be changed
            later in settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
              Preferred Name
            </label>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl text-[#1E1E1E] dark:text-white placeholder-[#B4B4B4] dark:placeholder-[#70757F] focus:outline-none focus:border-[#219079] dark:focus:border-[#4DD0B1] transition-colors"
              placeholder="Enter your preferred name"
              required
              autoFocus
            />
            <p className="text-xs text-[#70757F] dark:text-[#A8ADB4] mt-2">
              Examples: Alex, Sarah, Dr. Smith, etc.
            </p>
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
            {loading ? "Saving..." : "Continue to AI Expert Hub"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-[#219079] dark:text-[#4DD0B1] hover:underline font-medium text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
