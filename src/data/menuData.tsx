import { MenuItemData } from "@/components/fishtail/MenuItem";
import samosaImage from "@/assets/indian_samosa_appeti_6d10c724.jpg";
import momosImage from "@/assets/nepalese_momos_dumpl_64e121a7.jpg";
import biryaniImage from "@/assets/biryani_rice_indian__684c1c84.jpg";
import naanImage from "@/assets/indian_naan_bread_ga_ecb9a097.jpg";
import curryImage from "@/assets/indian_tandoori_chic_cd3959b8.jpg";

export const menuCategories = [
    {
        title: "Appetizers - Vegetable",
        subtitle: "",
        image: samosaImage,
        items: [
            { id: "app-1", name: "Veg Samosa", description: "Vegan friendly crispy fried triangular pastry pockets filled with mildly spiced mixture of potatoes and peas, served with homemade chutney.", price: "$7.99", category: "Appetizers", dietaryInfo: ["Vegan"] },
            { id: "app-2", name: "Samosa Chat", description: "Fried crispy samosas topped with garbanzo, flavorful spices, homemade chutney and cooling yogurt.", price: "$10.99", category: "Appetizers", dietaryInfo: [] },
            { id: "app-3", name: "Veggie Pakora", description: "Fried crispy assorted seasonal vegetables in spiced battered.", price: "$8.99", category: "Appetizers", dietaryInfo: ["GF", "Vegan"] },
            { id: "app-4", name: "Onion Bhaji", description: "Fried crispy onion in spiced battered.", price: "$6.99", category: "Appetizers", dietaryInfo: ["GF", "Vegan"] },
            { id: "app-5", name: "Gobhi Manchurian", description: "Crispy fried Cauliflower tossed with homemade manchurian chili sauce.", price: "$10.99", category: "Appetizers", dietaryInfo: ["Vegan"] },
            { id: "app-6", name: "Aloo Paneer Tikki", description: "Crispy fried paneer with mildly spiced mixture of potatoes and peas served with homemade boom boom sauce.", price: "$9.99", category: "Appetizers", dietaryInfo: [] },
            { id: "app-7", name: "Paneer 65", description: "Crispy marinated paneer tossed with a blend of aromatic tangy sauce.", price: "$11.99", category: "Appetizers", dietaryInfo: ["GF"] },
        ]
    },
    {
        title: "Appetizers - Non Veg",
        subtitle: "",
        items: [
            { id: "app-8", name: "Chicken Pakora", description: "Crispy fried in spiced batter seasoned chicken strips served with homemade chutney.", price: "$9.99", category: "Appetizers", dietaryInfo: ["GF"] },
            { id: "app-9", name: "Fish Pakora", description: "Crispy fried in spiced batter seasoned fish strips served with homemade chutney.", price: "$10.99", category: "Appetizers", dietaryInfo: ["GF"] },
            { id: "app-10", name: "Shrimp Pakora", description: "Crispy fried in spiced batter seasoned shrimps served with homemade chutney.", price: "$10.99", category: "Appetizers", dietaryInfo: ["GF"] },
            { id: "app-11", name: "Malekhu Fish & Chips", description: "Himalayan spiced batter fried fish strips and potatoes fries served with homemade sauce.", price: "$12.99", category: "Appetizers", dietaryInfo: [] },
            { id: "app-12", name: "Chicken 65", description: "Crispy marinated chicken tossed with a blend of aromatic tangy sauce.", price: "$11.99", category: "Appetizers", dietaryInfo: ["GF"] },
            { id: "app-13", name: "Tandoori Chicken Wings (8 pieces)", description: "Marinated with Himalayan spice blend and yogurt cooked to perfection in a clay oven (Tandoor).", price: "$13.99", category: "Appetizers", dietaryInfo: ["GF"] },
        ]
    },
    {
        title: "Soup and Salad",
        subtitle: "",
        items: [
            { id: "soup-1", name: "Daal (Lentil) Soup", description: "Yellow lentils cooked with ginger, garlic, herbs and spices.", price: "$8.99", category: "Soup", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "soup-2", name: "Veggie Coconut Soup", description: "Seasonal veggies prepared with coconut cream herbs and spices.", price: "$9.99", category: "Soup", dietaryInfo: ["GF", "Vegan"] },
            { id: "soup-3", name: "Chicken Soup", description: "Chicken soup prepared with an essence of Himalayan herbs and spices.", price: "$9.99", category: "Soup", dietaryInfo: ["GF"] },
            { id: "salad-1", name: "House Salad", description: "Fresh springs mix lettuce with chicken tikka, cucumber, carrot, tomatoes tossed with house vinaigrette top with fried crispy noodles.", price: "$10.99", category: "Salad", dietaryInfo: ["GF Upon Request", "Vegan"] },
            { id: "salad-2", name: "Chicken Salad", description: "Fresh springs mix lettuce, cucumber, carrot, tomatoes tossed with house vinaigrette top with fried crispy noodles.", price: "$12.99", category: "Salad", dietaryInfo: ["GF Upon Request"] },
        ]
    },
    {
        title: "Tandoori Festive",
        subtitle: "Marinated in a yogurt base Himalayan spiced blend cooked in tandoor (clay oven), serve with veggie",
        image: curryImage,
        items: [
            { id: "tan-1", name: "Chicken Tikka Kabab", description: "Boneless chicken breast.", price: "$19.99", category: "Tandoori", dietaryInfo: ["GF"] },
            { id: "tan-2", name: "Tandoori Chicken", description: "Bone-in chicken.", price: "$19.99", category: "Tandoori", dietaryInfo: ["GF"] },
            { id: "tan-3", name: "Lamb Tikka Kabab", description: "Boneless lamb cube chunks.", price: "$22.99", category: "Tandoori", dietaryInfo: ["GF"] },
            { id: "tan-4", name: "Lamb Chop", description: "Boneless lamb chop.", price: "$22.99", category: "Tandoori", dietaryInfo: ["GF"] },
            { id: "tan-5", name: "Tandoori Salmon", description: "Salmon fillet.", price: "$22.99", category: "Tandoori", dietaryInfo: ["GF"] },
        ]
    },
    {
        title: "Biryani",
        subtitle: "Long grain basmati rice cooked with aromatic Indian spices (Nuts and Dairy Free Upon Request)",
        image: biryaniImage,
        items: [
            { id: "bir-1", name: "Veg Biryani", description: "Mix vegetable and herbs.", price: "$18.99", category: "Biryani", dietaryInfo: ["GF"] },
            { id: "bir-2", name: "Chicken Biryani", description: "Chicken and herbs.", price: "$19.99", category: "Biryani", dietaryInfo: ["GF"] },
            { id: "bir-3", name: "Lamb Biryani", description: "Lamb and herbs.", price: "$22.99", category: "Biryani", dietaryInfo: ["GF"] },
            { id: "bir-4", name: "Goat Biryani with Bone", description: "Goat with bone and herbs.", price: "$22.99", category: "Biryani", dietaryInfo: ["GF"] },
        ]
    },
    {
        title: "From the Mt. Everest Base Camp",
        subtitle: "",
        image: momosImage,
        items: [
            { id: "momo-1", name: "Vegetable Momo", description: "Steamed veggie and paneer dumplings with roasted sesame tomato sauce.", price: "$15.99", category: "Momos", dietaryInfo: [] },
            { id: "momo-2", name: "Veggie Jhol Momo", description: "Steamed veggie and paneer dumplings dipped in roasted soy sesame tomato soup.", price: "$16.99", category: "Momos", dietaryInfo: [] },
            { id: "momo-3", name: "Chicken Momo", description: "Steamed minced dumplings with roasted sesame tomato sauce.", price: "$17.99", category: "Momos", dietaryInfo: ["Dairy Free"] },
            { id: "momo-4", name: "Chicken Jhol Momo", description: "Steamed chicken dumplings dipped in roasted soy sesame tomato soup.", price: "$18.99", category: "Momos", dietaryInfo: ["Dairy Free"] },
            { id: "momo-5", name: "Momo Chilli Veggie", description: "Savory seasoned veggie dumplings tossed with homemade soy based chili sauce, bell peppers and onions.", price: "$16.99", category: "Momos", dietaryInfo: [] },
            { id: "momo-6", name: "Momo Chilli Chicken", description: "Savory seasoned chicken dumplings tossed with homemade soy based chili sauce, bell peppers and onions.", price: "$18.99", category: "Momos", dietaryInfo: ["Dairy Free"] },
            { id: "nepal-1", name: "Chicken Chilli", description: "Stir fry chicken, bell peppers, onion tossed with homemade tangy soy chili sauce.", price: "$19.99", category: "Nepalese", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "nepal-2", name: "Veggie Chowmein", description: "Stir fried Noodles with fresh sautéed veggies.", price: "$16.99", category: "Nepalese", dietaryInfo: ["Vegan", "Dairy Free"] },
            { id: "nepal-3", name: "Chicken Chowmein", description: "Stir fried Noodles with tender chicken and sautéed veggies.", price: "$18.99", category: "Nepalese", dietaryInfo: ["Dairy Free"] },
            { id: "nepal-4", name: "Vegetable Thukpa (Veggie Noodle Stew)", description: "Rich, flavorful Himalayan spiced blend soup cooked with noodles, veggies.", price: "$17.99", category: "Nepalese", dietaryInfo: ["Vegan"] },
            { id: "nepal-5", name: "Chicken Thukpa (Chicken Noodle Stew)", description: "Rich, flavorful Himalayan spiced blend soup cooked with noodles, boneless chicken and veggies.", price: "$19.99", category: "Nepalese", dietaryInfo: ["Dairy Free"] },
            { id: "nepal-6", name: "Chicken Sekuwa", description: "Marinated chicken cubes in Himalayan spice blend cooked in tandoor (clay oven).", price: "$20.99", category: "Nepalese", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "nepal-7", name: "Lamb Sekuwa", description: "Marinated lamb cubes in Himalayan spice blend cooked in tandoor (clay oven).", price: "$22.99", category: "Nepalese", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "nepal-8", name: "Honey Chicken Curry", description: "This is indo-chinese most popular fusion sweet tangy savory dish that is spiced just right for everyone's test.", price: "$18.99", category: "Nepalese", dietaryInfo: ["GF", "Dairy Free"] },
        ]
    },
    {
        title: "Vegetarian Lovers",
        subtitle: "",
        items: [
            { id: "veg-1", name: "Yellow Daal Tadka", description: "Yellow lentil cooked with a hint of spices in the authentic home style.", price: "$18.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "veg-2", name: "Daal Makhani", description: "Stewed creamy black lentils in a touch of butter, flavored with herbs and spices.", price: "$14.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "veg-3", name: "Mix Veggie Curry", description: "Seasonal mix veggies cooked in a blend of aromatic spices, onion tomato masala.", price: "$15.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan"] },
            { id: "veg-4", name: "Mix Veggie Korma", description: "Seasonal mix veggies cooked in rich creamy sauce.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "veg-5", name: "Malai Kofta", description: "Freshly made veggies ball with paneer and nuts in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-6", name: "Shahi Paneer", description: "Paneer (Homemade cheese) in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-7", name: "Paneer Masala", description: "Paneer (Homemade cheese) cubes simmered in rich creamy tomato tikka sauce with a touch of Himalayan herbs spices blend.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-8", name: "Kadai Paneer", description: "Stir fry paneer (homemade cheese) cubes with bell peppers, onion cooked in rich curry sauce with a touch of Himalayan herbs spices blend.", price: "$19.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-9", name: "Mattar Paneer", description: "Paneer (homemade cheese) cubes and green peas simmered in rich creamy curry sauce with a touch of Himalayan herbs spices blend.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-10", name: "Paneer Chilli", description: "Stir fry paneer, bell peppers, onion tossed with homemade tangy soy chili sauce.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-11", name: "Saag Paneer", description: "Paneer (homemade cheese) cubes and spinach cooked in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF"] },
            { id: "veg-12", name: "Saag Tofu", description: "Tofu cubes and spinach cooked in coconut creamy sauce (vegan) with a touch of himalayan herbs spices blend.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan"] },
            { id: "veg-13", name: "Saag Aloo", description: "Potatoes and spinach cooked in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$16.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "veg-14", name: "Saag Chana", description: "Stewed garbanzo and spinach cooked in creamy sauce with a touch of himalayan herbs spices blend.", price: "$16.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "veg-15", name: "Chana Masala", description: "Stewed garbanzo cooked with tomatoes, onions with a touch of tangy herbs spices blend.", price: "$15.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan"] },
            { id: "veg-16", name: "Baigan Bharta", description: "Roasted mashed eggplant cooked with green peas, onions, tomatoes fresh herbs and spices with a touch of cream.", price: "$17.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan Upon Request"] },
            { id: "veg-17", name: "Aloo Gobi", description: "Cauliflower and potatoes cooked in tomato, onion, curry gravy flavored with herbs and spices.", price: "$16.99", category: "Vegetarian", dietaryInfo: ["GF", "Vegan"] },
        ]
    },
    {
        title: "Meat Lovers - Chicken",
        subtitle: "",
        items: [
            { id: "chk-1", name: "Chicken Tikka Masala", description: "Tandoori cooked chicken breast in tomato-onion creamy sauce flavored with herbs and spices.", price: "$18.99", category: "Chicken", dietaryInfo: ["GF"] },
            { id: "chk-2", name: "Butter (Makhani) Chicken", description: "Boneless chicken simmered in a smooth silky creamy tomato sauce.", price: "$18.99", category: "Chicken", dietaryInfo: ["GF"] },
            { id: "chk-3", name: "Chicken Korma", description: "Boneless chicken in mild cashew creamy sauce flavored with herbs and spices.", price: "$18.99", category: "Chicken", dietaryInfo: ["GF", "Nuts and Dairy Free Upon Request"] },
            { id: "chk-4", name: "Chicken Curry", description: "Traditional chicken curry in tomato-onion sauce flavored with herbs and spices.", price: "$18.99", category: "Chicken", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "chk-5", name: "Chicken Vindaloo", description: "Chicken, potatoes in a sharp and tangy sauce, flavored with herbs and spices.", price: "$18.99", category: "Chicken", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "chk-6", name: "Chicken Kadai", description: "Stir fry chicken with bell peppers, onion cooked in rich curry sauce with a touch of himalayan herbs spices blend.", price: "$18.99", category: "Chicken", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "chk-7", name: "Chicken Saag", description: "Chicken and spinach cooked in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$19.99", category: "Chicken", dietaryInfo: ["GF", "Dairy Free Upon Request"] },
            { id: "chk-8", name: "Chicken Madras", description: "Boneless chicken in rich flavored coconut milk sauce with touch of herbs and spices.", price: "$19.99", category: "Chicken", dietaryInfo: ["GF", "Dairy Free"] },
        ]
    },
    {
        title: "Meat Lovers - Lamb and Goat",
        subtitle: "",
        items: [
            { id: "lamb-1", name: "Lamb Curry", description: "Traditional lamb curry in tomato-onion sauce flavored with herbs and spices.", price: "$22.99", category: "Lamb", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "lamb-2", name: "Lamb Vindaloo", description: "Lamb, potatoes in a sharp and tangy sauce, flavored with herbs and spices.", price: "$22.99", category: "Lamb", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "lamb-3", name: "Lamb Kadai", description: "Stir fry lamb with bell peppers, onion cooked in rich curry sauce with a touch of himalayan herbs spices blend.", price: "$22.99", category: "Lamb", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "lamb-4", name: "Lamb Saag", description: "Lamb and spinach cooked in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$22.99", category: "Lamb", dietaryInfo: ["GF", "Dairy Free Upon Request"] },
            { id: "lamb-5", name: "Lamb Tikka Masala", description: "Tandoori cooked lamb chunks in tomato-onion creamy sauce flavored with herbs and spices.", price: "$22.99", category: "Lamb", dietaryInfo: ["GF"] },
            { id: "lamb-6", name: "Lamb Makhani (Butter)", description: "Boneless lamb simmered in a smooth silky creamy tomato sauce.", price: "$22.99", category: "Lamb", dietaryInfo: ["GF"] },
            { id: "goat-1", name: "Goat Curry (with bone)", description: "Traditional goat curry in tomato-onion sauce flavored with herbs and spices.", price: "$22.99", category: "Goat", dietaryInfo: ["GF"] },
        ]
    },
    {
        title: "Seafood Lovers",
        subtitle: "Shrimp and Fish",
        items: [
            { id: "sea-1", name: "Shrimp or Seasonal Fish Curry", description: "Traditional shrimp or fish curry in tomato-onion sauce flavored with herbs and spices.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "sea-2", name: "Shrimp or Seasonal Fish Vindaloo", description: "Shrimp or Fish, potatoes in a sharp and tangy sauce, flavored with herbs and spices.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "sea-3", name: "Shrimp or Seasonal Fish Kadai", description: "Stir fry Shrimp or Fish with bell peppers, onion cooked in rich curry sauce with a touch of Himalayan herbs spices blend.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF", "Dairy Free"] },
            { id: "sea-4", name: "Shrimp or Seasonal Fish Saag", description: "Shrimp or Fish and spinach cooked in creamy sauce with a touch of Himalayan herbs spices blend.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF", "Dairy Free Upon Request"] },
            { id: "sea-5", name: "Shrimp or Seasonal Fish Tikka Masala", description: "Tandoori cooked Shrimp or Fish in tomato-onion creamy sauce flavored with herbs and spices.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF"] },
            { id: "sea-6", name: "Shrimp or Seasonal Fish Korma", description: "Shrimp or Fish in mild cashew creamy sauce flavored with herbs and spices.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF", "Nuts and Dairy Free Upon Request"] },
            { id: "sea-7", name: "Shrimp or Seasonal Fish Madras", description: "Shrimp or Fish in rich flavored coconut milk sauce with touch of herbs and spices.", price: "$22.99", category: "Seafood", dietaryInfo: ["GF", "Dairy Free"] },
        ]
    },
    {
        title: "Whole Wheat Breads",
        subtitle: "Vegan Upon Request",
        items: [
            { id: "bread-1", name: "Tandoor Roti", description: "Whole wheat bread freshly cooked in the clay oven.", price: "$3.99", category: "Bread", dietaryInfo: [] },
            { id: "bread-2", name: "Garlic Roti", description: "Whole wheat bread freshly cooked in the clay oven with garlic and cilantro.", price: "$4.49", category: "Bread", dietaryInfo: [] },
            { id: "bread-3", name: "Lachha Paratha", description: "Whole wheat layered bread freshly cooked with butter in the clay oven.", price: "$4.99", category: "Bread", dietaryInfo: [] },
            { id: "bread-4", name: "Aloo Paratha", description: "Whole wheat bread stuffed with potatoes, peas, onion, cilantro freshly cooked in oven.", price: "$4.99", category: "Bread", dietaryInfo: [] },
        ]
    },
    {
        title: "Tandoori Naan (Bread)",
        subtitle: "Cooked in clay oven. Indian style leavened fluffy flatbread freshly cooked in clay oven (All contain gluten, eggs, and milk)",
        image: naanImage,
        items: [
            { id: "naan-1", name: "Plain Naan", description: "", price: "$2.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-2", name: "Butter Naan", description: "", price: "$2.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-3", name: "Garlic Naan", description: "Garnished with fresh garlic and cilantro.", price: "$3.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-4", name: "Garlic Cheese Naan", description: "Stuffed with fresh garlic and cheddar cheese.", price: "$4.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-5", name: "Cheese Naan", description: "Stuffed with Cheddar cheese.", price: "$3.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-6", name: "Cheese and Jalapeño Naan", description: "Stuffed with fresh jalapeños and cheddar cheese.", price: "$4.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-7", name: "Cheese and Onion Kulcha", description: "Stuffed with cheddar cheese, onions and spices.", price: "$4.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-8", name: "Chicken, Cheese, and Jalapeño Naan", description: "Stuffed with chicken, cheddar cheese and jalapeños.", price: "$6.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-9", name: "Garlic Cheese Jalapeño Naan", description: "Stuffed with fresh jalapeños, garlic and cheddar cheese.", price: "$4.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-10", name: "Onion Kulcha", description: "Stuffed with spices and onions.", price: "$3.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-11", name: "Alu Naan", description: "Stuffed with potatoes, peas, cilantro and spices.", price: "$4.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-12", name: "Chicken Tikka Naan", description: "Stuffed with chicken, onion and cilantro.", price: "$5.99", category: "Naan", dietaryInfo: [] },
            { id: "naan-13", name: "Kashmiri Naan", description: "Stuffed with nuts, raisin, coconut and cherry.", price: "$5.99", category: "Naan", dietaryInfo: [] },
        ]
    },
    {
        title: "Side Orders",
        subtitle: "",
        items: [
            { id: "side-1", name: "Desi Salad", description: "Sliced raw onions, lemon wedges and green chili.", price: "$3.99", category: "Sides", dietaryInfo: [] },
            { id: "side-2", name: "Raita", description: "Yogurt with cucumber, carrot and roasted cumin seed.", price: "$4.99", category: "Sides", dietaryInfo: [] },
            { id: "side-3", name: "Mix Pickle (4 oz)", description: "", price: "$2.99", category: "Sides", dietaryInfo: [] },
            { id: "side-4", name: "Papadum (2 pcs)", description: "", price: "$2.99", category: "Sides", dietaryInfo: [] },
            { id: "side-5", name: "Side Masala Sauce (8 oz/16 oz)", description: "", price: "$8.99/15.99", category: "Sides", dietaryInfo: [] },
            { id: "side-6", name: "Basmati Rice (16 oz)", description: "", price: "$3.99", category: "Sides", dietaryInfo: [] },
            { id: "side-7", name: "Side Homemade Chutney (8 oz)", description: "", price: "$4.99", category: "Sides", dietaryInfo: [] },
            { id: "side-8", name: "Sweet Mango Chutney (8 oz)", description: "", price: "$4.99", category: "Sides", dietaryInfo: [] },
        ]
    },
    {
        title: "Desserts",
        subtitle: "",
        items: [
            { id: "dess-1", name: "Gulab Jamun", description: "Fried dough balls infused with reduced milk and soaked in a syrup.", price: "$6.99", category: "Desserts", dietaryInfo: [] },
            { id: "dess-2", name: "Rasmalai", description: "Soft spongy cheese balls soaked in sweet creamy milk.", price: "$6.99", category: "Desserts", dietaryInfo: [] },
            { id: "dess-3", name: "Rice Pudding", description: "Fragrant rice flavored sweetened milk with nuts raisin.", price: "$6.99", category: "Desserts", dietaryInfo: [] },
            { id: "dess-4", name: "Carrot Pudding", description: "Carrot cooked in flavored sweetened milk with nuts raisin.", price: "$6.99", category: "Desserts", dietaryInfo: [] },
        ]
    },
    {
        title: "Beverages",
        subtitle: "",
        items: [
            { id: "bev-1", name: "Masala Chai Tea", description: "Indian spiced hot tea with milk.", price: "$3.49", category: "Beverages", dietaryInfo: [] },
            { id: "bev-2", name: "Iced Masala Chai Tea", description: "Indian spiced iced tea with milk.", price: "$4.49", category: "Beverages", dietaryInfo: [] },
            { id: "bev-3", name: "Mango Lassi", description: "Smooth yogurt drink with mango pulp.", price: "$5.99", category: "Beverages", dietaryInfo: [] },
            { id: "bev-4", name: "Sweet Lassi", description: "Smooth sweet yogurt drink.", price: "$5.99", category: "Beverages", dietaryInfo: [] },
            { id: "bev-5", name: "Mint Salt Lassi", description: "Smooth minty salt yogurt drink with hint of roasted cumin.", price: "$5.99", category: "Beverages", dietaryInfo: [] },
            { id: "bev-6", name: "Rose Lassi", description: "Smooth rose flavored yogurt drink.", price: "$5.99", category: "Beverages", dietaryInfo: [] },
            { id: "bev-7", name: "Shake (Mango or Banana)", description: "Blended homemade Mango or Banana milk shake.", price: "$4.99", category: "Beverages", dietaryInfo: [] },
            { id: "bev-8", name: "Iced Cold Soda", description: "Coke, Diet Coke, Orange Fanta, Sprite, Lemonade, Dr-Pepper, Club Soda. Your choice of flavor.", price: "$2.99", category: "Beverages", dietaryInfo: [] },
            { id: "bev-9", name: "Sparkling Water", description: "", price: "$3.00", category: "Beverages", dietaryInfo: [] },
            { id: "bev-10", name: "Water", description: "", price: "$1.50", category: "Beverages", dietaryInfo: [] },
            { id: "bev-11", name: "Bottled Soda (Coke, Fanta & Sprite)", description: "", price: "$3.00", category: "Beverages", dietaryInfo: [] },
        ]
    },
];

export function filterMenuItems(items: MenuItemData[], filter: string): MenuItemData[] {
    if (filter === 'all') return items;

    return items.filter(item => {
        const dietaryStr = item.dietaryInfo.join(' ').toLowerCase();

        if (filter === 'vegetarian') {
            return item.category === 'Vegetarian' ||
                item.category === 'Appetizers' && dietaryStr.includes('vegan') ||
                item.category === 'Soup' && !dietaryStr.includes('chicken');
        }
        if (filter === 'vegan') {
            return dietaryStr.includes('vegan');
        }
        if (filter === 'gluten-free') {
            return dietaryStr.includes('gf');
        }
        if (filter === 'dairy-free') {
            return dietaryStr.includes('dairy free');
        }

        return true;
    });
}
