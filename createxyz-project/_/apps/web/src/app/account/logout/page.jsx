import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
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
          <h1 className="text-3xl font-bold text-[#1E1E1E] dark:text-white mb-2">Sign Out</h1>
          <p className="text-[#70757F] dark:text-[#A8ADB4]">Are you sure you want to sign out?</p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white py-3 px-6 rounded-2xl font-semibold hover:from-[#1E8169] hover:to-[#8AB05E] dark:hover:from-[#3BC4A3] dark:hover:to-[#A8C75C] transition-all duration-200"
        >
          Sign Out
        </button>

        <div className="mt-6">
          <a 
            href="/" 
            className="text-[#219079] dark:text-[#4DD0B1] hover:underline font-medium"
          >
            Cancel and return to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}