export default function Login() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
            <h2 className="text-center text-2xl font-bold">👤 Login</h2>
            <div className="mt-4 w-full max-w-sm space-y-4">
                {/* <div className="h-40 w-full bg-gray-300" /> */}
                <input type="text" placeholder="Email" className="w-full p-3 border border-gray-300 rounded" />
                <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded" />
                <div className="text-right text-sm">
                    <a href="/forgot-password" className="text-indigo-600">Forgot Password?</a>
                </div>
                <button className="w-full bg-gray-400 text-white py-2 rounded">Login</button>
                <p className="text-center text-sm">
                    Don’t have account? <a href="/register" className="text-indigo-600">Sign up</a>
                </p>
            </div>
        </div>
    );
}
