import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Location() {
  return (
    <section id="location" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Visit Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Located in the heart of Denver, Colorado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    1076 N Ogden St<br />
                    Denver, CO 80218<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Phone</h3>
                  <a 
                    href="tel:+17203289842" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid="link-phone-location"
                  >
                    (720) 328-9842
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Hours</h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Monday - Thursday: 11:00 AM - 9:00 PM</p>
                    <p>Friday - Saturday: 11:00 AM - 10:00 PM</p>
                    <p>Sunday: 12:00 PM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=1076+N+Ogden+St,+Denver,+CO+80218" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="button-directions"
                >
                  <Button className="w-full" size="lg">
                    Get Directions
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Restaurant Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.0267935849434!2d-104.97645!3d39.73912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c78d3c9c9c9c9%3A0x1234567890abcdef!2s1076%20N%20Ogden%20St%2C%20Denver%2C%20CO%2080218!5e0!3m2!1sen!2sus!4v1234567890123"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="map-embed"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
