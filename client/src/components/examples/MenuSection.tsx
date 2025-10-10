import MenuSection from '../MenuSection';

export default function MenuSectionExample() {
  const sampleItems = [
    {
      id: '1',
      name: 'Veg Samosa',
      description: 'Vegan friendly crispy fried triangular pastry pockets filled with mildly spiced mixture of potatoes and peas, served with homemade chutney.',
      price: '$7.99',
      category: 'Appetizers',
      dietaryInfo: ['Vegan']
    },
    {
      id: '2',
      name: 'Chicken Pakora',
      description: 'Crispy fried in spiced batter seasoned chicken strips served with homemade chutney.',
      price: '$9.99',
      category: 'Appetizers',
      dietaryInfo: ['GF']
    },
  ];

  return <MenuSection title="Appetizers" items={sampleItems} />;
}
