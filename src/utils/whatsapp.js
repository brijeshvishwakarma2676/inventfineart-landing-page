export function buildWhatsAppUrl({
  phone = '919323210327',
  name = '',
  userPhone = '',
  email = '',
  service = '',
  artworkRef = '',
  message = '',
}) {
  const lines = ['Hello Invent Fine Art,', ''];

  if (service || artworkRef) {
    lines.push('I would like to make an enquiry:');
    if (service) lines.push(`• Service: ${service}`);
    if (artworkRef) lines.push(`• Artwork Reference: ${artworkRef}`);
    lines.push('');
  }

  if (message) {
    lines.push('Project Details:');
    lines.push(message.trim());
    lines.push('');
  }

  lines.push('Contact Information:');
  if (name) lines.push(`• Name: ${name}`);
  if (userPhone) lines.push(`• Phone: ${userPhone}`);
  if (email) lines.push(`• Email: ${email}`);

  const fullText = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(fullText)}`;
}

export default buildWhatsAppUrl;
