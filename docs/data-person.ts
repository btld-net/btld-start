import type { Person } from 'schema-dts';

export const person: Person = {
  '@type': 'Person',
  '@id': 'https://rueberg.eu/#person-fru',
  name: 'Florian Rüberg',
  url: 'https://rueberg.eu/',
  image: 'https://rueberg.eu/json-ld-image-fru.jpg',
  jobTitle: 'Freelance Fullstack Developer',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Düsseldorf',
    addressCountry: 'Germany',
  },
  sameAs: [
    'https://github.com/fru',
    'https://www.linkedin.com/in/florian-rueberg',
    'https://www.xing.com/profile/Florian_Rueberg',
  ],
  knowsAbout: [
    'Web Development',
    'C#',
    'Entity Framework',
    'ASP.NET Core',
    'Web Components',
    'Angular',
  ],
};