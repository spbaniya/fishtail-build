import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/stock_images/indian_tandoori_chic_cd3959b8.jpg";

export default function Hero() {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6">
          Fishtail Cuisine
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4 md:mb-6 text-gold">
          of India and Nepal
        </p>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto font-light">
          Authentic Flavors of the Himalayas in the Heart of Denver
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12">
          <a 
            href="tel:+17203289842" 
            className="flex items-center gap-2 text-base md:text-lg hover-elevate bg-white/10 backdrop-blur-md px-6 py-3 rounded-md border border-white/20"
            data-testid="link-phone"
          >
            <Phone className="w-5 h-5" />
            <span>(720) 328-9842</span>
          </a>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=1076+N+Ogden+St,+Denver,+CO+80218" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base md:text-lg hover-elevate bg-white/10 backdrop-blur-md px-6 py-3 rounded-md border border-white/20"
            data-testid="link-address"
          >
            <MapPin className="w-5 h-5" />
            <span>1076 N Ogden St, Denver, CO</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 border-2 border-primary-border"
            onClick={scrollToMenu}
            data-testid="button-view-menu"
          >
            View Menu
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20"
            data-testid="button-order-online"
          >
            Order Online
          </Button>
        </div>
      </div>
    </section>
  );
}
