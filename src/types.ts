export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'product' | 'compensation' | 'analysis';
  date: string;
  imageUrl?: string;
  externalUrl?: string;
}

export interface SiteSettings {
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  pointColor: string;
  fontFamily: string;
  logoUrl?: string;
  kakaoUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}
