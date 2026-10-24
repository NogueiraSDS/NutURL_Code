/**
 * Generates an RFC 6350 / vCard 3.0 string formatted for seamless
 * import into Apple iOS Contacts, Google Contacts, Android, and Outlook.
 */
export interface VCardContactData {
  fullName: string;
  role?: string | null;
  company?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  notes?: string | null;
  avatarUrl?: string | null;
}

export function generateVCardString(contact: VCardContactData): string {
  const parts = contact.fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${contact.fullName.trim()}`,
  ];

  if (contact.company) {
    lines.push(`ORG:${contact.company.trim()}`);
  }

  if (contact.role) {
    lines.push(`TITLE:${contact.role.trim()}`);
  }

  // Primary phone
  if (contact.phone) {
    const cleanPhone = contact.phone.trim();
    lines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
  }

  // WhatsApp as additional work/cell if different
  if (contact.whatsapp && contact.whatsapp !== contact.phone) {
    const cleanWa = contact.whatsapp.trim();
    lines.push(`TEL;TYPE=WORK,VOICE:${cleanWa}`);
  }

  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${contact.email.trim()}`);
  }

  if (contact.website) {
    let site = contact.website.trim();
    if (!site.startsWith('http://') && !site.startsWith('https://')) {
      site = `https://${site}`;
    }
    lines.push(`URL:${site}`);
  }

  if (contact.address || contact.city || contact.state) {
    const street = (contact.address || '').replace(/;/g, ' ');
    const city = (contact.city || '').replace(/;/g, ' ');
    const state = (contact.state || '').replace(/;/g, ' ');
    // ADR format: ;;street;city;state;zip;country
    lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};;Brasil`);
  }

  if (contact.notes) {
    const escapedNotes = contact.notes.replace(/\r?\n/g, '\\n');
    lines.push(`NOTE:${escapedNotes}`);
  }

  if (contact.avatarUrl && (contact.avatarUrl.startsWith('http://') || contact.avatarUrl.startsWith('https://'))) {
    lines.push(`PHOTO;VALUE=URI:${contact.avatarUrl}`);
  }

  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Downloads the vCard file in the browser
 */
export function downloadVCard(contact: VCardContactData, filename?: string): void {
  const vcardString = generateVCardString(contact);
  const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const cleanName = (contact.fullName || 'contato')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_');

  link.download = filename || `${cleanName}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
