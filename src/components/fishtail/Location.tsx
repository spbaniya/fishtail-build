import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export default function Location() {
    return (
        <section id="location" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <div className="inline-block mb-6">
                        <div className="w-20 h-1 bg-primary mb-4 mx-auto"></div>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 relative inline-block">
                        Visit Us
                        <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground mt-8">
                        Located in the heart of Denver, Colorado
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-start">
                    <Card className="border-l-4 border-l-primary/30 hover:border-l-primary transition-all duration-300 shadow-xl hover:shadow-2xl">
                        <CardContent className="p-10 space-y-10">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-xl mb-3">Address</h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        1076 N Ogden St<br />
                                        Denver, CO 80218<br />
                                        United States
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-xl mb-3">Phone</h3>
                                    <a
                                        href="tel:+17203289842"
                                        className="text-muted-foreground hover:text-primary transition-colors text-base font-medium"
                                        data-testid="link-phone-location"
                                    >
                                        (720) 328-9842
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Clock className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-xl mb-3">Hours</h3>
                                    <div className="text-muted-foreground space-y-2 text-base">
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
                                    <Button className="w-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all" size="lg">
                                        Get Directions
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="h-96 md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/10 hover:ring-primary/30 transition-all duration-300">
                        <iframe
                            title="Restaurant Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.4654!2d-104.9748768!3d39.7332173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7f2daa53c4ef%3A0xab22f8c7ef485cd7!2sFishtail%20Cuisine%20of%20India%20and%20Nepal!5e0!3m2!1sen!2sus!4v1234567890123"
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
