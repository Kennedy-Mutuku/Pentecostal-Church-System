import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import cuLogo from '../../assets/RPC logo updated document.png';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Philosophies', href: '/philosophy' },
  { label: 'Financials', href: '/financial' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Gallery', href: '/media' },
  { label: 'Talk to us', href: '/recomendations' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/share/18rhcZ1XpA/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/rpc_nyamira', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@savedbychriststainedbylove', label: 'YouTube' },
  { icon: Twitter, href: 'https://twitter.com/rpcnyamira', label: 'Twitter' },
];


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isPatronDashboard = location.pathname.startsWith('/patron') || location.pathname.startsWith('/assistant-patron');

  return (
    <footer className="bg-[#121212] text-white border-t border-white/5">
      {/* Main Footer Content */}
      {!isPatronDashboard && (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={cuLogo} alt="RPC Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              <div>
                <h3 className="font-bold text-lg">RPC Nyamira</h3>
                <p className="text-sm text-gray-400">Nyamira</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Producing relevant and effective Christians to the church and society through equipping, empowering and offering a conducive environment for effective living.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#E53935] hover:underline underline-offset-4 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-[#E53935] hover:underline underline-offset-4 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#E53935] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  P.O BOX 408-40200<br />Kisii, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#E53935] flex-shrink-0" />
                <a href="tel:+254762053876" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +254 762 053 876
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#E53935] flex-shrink-0" />
                <a href="mailto:communityofbelieversinjesus@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors break-all">
                  communityofbelieversinjesus@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Affiliation */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C62828] hover:text-white hover:scale-115 transition-all duration-200"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-gray-400">
              A ministry of <span className="font-semibold text-white">Kisii Pentecostal Churches</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Spreading the Gospel of Grace
            </p>
          </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
            <p>
              Rikuruma Pentecostal Church &#169; {currentYear}
            </p>
            <p className="text-xs">Established 2002</p>
          </div>
        </div>
      </div>

      {/* Bottom accent line - Crimson Red Theme Gradient */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #880000, #C62828, #E53935, #C62828, #880000)' }} />
    </footer>
  );
};

export default Footer;
