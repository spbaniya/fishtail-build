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
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -mr-48 -mb-48"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="w-16 h-1 bg-primary mb-8"></div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-10 leading-tight">
              Authentic Flavors from the <span className="text-primary">Himalayas</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Welcome to Fishtail Cuisine, where the rich culinary traditions of India and Nepal come together in the heart of Denver. Our name is inspired by the majestic Machapuchare (Fishtail Mountain) in the Himalayas, symbolizing the authentic heights of flavor we bring to every dish.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              From classic tandoori specialties to authentic Nepalese momos, every dish is crafted with care using traditional recipes passed down through generations. Experience the warmth of Himalayan hospitality with every visit.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl relative group">
            <img 
              src={restaurantImage} 
              alt="Restaurant Interior"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover-elevate transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border-t-4 border-t-primary/30 hover:border-t-primary group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <CardContent className="pt-10 pb-8 text-center relative z-10">
                <div className="flex justify-center mb-8 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-5 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
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
