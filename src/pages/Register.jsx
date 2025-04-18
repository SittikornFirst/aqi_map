export default function Register() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
            <h2 className="text-2xl font-bold">Hello Register!</h2>
            <div className="mt-6 w-full max-w-sm space-y-4">
                <input type="text" placeholder="First Name" className="w-full p-3 border border-gray-300 rounded" />
                <input type="text" placeholder="Last Name" className="w-full p-3 border border-gray-300 rounded" />
                <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded" />
                <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded" />
                <button className="w-full bg-gray-400 text-white py-2 rounded">Register</button>
                <p className="text-center text-sm">
                    Already have an account? <a href="/login" className="text-indigo-600">Login now</a>
                </p>
            </div>
        </div>
    );
}
