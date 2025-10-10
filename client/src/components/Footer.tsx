import { Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Fishtail Cuisine</h3>
            <p className="text-muted-foreground mb-4">
              Authentic Indian and Nepalese cuisine in the heart of Denver.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-muted-foreground">
              <a href="tel:+17203289842" className="flex items-center gap-2 hover:text-primary transition-colors" data-testid="footer-phone">
                <Phone className="w-4 h-4" />
                <span>(720) 328-9842</span>
              </a>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=1076+N+Ogden+St,+Denver,+CO+80218"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
                data-testid="footer-address"
              >
                <MapPin className="w-4 h-4" />
                <span>1076 N Ogden St, Denver, CO 80218</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Hours</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Mon - Thu: 11:00 AM - 9:00 PM</p>
              <p>Fri - Sat: 11:00 AM - 10:00 PM</p>
              <p>Sunday: 12:00 PM - 9:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fishtail Cuisine of India and Nepal. All rights reserved.</p>
          <p className="mt-2 text-xs">
            The following major food allergies are used as ingredients: Milk, Egg, Fish, Crustacean Shellfish, Tree Peanuts, Wheat, Soy and Sesame. Please notify staff for more information.
          </p>
        </div>
      </div>
    </footer>
  );
}
