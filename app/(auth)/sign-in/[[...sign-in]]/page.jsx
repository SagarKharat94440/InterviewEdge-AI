import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        {/* Left Side */}
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-60">
            <div>
              <h2 className="text-5xl font-extrabold text-white leading-snug mb-6">
                Interviewedge <span className="text-blue-400">AI</span>
              </h2>
              <p className="max-w-xl text-lg text-gray-200 space-y-2 leading-relaxed">
                Prepare Smart. Perform Boldly. <br />
                Great opportunities don’t just happen — <br className="hidden sm:block" />
                you prepare for them.
                <br /><br />
                Interviewedge AI is your intelligent interview coach — built to sharpen your skills, boost your confidence, and help you stand out in every conversation.
              </p>

              <div className="mt-6 text-xl text-gray-100 space-y-1">
                <p>🚀 <span className="font-medium">Step in ready.</span></p>
                <p>🎯 <span className="font-medium">Practice with purpose.</span></p>
                <p>💼 <span className="font-medium">Land your dream role.</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Sign In) */}
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                Interviewedge AI
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
            </div>

            {/* Clerk SignIn Component */}
            <div className="mt-6">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
