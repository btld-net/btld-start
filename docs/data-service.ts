import type { ProfessionalService, WithContext } from 'schema-dts';
import { person } from './data-person';

export const service: WithContext<ProfessionalService> = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://rueberg.eu/#service',
  name: 'Florian Rüberg - Freelance Fullstack Developer',
  description: 'Freelance Fullstack Developer specializing in C#, .NET, and Angular.',
  url: 'https://rueberg.eu/',
  image: 'https://rueberg.eu/json-ld-image-fru.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Düsseldorf',
    addressCountry: 'Germany',
  },
  founder: person,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Freelance Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'C# Backend Development',
          description:
            'Scalable, secure server-side solutions and RESTful APIs built with .NET and C# for robust enterprise performance.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Angular Frontend Development',
          description:
            'Dynamic, high-performance enterprise web applications featuring reactive architectures and sophisticated state management.',
        },
      },
    ],
  },
};
