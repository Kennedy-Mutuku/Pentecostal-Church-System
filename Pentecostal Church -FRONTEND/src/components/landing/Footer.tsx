import { useState, useRef, useEffect } from "react";
import { getBaseUrl } from "../../config/environment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, X } from "lucide-react";
import cuLogo from "../../assets/RPC logo updated document.png";
import dominionLogo from "../../assets/dominion softwares main logo.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Sermons", href: "/sermons" },
  { label: "Our Choirs", href: "/choirs" },
  { label: "Online Giving", href: "/financial" },
  { label: "Ministries", href: "/ministries" },
  { label: "Leadership", href: "/leadership" },
  { label: "Contact Us", href: "/contact-us" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/18rhcZ1XpA/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/rpc_nyamira", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@savedbychriststainedbylove", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com/rpcnyamira", label: "Twitter" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const isPatronDashboard = location.pathname.startsWith("/patron");

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowAdminPanel(false); setActiveOption(null); setPassword(""); setError("");
      }
    };
    if (showAdminPanel) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAdminPanel]);

  useEffect(() => {
    if (activeOption) setTimeout(() => inputRef.current?.focus(), 30);
  }, [activeOption]);

  const handleOptionClick = (option) => {
    setActiveOption(option); setPassword(""); setError("");
  };

  const triggerAccess = (option: string | null, pwd: string) => {
    if (option === "media" && pwd === "Media.") {
      setShowAdminPanel(false); setActiveOption(null); setPassword(""); setError("");
      navigate("/media-admin");
    } else if (option === "super" && pwd === "Super.") {
      setShowAdminPanel(false); setActiveOption(null); setPassword(""); setError("");
      fetch(getBaseUrl() + "/patron/quick-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ masterPassword: "Super." }),
      }).then(() => {
        window.location.href = "/patron";
      }).catch(() => {
        window.location.href = "/patron";
      });
    }
  };

  const handlePasswordChange = (e: any) => {
    const val = e.target.value;
    setPassword(val);
    setError("");
    triggerAccess(activeOption, val);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    triggerAccess(activeOption, password);
  };

  return (
    <footer className="bg-[#121212] text-white border-t border-white/5">
      {!isPatronDashboard && (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-gray-300 hover:text-[#9B6FD1] hover:underline underline-offset-4 transition-colors text-sm">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#9B6FD1] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400">P.O BOX 408-40200<br />Kisii, Kenya</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#9B6FD1] flex-shrink-0" />
                  <a href="tel:+254762053876" className="text-sm text-gray-400 hover:text-white transition-colors">+254 762 053 876</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[#9B6FD1] flex-shrink-0" />
                  <a href="mailto:communityofbelieversinjesus@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors break-all">communityofbelieversinjesus@gmail.com</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8A5CC4] hover:text-white hover:scale-110 transition-all duration-200">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
              <p className="text-sm text-gray-400">A ministry of <span className="font-semibold text-white">Kisii Pentecostal Churches</span></p>
              <p className="text-xs text-gray-500 mt-1">Spreading the Gospel of Grace</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
            <p>Rikuruma Pentecostal Church &copy; {currentYear}</p>
            <div className="flex items-center gap-4 text-xs">
              <div className="relative" ref={panelRef}>
                <button onClick={() => { setShowAdminPanel(v => !v); setActiveOption(null); setPassword(""); setError(""); }}
                  className="hover:text-white transition-colors">
                  Admin
                </button>

                {showAdminPanel && (
                  <div className="absolute bottom-8 right-0 w-52 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    style={{ animation: "panelIn 0.15s ease" }}>
                    <style>{`@keyframes panelIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}`}</style>

                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                      <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Admin</span>
                      <button onClick={() => { setShowAdminPanel(false); setActiveOption(null); setPassword(""); setError(""); }}
                        className="text-white/30 hover:text-white transition-colors"><X size={13} /></button>
                    </div>

                    {!activeOption ? (
                      <div className="p-2 space-y-1">
                        <button onClick={() => handleOptionClick("media")}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                          Media
                        </button>
                        <button onClick={() => handleOptionClick("super")}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                          Super
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <button type="button" onClick={() => { setActiveOption(null); setPassword(""); setError(""); }}
                            className="text-white/30 hover:text-white text-xs transition-colors">&larr;</button>
                          <span className="text-xs text-white/60 font-semibold">{activeOption === "media" ? "Media" : "Super"}</span>
                        </div>
                        <input ref={inputRef} type="password" value={password}
                          onChange={handlePasswordChange}
                          placeholder="Password..."
                          autoComplete="off"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#8A5CC4] transition-colors" />
                        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                      </form>
                    )}
                  </div>
                )}
              </div>
              <p>Established 2002</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center">
          <a href="https://dominionsoftwares.org/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors group">
            <span>Software by</span>
            <img src={dominionLogo} alt="Dominion Softwares" className="h-5 w-auto opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-semibold tracking-wide">Dominion Softwares</span>
          </a>
        </div>
      </div>

      <div style={{ height: "4px", background: "linear-gradient(90deg,#2B0F4A,#482078,#8A5CC4,#482078,#2B0F4A)" }} />
    </footer>
  );
};

export default Footer;



