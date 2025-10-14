export interface CardOption {
    id: string | number;
    label: string;
    icon: any; // React component
    desc: string;
    followUp?: string;
}

export interface CardSection {
    id: string | number;
    title: string;
    icon: any; // React component
    options: CardOption[];
}

import { Heart, Clock, CheckCircle, User, MapPin, Users, ShoppingCart, Home, Zap, Car, ChefHat, BookOpen, Sparkles, Calendar, Timer, DollarSign, Coffee, Gift, HandHeart, Ban } from "lucide-react";

class CardSectionsService {
    private cardSections: CardSection[] = [
        {
            id: "what",
            title: "What do you need help with?",
            icon: Heart,
            options: [
                { id: "groceries", label: "Groceries", icon: ShoppingCart, desc: "Need food or essentials" },
                { id: "chores", label: "Household Chores", icon: Home, desc: "Cleaning, laundry, small tasks" },
                { id: "moving", label: "Moving Furnitures", icon: Home, desc: "Help with moving or rearranging furniture" },
                { id: "tech", label: "Tech Support", icon: Zap, desc: "Help with devices, setup, troubleshooting" },
                { id: "errands", label: "Errands", icon: Car, desc: "Pick up, drop off, or run errands" },
                { id: "cooking", label: "Cooking Help", icon: ChefHat, desc: "Meal prep, cooking assistance" },
                { id: "tutoring", label: "Tutoring/Mentoring", icon: BookOpen, desc: "Academic or life mentoring" },
                { id: "custom", label: "Custom input", icon: Sparkles, desc: "Describe your unique need" }
            ]
        },
        {
            id: "when",
            title: "When do you need help?",
            icon: Clock,
            options: [
                { id: "now", label: "Immediately", icon: Zap, desc: "Right now or within 1 hour" },
                { id: "today", label: "Later Today", icon: Timer, desc: "Within today" },
                { id: "week", label: "This Week", icon: Calendar, desc: "Within a few days" },
                { id: "flexible", label: "Flexible", icon: Clock, desc: "No rush" }
            ]
        },
        {
            id: "compensation",
            title: "How will you thank them?",
            icon: Heart,
            options: [
                { id: "money", label: "Payment", icon: DollarSign, desc: "Cash or digital", followUp: "paymentAmount" },
                { id: "coffee", label: "Coffee/Treats", icon: Coffee, desc: "Buy a coffee or treat", followUp: "coffeeTreat" },
                { id: "gift", label: "Gift/Surprise", icon: Gift, desc: "Give a small gift or surprise", followUp: "giftSurprise" },
                { id: "volunteer", label: "Volunteer Work/Service", icon: HandHeart, desc: "Offer your help/service", followUp: "volunteerWork" },
                { id: "thanks", label: "Heartfelt thank you", icon: Heart, desc: "Heartfelt thank you", followUp: "thankYouMessage" }
            ]
        },
        {
            id: "location",
            title: "Where do you need help?",
            icon: MapPin,
            options: [
                { id: "home", label: "My Location", icon: Home, desc: "At my place", followUp: "address" },
                { id: "provider", label: "Provider's Location", icon: MapPin, desc: "At provider's place" },
                { id: "other", label: "Other", icon: MapPin, desc: "Custom location", followUp: "address" }
            ]
        },
        {
            id: "verification",
            title: "Do you want verification?",
            icon: CheckCircle,
            options: [
                { id: "yes", label: "Yes", icon: CheckCircle, desc: "Verified helper" },
                { id: "no", label: "No", icon: Ban, desc: "Anyone can help" }
            ]
        }
    ];

    // Get all card sections
    getAllCardSections(): CardSection[] {
        return [...this.cardSections];
    }

    // Get card section by ID
    getCardSectionById(id: string): CardSection | undefined {
        return this.cardSections.find(section => section.id === id);
    }

    // Get card sections for a specific form
    getCardSectionsForForm(formType: string): CardSection[] {
        // For now, return all sections. In the future, this could filter based on form type
        return this.getAllCardSections();
    }

    // Get options for a specific section
    getOptionsForSection(sectionId: string): CardOption[] {
        const section = this.getCardSectionById(sectionId);
        return section ? [...section.options] : [];
    }

    // Add new card section
    addCardSection(section: Omit<CardSection, 'id'>): CardSection {
        const newSection: CardSection = {
            ...section,
            id: `section-${Date.now()}`
        };
        this.cardSections.push(newSection);
        return newSection;
    }

    // Update card section
    updateCardSection(id: string | number, updates: Partial<CardSection>): CardSection | undefined {
        const index = this.cardSections.findIndex(section => section.id === id);
        if (index !== -1) {
            this.cardSections[index] = { ...this.cardSections[index], ...updates };
            return this.cardSections[index];
        }
        return undefined;
    }

    // Delete card section
    deleteCardSection(id: string): boolean {
        const index = this.cardSections.findIndex(section => section.id === id);
        if (index !== -1) {
            this.cardSections.splice(index, 1);
            return true;
        }
        return false;
    }

    // Add option to section
    addOptionToSection(sectionId: string | number, option: Omit<CardOption, 'id'>): CardOption | undefined {
        const section = this.getCardSectionById(sectionId.toString());
        if (section) {
            const newOption: CardOption = {
                ...option,
                id: `option-${Date.now()}`
            };
            section.options.push(newOption);
            return newOption;
        }
        return undefined;
    }

    // Update option in section
    updateOptionInSection(sectionId: string | number, optionId: string | number, updates: Partial<CardOption>): CardOption | undefined {
        const section = this.getCardSectionById(sectionId.toString());
        if (section) {
            const optionIndex = section.options.findIndex(option => option.id === optionId);
            if (optionIndex !== -1) {
                section.options[optionIndex] = { ...section.options[optionIndex], ...updates };
                return section.options[optionIndex];
            }
        }
        return undefined;
    }

    // Delete option from section
    deleteOptionFromSection(sectionId: string | number, optionId: string): boolean {
        const section = this.getCardSectionById(sectionId.toString());
        if (section) {
            const optionIndex = section.options.findIndex(option => option.id === optionId);
            if (optionIndex !== -1) {
                section.options.splice(optionIndex, 1);
                return true;
            }
        }
        return false;
    }

    // Get time options for scheduling
    getTimeOptions(): string[] {
        return ['08:00', '12:00', '15:00', '18:00', '21:00'];
    }

    // Get payment amount suggestions
    getPaymentAmountSuggestions(): number[] {
        return [100, 300, 500, 1000];
    }

    // Get volunteer work suggestions
    getVolunteerWorkSuggestions(): string[] {
        return ["Gardening", "Tutoring", "Tech Help", "Cleaning", "Cooking", "Pet Care", "Shopping", "Other"];
    }

    // Get verification types
    getVerificationTypes(): string[] {
        return ["KYC Verified", "Police Report", "Educational Certificates", "Work Reference/Certificates"];
    }
}

export const cardSectionsService = new CardSectionsService();
