export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      <h2 className="text-2xl font-bold">Hello Register!</h2>
      <div className="mt-6 w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="First Name"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <input
          type="email"
          placeholder="Email"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white px-3 py-1.5 rounded">
          Register
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-800">
            Login now
          </a>
        </p>
      </div>
    </div>
  );
}
