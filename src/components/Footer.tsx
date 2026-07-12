import { FiGithub, FiTwitter, FiFacebook, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-peyara-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* brand */}
          <div>
            <h3 className="text-xl font-bold mb-3">Peyaraful Crowdfunding</h3>
            <p className="text-peyara-primary/80 text-sm">
              Empowering creators and supporters to bring amazing projects to life through crowdfunding.
            </p>
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-peyara-primary/80">
              <li>
                <a href="/" className="hover:text-peyara-primary transition">Home</a>
              </li>
              <li>
                <a href="/explore" className="hover:text-peyara-primary transition">Explore</a>
              </li>
              <li>
                <a href="/login" className="hover:text-peyara-primary transition">Login</a>
              </li>
              <li>
                <a href="/register" className="hover:text-peyara-primary transition">Register</a>
              </li>
            </ul>
          </div>

          {/* social */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/PeyaraFul"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-peyara-primary hover:text-peyara-dark transition"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-peyara-primary hover:text-peyara-dark transition"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-peyara-primary hover:text-peyara-dark transition"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-peyara-primary hover:text-peyara-dark transition"
              >
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-10 pt-6 border-t border-white/20 text-center text-sm text-peyara-primary/60">
          &copy; {new Date().getFullYear()} Peyaraful Crowdfunding. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
