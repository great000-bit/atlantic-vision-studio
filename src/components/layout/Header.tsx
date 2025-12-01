import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { 
    name: "Creators", 
    path: "/creators",
    dropdown: [
      { name: "Join Collective", path: "/creators" },
      { name: "Artist Portal", path: "/portal" },
    ]
  },
  { name: "Studios", path: "/studios" },
  { name: "Events", path: "/events" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Atlantic Creators Logo" className="h-10 w-10 object-contain" />
            <span className="font-logo text-xl md:text-2xl tracking-wide text-foreground">
              Atlantic Creators
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.path} className="relative">
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                      className={`flex items-center gap-1 font-body text-sm tracking-wide transition-colors duration-300 ${
                        location.pathname === link.path || location.pathname === "/portal"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.name}
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`block px-4 py-3 text-sm transition-colors ${
                                location.pathname === item.path
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`font-body text-sm tracking-wide transition-colors duration-300 link-underline ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="btn-gold text-sm uppercase tracking-wider"
            >
              Book a Project
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.dropdown ? (
                      <div>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                          className={`w-full flex items-center justify-between py-2 font-body text-lg transition-colors ${
                            location.pathname === link.path
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {link.name}
                          <ChevronDown 
                            size={18} 
                            className={`transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 border-l border-border ml-2"
                            >
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  className={`block py-2 font-body text-base transition-colors ${
                                    location.pathname === item.path
                                      ? "text-primary"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block py-2 font-body text-lg transition-colors ${
                          location.pathname === link.path
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4"
                >
                  <Link to="/contact" className="btn-gold inline-block text-sm uppercase tracking-wider">
                    Book a Project
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
