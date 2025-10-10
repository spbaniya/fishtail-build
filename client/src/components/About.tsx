import { Flame, Sparkles, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import restaurantImage from "@assets/stock_images/indian_food_restaura_c34cc8a9.jpg";

export default function About() {
  const features = [
    {
      icon: <Flame className="w-8 h-8 text-primary" />,
      title: "Tandoor Clay Oven",
      description: "Authentic tandoor cooking for perfectly charred, smoky flavors in every bite"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Himalayan Spices",
      description: "Traditional spice blends imported directly from India and Nepal"
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: "Fresh Ingredients",
      description: "We use only the freshest, highest quality ingredients in every dish"
    }
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Authentic Flavors from the <span className="text-primary">Himalayas</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Welcome to Fishtail Cuisine, where the rich culinary traditions of India and Nepal come together in the heart of Denver. Our name is inspired by the majestic Machapuchare (Fishtail Mountain) in the Himalayas, symbolizing the authentic heights of flavor we bring to every dish.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From classic tandoori specialties to authentic Nepalese momos, every dish is crafted with care using traditional recipes passed down through generations. Experience the warmth of Himalayan hospitality with every visit.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src={restaurantImage} 
              alt="Restaurant Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover-elevate transition-transform hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
