export type PartnerContact = { status: string; email?: string | null; phone?: string | null; sourceUrl?: string | null; verifiedAt?: Date | string | null };
export function canContactPartner(partner: PartnerContact | null | undefined): boolean {
  return !!partner && partner.status === 'verified' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partner.email || '') &&
    !!partner.phone && /^https:\/\//.test(partner.sourceUrl || '') && !!partner.verifiedAt && Number.isFinite(new Date(partner.verifiedAt).getTime());
}
