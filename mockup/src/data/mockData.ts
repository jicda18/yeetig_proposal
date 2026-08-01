export type ReferralStatus = 'Active' | 'In Progress' | 'Inactive'

export interface Referral {
  id: number
  company: string
  contactName: string
  registeredDate: string
  status: ReferralStatus
  commissionRate: number
  commissionEarned: number
}

export interface ClientPayment {
  id: number
  company: string
  contactName: string
  amountReceived: number
  commissionRate: number
  commissionEarned: number
  date: string
}

export interface Payout {
  id: number
  method: string
  reference: string
  amount: number
  status: 'PAID' | 'PENDING' | 'PROCESSING'
  date: string
}

export type CampaignStatus = 'Active' | 'Pending' | 'Archived' | 'In Progress'

export interface CampaignRow {
  id: number
  name: string
  partner: string
  category: string
  status: CampaignStatus
  revenue: number
  leads: number
  conversionRate: number
  startDate: string
}

export type ClientTier = 'Enterprise' | 'Pro' | 'Starter'
export type ClientStatus = 'Active' | 'Onboarding' | 'Inactive'

export interface ClientRow {
  id: number
  name: string
  company: string
  email: string
  phone: string
  tier: ClientTier
  status: ClientStatus
  totalSpent: number
  lastActivity: string
}

export const referrals: Referral[] = [
  {
    id: 1,
    company: 'TechNova Solutions',
    contactName: 'Charles Mendez',
    registeredDate: '2024-06-15',
    status: 'Active',
    commissionRate: 10,
    commissionEarned: 3250.0,
  },
  {
    id: 2,
    company: 'Forest Coffee Co.',
    contactName: 'Lucy Ramirez',
    registeredDate: '2024-07-02',
    status: 'Active',
    commissionRate: 10,
    commissionEarned: 1820.0,
  },
  {
    id: 3,
    company: 'Andean Builders Corp.',
    contactName: 'Peter Velasquez',
    registeredDate: '2024-07-20',
    status: 'In Progress',
    commissionRate: 12,
    commissionEarned: 0.0,
  },
  {
    id: 4,
    company: 'Urban Fashion Inc.',
    contactName: 'Sophie Castro',
    registeredDate: '2024-08-05',
    status: 'Active',
    commissionRate: 10,
    commissionEarned: 980.0,
  },
  {
    id: 5,
    company: 'Express Logistics Ltd.',
    contactName: 'Diego Fernandez',
    registeredDate: '2024-08-18',
    status: 'Inactive',
    commissionRate: 8,
    commissionEarned: 0.0,
  },
]

export const clientPayments: ClientPayment[] = [
  {
    id: 1,
    company: 'TechNova Solutions',
    contactName: 'Charles Mendez',
    amountReceived: 2500.0,
    commissionRate: 10,
    commissionEarned: 250.0,
    date: '2024-08-15',
  },
  {
    id: 2,
    company: 'Forest Coffee Co.',
    contactName: 'Lucy Ramirez',
    amountReceived: 1800.0,
    commissionRate: 10,
    commissionEarned: 180.0,
    date: '2024-08-14',
  },
  {
    id: 3,
    company: 'Urban Fashion Inc.',
    contactName: 'Sophie Castro',
    amountReceived: 980.0,
    commissionRate: 10,
    commissionEarned: 98.0,
    date: '2024-08-10',
  },
  {
    id: 4,
    company: 'TechNova Solutions',
    contactName: 'Charles Mendez',
    amountReceived: 750.0,
    commissionRate: 10,
    commissionEarned: 75.0,
    date: '2024-08-02',
  },
  {
    id: 5,
    company: 'Forest Coffee Co.',
    contactName: 'Lucy Ramirez',
    amountReceived: 1200.0,
    commissionRate: 10,
    commissionEarned: 120.0,
    date: '2024-07-28',
  },
]

export const payouts: Payout[] = [
  {
    id: 1,
    method: 'ACH Transfer',
    reference: 'ACH-2024-0815',
    amount: 650.0,
    status: 'PAID',
    date: '2024-08-15',
  },
  {
    id: 2,
    method: 'ACH Transfer',
    reference: 'ACH-2024-0730',
    amount: 430.0,
    status: 'PAID',
    date: '2024-07-30',
  },
  {
    id: 3,
    method: 'ACH Transfer',
    reference: 'ACH-2024-0715',
    amount: 520.0,
    status: 'PAID',
    date: '2024-07-15',
  },
  {
    id: 4,
    method: 'ACH Transfer',
    reference: 'ACH-2024-0701',
    amount: 380.0,
    status: 'PAID',
    date: '2024-07-01',
  },
  {
    id: 5,
    method: 'ACH Transfer',
    reference: 'ACH-2024-0615',
    amount: 610.0,
    status: 'PAID',
    date: '2024-06-15',
  },
]

export const recentPayments = clientPayments.slice(0, 4)

export const referralCounts = {
  total: referrals.length,
  active: referrals.filter((r) => r.status === 'Active').length,
  inProgress: referrals.filter((r) => r.status === 'In Progress').length,
  inactive: referrals.filter((r) => r.status === 'Inactive').length,
}

export const campaigns: CampaignRow[] = [
  {
    id: 1,
    name: 'Q3 Enterprise Push',
    partner: 'TechNova Solutions',
    category: 'SaaS',
    status: 'Active',
    revenue: 48200,
    leads: 134,
    conversionRate: 18.7,
    startDate: '2024-07-01',
  },
  {
    id: 2,
    name: 'Summer Retail Boost',
    partner: 'Urban Fashion Inc.',
    category: 'Retail',
    status: 'Active',
    revenue: 21500,
    leads: 87,
    conversionRate: 12.4,
    startDate: '2024-06-15',
  },
  {
    id: 3,
    name: 'Coffee Chain Expansion',
    partner: 'Forest Coffee Co.',
    category: 'F&B',
    status: 'Pending',
    revenue: 0,
    leads: 22,
    conversionRate: 0,
    startDate: '2024-08-20',
  },
  {
    id: 4,
    name: 'Logistics Network Scale',
    partner: 'Express Logistics Ltd.',
    category: 'Logistics',
    status: 'Archived',
    revenue: 9800,
    leads: 40,
    conversionRate: 8.5,
    startDate: '2024-04-01',
  },
  {
    id: 5,
    name: 'Construction SMB Drive',
    partner: 'Andean Builders Corp.',
    category: 'Construction',
    status: 'In Progress',
    revenue: 6100,
    leads: 55,
    conversionRate: 10.9,
    startDate: '2024-07-20',
  },
  {
    id: 6,
    name: 'Healthcare Alliance',
    partner: 'MedLink Partners',
    category: 'Healthcare',
    status: 'Active',
    revenue: 33700,
    leads: 96,
    conversionRate: 22.1,
    startDate: '2024-05-10',
  },
  {
    id: 7,
    name: 'Fintech Bridge Program',
    partner: 'CapVenture Group',
    category: 'Finance',
    status: 'Active',
    revenue: 52900,
    leads: 160,
    conversionRate: 24.3,
    startDate: '2024-06-01',
  },
  {
    id: 8,
    name: 'EdTech Launch',
    partner: 'BrightLearn Academy',
    category: 'Education',
    status: 'Pending',
    revenue: 0,
    leads: 14,
    conversionRate: 0,
    startDate: '2024-09-01',
  },
  {
    id: 9,
    name: 'Real Estate Digital',
    partner: 'PrimeSpace Realty',
    category: 'Real Estate',
    status: 'Active',
    revenue: 18400,
    leads: 72,
    conversionRate: 15.3,
    startDate: '2024-07-05',
  },
  {
    id: 10,
    name: 'Legacy Media Pilot',
    partner: 'BroadReach Media',
    category: 'Media',
    status: 'Archived',
    revenue: 4500,
    leads: 30,
    conversionRate: 6.7,
    startDate: '2024-02-15',
  },
]

export const clientsList: ClientRow[] = [
  {
    id: 101,
    name: 'Alexander Wright',
    company: 'TechNova Solutions',
    email: 'alex@technova.io',
    phone: '+1 (555) 234-5678',
    tier: 'Enterprise',
    status: 'Active',
    totalSpent: 32500,
    lastActivity: '2024-08-01',
  },
  {
    id: 102,
    name: 'Eleanor Vance',
    company: 'Forest Coffee Co.',
    email: 'eleanor@forestcoffee.com',
    phone: '+1 (555) 876-5432',
    tier: 'Pro',
    status: 'Active',
    totalSpent: 18200,
    lastActivity: '2024-07-31',
  },
  {
    id: 103,
    name: 'Marcus Thorne',
    company: 'Andean Builders Corp.',
    email: 'm.thorne@andeanbuilders.com',
    phone: '+1 (555) 345-6789',
    tier: 'Enterprise',
    status: 'Onboarding',
    totalSpent: 0,
    lastActivity: '2024-07-28',
  },
  {
    id: 104,
    name: 'Sophia Loren',
    company: 'Urban Fashion Inc.',
    email: 'sophia@urbanfashion.com',
    phone: '+1 (555) 987-6543',
    tier: 'Starter',
    status: 'Active',
    totalSpent: 9800,
    lastActivity: '2024-08-01',
  },
  {
    id: 105,
    name: 'David Miller',
    company: 'Express Logistics Ltd.',
    email: 'david@expresslogistics.net',
    phone: '+1 (555) 456-7890',
    tier: 'Pro',
    status: 'Inactive',
    totalSpent: 4500,
    lastActivity: '2024-06-12',
  },
  {
    id: 106,
    name: 'Grace Hopper',
    company: 'MedLink Partners',
    email: 'ghopper@medlink.org',
    phone: '+1 (555) 654-3210',
    tier: 'Enterprise',
    status: 'Active',
    totalSpent: 54100,
    lastActivity: '2024-07-30',
  },
]
