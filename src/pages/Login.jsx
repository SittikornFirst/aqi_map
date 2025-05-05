export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      <h2 className="text-center text-2xl font-bold">👤 Login</h2>
      <div className="mt-4 w-full max-w-sm space-y-4">
        {/* <div className="h-40 w-full bg-gray-300" /> */}
        <input
          type="text"
          placeholder="Email"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <div className="text-right text-sm">
          <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-800" >
            Forgot Password?
          </a>
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-700  text-white rounded px-3 py-1.5 text-base">
          Login
        </button>
        <p className="text-center text-sm ">
          Don’t have account?{" "}
          <a href="/register" className="text-indigo-600 hover:text-indigo-800">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
