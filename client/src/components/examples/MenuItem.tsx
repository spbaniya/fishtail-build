import MenuItem from '../MenuItem';

export default function MenuItemExample() {
  const sampleItem = {
    id: '1',
    name: 'Chicken Tikka Masala',
    description: 'Tandoori cooked chicken breast in tomato-onion creamy sauce flavored with herbs and spices.',
    price: '$18.99',
    category: 'Chicken',
    dietaryInfo: ['GF']
  };

  return <MenuItem item={sampleItem} />;
}
