import { Phone, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import heroImage from "@/assets/indian_tandoori_chic_cd3959b8.jpg";

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

            <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
                <div className="mb-6 inline-block">
                    <div className="w-20 h-1 bg-primary mb-6 mx-auto"></div>
                </div>
                <h1 className="font-serif text-white text-6xl md:text-7xl lg:text-9xl font-bold mb-6 md:mb-8 tracking-tight leading-tight drop-shadow-2xl">
                    Fishtail Cuisine
                </h1>
                <p className="text-3xl md:text-5xl lg:text-6xl font-serif mb-8 md:mb-10 text-white font-semibold italic drop-shadow-lg">
                    of India and Nepal
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 md:mb-10 mx-auto"></div>
                <p className="text-xl text-white md:text-2xl lg:text-3xl mb-12 md:mb-16 max-w-4xl mx-auto font-light tracking-wide drop-shadow-lg">
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

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 border-2 border-primary-border font-bold shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                        onClick={scrollToMenu}
                        data-testid="button-view-menu"
                    >
                        Explore Our Menu
                    </Button>
                </div>
            </div>
        </section>
    );
}
