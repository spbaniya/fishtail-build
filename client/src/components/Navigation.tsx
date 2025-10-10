import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Menu', id: 'menu' },
    { label: 'About', id: 'about' },
    { label: 'Location', id: 'location' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-serif text-xl md:text-2xl font-bold text-foreground hover-elevate"
              data-testid="button-logo"
            >
              Fishtail Cuisine
            </button>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-foreground hover:text-primary transition-colors font-medium text-base relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                  data-testid={`button-nav-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
              <a href="tel:+17203289842" data-testid="button-call">
                <Button variant="default" className="gap-2 font-semibold">
                  <Phone className="w-4 h-4" />
                  <span className="hidden lg:inline">Call Now</span>
                </Button>
              </a>
            </div>

            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-lg md:hidden pt-20">
          <div className="flex flex-col items-center justify-center gap-8 p-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                data-testid={`button-mobile-nav-${link.id}`}
              >
                {link.label}
              </button>
            ))}
            <a href="tel:+17203289842" data-testid="button-mobile-call">
              <Button size="lg" className="gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
