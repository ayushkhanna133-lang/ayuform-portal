import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-100 pt-16 pb-8 border-t border-blue-900 mt-12 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/50">
                <GraduationCap size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">AyuForm<span className="text-blue-400">Portal</span></span>
            </div>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Your trusted partner for the latest government job updates, exam results, syllabus, and detailed recruitment notifications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-blue-200/80">
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Latest Jobs</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Admit Cards</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Results</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Syllabus</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Legal Information</h4>
            <ul className="space-y-3 text-sm text-blue-200/80">
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-blue-200/80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <span>New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400 shrink-0" />
                <a href="mailto:contact@ayuform.com" className="hover:text-white transition-colors">contact@ayuform.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400 shrink-0" />
                <span>+91 (800) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-200/60">
          <p>© {new Date().getFullYear()} AyuForm Portal. All rights reserved.</p>
          <p>Designed with clean code and glassmorphism UI.</p>
        </div>
      </div>
    </footer>
  );
}
