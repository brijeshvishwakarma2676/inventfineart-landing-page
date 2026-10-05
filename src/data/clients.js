// Client logos (30 files from the archive)
const clientFiles = [
  '1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp',
  '11.webp', '12.webp', '13.webp', '14.webp', '15.webp', '16.webp', '17.webp', '18.webp', '19.webp', '20.webp',
  '21.webp', '22.webp', '23.webp', '24.webp', '25.webp', '26.webp', '27.webp', '29.webp', '30.webp', '32.webp',
];

export const clients = clientFiles.map((file, idx) => ({
  id: `client-${idx + 1}`,
  src: `/assets/clients/${file}`,
  alt: `Client logo ${idx + 1}`,
}));

export const clientRow1 = clients.slice(0, 15);
export const clientRow2 = clients.slice(15);

export default clients;
