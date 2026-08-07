import registerBg from "../../assets/Register-image.png";
const EditorRegister = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${registerBg})`, filter: 'brightness(0.95)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-950/50 to-slate-950/55" />

        <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/85 p-8 shadow-2xl shadow-slate-950/25 backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <a href="/" className="text-xl font-semibold uppercase tracking-[0.4em] text-cyan-600">
              <span className="text-white">Daily</span> <span className="text-cyan-600 ">Pulse</span>
            </a>
            <h2 className="mt-4 text-xl font-semibold text-slate-950 sm:text-2xl">
              Editor Register
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Join our team of editors and contribute to shaping the news landscape. Fill out the form below to register as an editor and start making an impact in the world of journalism.
            </p>
          </div>
          <form className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                placeholder="Create a password"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Phone Number</span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Years of Experience</span>
              <input
                type="number"
                placeholder="Enter your years of experience"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Portfolio Link</span>
              <input
                type="text"
                placeholder="Enter your portfolio link"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Previous Company</span>
              <input
                type="text"
                placeholder="Enter your previous company"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <button type="submit" className="flex w-full items-center justify-center rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Register
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-cyan-600 transition hover:text-cyan-700">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorRegister;