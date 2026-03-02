
import { PropertyCard } from '../common/PropertyCard';

export function FeaturedProperties() {
  const properties = [
    {
      id: 1,
      image: '/cardimage.jpg',
      title: 'Modern 3-Bedroom Apartment in Westland\'s',
      location: 'Westland\'s, Nairobi',
      price: 'KSh 45.0M',
      beds: 3,
      baths: 2,
      sqft: '1,876 sqft',
      description: 'Genuine Resale | End Unit | Luxurious',
      status: 'For Sale' as const,
      availability: 'Available',
    },
    {
      id: 2,
       image: '/cardimage.jpg',
      title: 'Modern 3-Bedroom Apartment in Westland\'s',
      location: 'Westland\'s, Nairobi',
      price: 'KSh 45.0M',
      beds: 3,
      baths: 2,
      sqft: '1,876 sqft',
      description: 'Genuine Resale | End Unit | Luxurious',
      status: 'For Sale' as const,
      availability: 'Available',
    },
    {
      id: 3,
       image: '/cardimage.jpg',
      title: 'Modern 3-Bedroom Apartment in Westland\'s',
      location: 'Westland\'s, Nairobi',
      price: 'KSh 45.0M',
      beds: 3,
      baths: 2,
      sqft: '1,876 sqft',
      description: 'Genuine Resale | End Unit | Luxurious',
      status: 'For Sale' as const,
      availability: 'Available',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className='text-[#061F3D] text-4xl  font-bold text-center'>
            Featured <span className='text-[#D3920E]'>Properties</span> 
          </h1>
          <p className='text-[#7D7D7D] text-base font-normal text-center mt-2'>Handpicked premium properties across Kenya&apos;s most sought-after locations</p>
        </div>
        {/* Properties Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
}
