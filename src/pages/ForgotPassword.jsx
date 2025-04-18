export default function ForgotPassword() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
            <h2 className="text-2xl font-bold text-left w-full max-w-sm">Forget Password?</h2>
            <p className="mt-2 text-sm text-left w-full max-w-sm">Input email that you register</p>
            <div className="mt-4 w-full max-w-sm space-y-4">
                <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded" />
                <button className="bg-gray-400 text-white py-2 px-6 rounded">Next</button>
                <p className="text-center text-sm">
                    Already have an account? <a href="/login" className="text-indigo-600">Login now</a>
                </p>
            </div>
        </div>
    );
}
 