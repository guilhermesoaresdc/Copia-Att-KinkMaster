import { LucideIcon } from 'lucide-react';

export type TargetAudience = 'Homens' | 'Mulheres' | 'LGBT+';

export interface ProductContent {
  introTitle: string;
  introDesc: string;
  bumpTitle: string;
  bumpDesc: string;
  bumpPrice: number;
  checkoutUrl: string;
  bundleUrl: string;
}

export interface FetishData {
  id: string;
  rank: number;
  title: string;
  iconName: string; 
  color: string;    
  popularity: number;
  stats: {
    men: string;
    women: string;
    lgbt: string;
  };
  products: {
    Homens: ProductContent;
    Mulheres: ProductContent;
    'LGBT+': ProductContent;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  birth_date?: string;
  city?: string;
  state?: string;
  cep: string;
  avatar_url: string;
  preference?: TargetAudience;
  terms_accepted?: boolean; // Novo campo
}

export const CLUB_CHECKOUT_URL = "https://checkout.ticto.com.br/SEU_LINK_ASSINATURA";