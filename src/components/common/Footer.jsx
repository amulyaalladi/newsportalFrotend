
	const Footer = () => {
		return (
			<footer className="bg-slate-950 text-slate-300">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
						<div className="flex items-center gap-4">
							<a href="/" className="text-lg font-semibold text-white">
								Daily<span className="text-red-600">Pulse</span>
							</a>
							<p className="text-sm text-slate-400">© {new Date().getFullYear()} DailyPulse. All rights reserved.</p>
						</div>

						<div className="flex flex-col items-center gap-4 sm:flex-row">
							<nav className="flex gap-4 text-sm">
								<a href="/about" className="hover:text-white transition">About</a>
								<a href="/contact" className="hover:text-white transition">Contact</a>
								<a href="/privacy" className="hover:text-white transition">Privacy</a>
							</nav>

							<div className="flex items-center gap-3">
								<a href="#" aria-label="Twitter" className="text-slate-300 hover:text-white">
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path d="M22 5.92c-.7.31-1.45.52-2.24.62.81-.48 1.43-1.24 1.72-2.15-.76.45-1.6.78-2.5.96A4.03 4.03 0 0015.5 4c-2.23 0-4.03 1.8-4.03 4.02 0 .32.04.63.1.93C7.7 9.81 4.07 7.86 1.64 4.9c-.35.6-.55 1.3-.55 2.05 0 1.41.72 2.65 1.82 3.38-.66-.02-1.28-.2-1.82-.5v.05c0 1.97 1.4 3.62 3.25 3.99-.34.09-.7.14-1.07.14-.26 0-.5-.03-.74-.07.5 1.56 1.95 2.7 3.66 2.73A8.08 8.08 0 012 19.54a11.4 11.4 0 006.29 1.84c7.55 0 11.69-6.26 11.69-11.69v-.53c.8-.58 1.48-1.3 2.02-2.12-.73.33-1.5.55-2.3.65z" />
									</svg>
								</a>
								<a href="#" aria-label="GitHub" className="text-slate-300 hover:text-white">
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.19-3.37-1.19-.45-1.14-1.11-1.45-1.11-1.45-.91-.62.07-.6.07-.6 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.1 2.94.84.09-.66.35-1.1.64-1.36-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.8c.85.01 1.7.11 2.5.32 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.72 0 .26.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
		);
	};

	

export default Footer;
