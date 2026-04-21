/**
 * Shared mock story data for the Impact Wall and Story Detail pages.
 * Each story contains the full editorial content needed for the detail page.
 */

export interface ImpactStory {
  id: string
  photo_url: string
  caption: string
  title: string
  content: string[]  // Array of paragraphs
  gallery: string[]  // Additional images
  stats: {
    funded_amount: string
    backers: number
    days_to_fund: number
    item_funded: string
  }
  profile: {
    name: string
    trade_category: string
    location_lga: string
    location_state: string
    badge_level: string
    photo_url: string
    years_experience: number
  }
  published_at: string
}

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: "mock-1",
    photo_url: "/images/profiles/ibrahim_profile_1776774679869.png",
    caption: "The industrial welding machine transformed my output. I can now take on three times as many projects.",
    title: "From Roadside Welder to Industrial Contractor",
    content: [
      "Ibrahim started welding at age 14, learning from his uncle at a small roadside workshop in Kano. For over a decade, he worked with a borrowed arc welding machine that limited him to basic gate fabrication and simple repairs.",
      "When his uncle retired, Ibrahim inherited the workshop but not the tools. He was stuck doing small jobs that barely covered rent. 'I could see the bigger contracts going to workshops with better equipment,' he recalls. 'I knew what I needed, but I couldn't afford it on my own.'",
      "Through BuildBridge, Ibrahim's need for an industrial TIG welding machine was posted and verified. Within 18 days, 23 backers from across Nigeria and the diaspora funded the full ₦450,000 cost.",
      "The impact was immediate. Within the first month, Ibrahim secured two commercial contracts for steel staircase fabrication — work that was impossible with his old arc welder. His monthly revenue tripled from ₦80,000 to over ₦250,000.",
      "'The machine didn't just change my work — it changed how people see me,' Ibrahim says. 'Now contractors come to me. I've hired two apprentices and I'm training them the way my uncle trained me. That's the real impact.'",
      "Ibrahim has since completed his first Need successfully and uploaded proof-of-use photos, earning his Level 4 Platform Verified badge. He's now saving to expand his workshop space."
    ],
    gallery: [
      "/images/profiles/ibrahim_profile_1776774679869.png",
      "/images/profiles/ibrahim_profile_1776774679869.png",
      "/images/profiles/ibrahim_profile_1776774679869.png",
    ],
    stats: {
      funded_amount: "₦450,000",
      backers: 23,
      days_to_fund: 18,
      item_funded: "Industrial TIG Welding Machine"
    },
    profile: {
      name: "Ibrahim S.",
      trade_category: "welding",
      location_lga: "Kano",
      location_state: "Kano",
      badge_level: "level_4_platform_verified",
      photo_url: "/images/profiles/ibrahim_profile_1776774679869.png",
      years_experience: 12,
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-2",
    photo_url: "/images/profiles/amina_profile_1776774856536.png",
    caption: "I moved from one machine to a full sewing workshop. BuildBridge backers made my shop ownership possible.",
    title: "One Machine to a Full Workshop: Amina's Fashion Journey",
    content: [
      "Amina learned tailoring from her mother in Abeokuta before moving to Lagos at 19 to pursue her dream of running a fashion workshop. For five years, she worked from a rented corner of a shared shop with a single domestic sewing machine.",
      "'I was turning away customers every week,' Amina explains. 'Aso-oke finishing, buttonhole work, overlocking — I had to send people to other tailors because my machine couldn't handle it. It was heartbreaking.'",
      "A community leader in Lekki who had been Amina's customer for years vouched for her on BuildBridge. Her Need for an industrial overlock machine was posted, and the response was overwhelming.",
      "Fourteen backers funded her ₦350,000 need in just 12 days. But the real surprise came after: three of her backers connected her with bulk uniform contracts for a local private school.",
      "Today, Amina's workshop operates with three machines: her original domestic, the funded overlock, and a buttonhole machine she purchased from her increased earnings. She employs one full-time assistant and trains two apprentices.",
      "'BuildBridge didn't just give me a machine,' she says with a smile. 'It gave me a network of people who believed in me before they even met me. That belief is worth more than any equipment.'"
    ],
    gallery: [
      "/images/profiles/amina_profile_1776774856536.png",
      "/images/profiles/amina_profile_1776774856536.png",
      "/images/profiles/amina_profile_1776774856536.png",
    ],
    stats: {
      funded_amount: "₦350,000",
      backers: 14,
      days_to_fund: 12,
      item_funded: "Industrial Overlock Machine"
    },
    profile: {
      name: "Amina J.",
      trade_category: "fashion",
      location_lga: "Lekki",
      location_state: "Lagos",
      badge_level: "level_3_established",
      photo_url: "/images/profiles/amina_profile_1776774856536.png",
      years_experience: 8,
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-3",
    photo_url: "/images/profiles/chidi_profile_1776774911497.png",
    caption: "With my new precision planer, I am finishing furniture sets in half the time with zero waste.",
    title: "Precision Meets Passion: Chidi's Woodworking Transformation",
    content: [
      "Chidi's hands tell the story of 15 years in woodwork. 'I can feel the grain of any timber blindfolded,' he says, running his fingers across a finished dining table in his Enugu workshop. But for most of those years, his craftsmanship was limited by the tools he could afford.",
      "A hand planer and manual sanding were his primary finishing methods. Each piece of furniture took him nearly a week to complete, and the quality, while good, couldn't compete with machine-finished products from larger workshops.",
      "'My customers loved my joinery work, but they'd ask me to match the finish of factory furniture,' Chidi recalls. 'I couldn't. Not with hand tools alone.'",
      "When Chidi's profile was verified on BuildBridge — vouched for by two previous customers and a local community leader — his need for a precision wood planer was funded by 22 backers in just 10 days. The total: ₦520,000.",
      "The results were dramatic. Chidi now completes furniture sets in half the time, with a mirror-smooth finish that rivals any factory output. His waste reduction alone saved him ₦40,000 in the first month, as the planer produces uniform boards with minimal material loss.",
      "He has since completed four custom kitchen sets, a church altar, and a set of office desks for a local startup. 'The planer didn't just improve my finish,' he says. 'It gave me time. Time to take on more projects, time to design new pieces, time to teach my apprentice properly.'"
    ],
    gallery: [
      "/images/profiles/chidi_profile_1776774911497.png",
      "/images/profiles/chidi_profile_1776774911497.png",
      "/images/profiles/chidi_profile_1776774911497.png",
    ],
    stats: {
      funded_amount: "₦520,000",
      backers: 22,
      days_to_fund: 10,
      item_funded: "Precision Wood Planer"
    },
    profile: {
      name: "Chidi O.",
      trade_category: "woodwork",
      location_lga: "Enugu",
      location_state: "Enugu",
      badge_level: "level_4_platform_verified",
      photo_url: "/images/profiles/chidi_profile_1776774911497.png",
      years_experience: 15,
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-4",
    photo_url: "/images/profiles/grace_profile_1776775079641.png",
    caption: "My salon now serves 40 clients daily, up from 12. The dryer stations changed everything for my business.",
    title: "Grace's Salon Revolution: Serving 40 Clients a Day",
    content: [
      "Grace opened her hair salon in Ikeja with nothing but a chair, a mirror, and determination. For three years, she relied on a single handheld dryer, which meant each client spent over an hour waiting for their hair to dry. 'I was losing clients to the salon down the street,' she admits. 'They had proper dryer stations.'",
      "A regular customer suggested she look into BuildBridge after hearing about the platform from a friend. Grace was skeptical at first — 'I thought it was too good to be true' — but the verification process convinced her it was legitimate.",
      "Her need for two professional dryer stations and a hooded dryer was funded by 12 backers contributing a total of ₦180,000. The stations arrived within a week of the funding goal being met.",
      "The transformation was immediate. Grace's daily client capacity jumped from 12 to 40. She hired a second stylist and an apprentice. Her monthly revenue more than tripled.",
      "'The best part isn't the money,' Grace says, adjusting a client's hair under one of her new dryer stations. 'It's that my clients are comfortable now. They sit, they relax, they chat. My salon became a community space. Women come here not just for their hair, but to connect.'",
      "Grace is now planning to expand into a larger space next door. She credits BuildBridge not just for the equipment, but for the confidence boost that came from knowing strangers believed in her dream."
    ],
    gallery: [
      "/images/profiles/grace_profile_1776775079641.png",
      "/images/profiles/grace_profile_1776775079641.png",
      "/images/profiles/grace_profile_1776775079641.png",
    ],
    stats: {
      funded_amount: "₦180,000",
      backers: 12,
      days_to_fund: 8,
      item_funded: "Professional Dryer Stations"
    },
    profile: {
      name: "Grace N.",
      trade_category: "hair_styling",
      location_lga: "Ikeja",
      location_state: "Lagos",
      badge_level: "level_2_trusted_tradesperson",
      photo_url: "/images/profiles/grace_profile_1776775079641.png",
      years_experience: 6,
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-5",
    photo_url: "/images/profiles/fatima_profile_1776775065422.png",
    caption: "From a roadside oven to a proper bakery. Now I supply bread to three communities and employ two helpers.",
    title: "Rising Dough: How Fatima Built a Bakery from Nothing",
    content: [
      "Fatima started baking at 16, learning from her grandmother in Kano. By 22, she had established a small roadside operation with a locally fabricated clay oven. Her bread was legendary in her neighborhood — golden, fragrant, and always sold out by noon.",
      "But the clay oven had limits. It could only produce 50 loaves per batch, took hours to heat, and was unreliable during the rainy season. 'When it rained, I couldn't bake,' Fatima says. 'My customers would go to the factory bread sellers instead.'",
      "A cooperative member who knew about BuildBridge helped Fatima create her profile and submit her need for a commercial baking oven. The ₦280,000 target was reached with contributions from 7 backers over 15 days.",
      "The commercial oven changed everything. Fatima now produces 200 loaves per batch, three batches a day. She supplies bread to three different communities and has hired two helpers — both young women she's training in the craft.",
      "'My grandmother would be so proud,' Fatima reflects, watching her helpers shape dough in the early morning light. 'She taught me that bread feeds more than the body — it feeds the community. Now I can feed three communities instead of one.'",
      "Fatima is currently saving for a second oven and dreams of opening a training school for young bakers. Her success on BuildBridge earned her the Established badge, and she's now eligible for larger funding requests."
    ],
    gallery: [
      "/images/profiles/fatima_profile_1776775065422.png",
      "/images/profiles/fatima_profile_1776775065422.png",
      "/images/profiles/fatima_profile_1776775065422.png",
    ],
    stats: {
      funded_amount: "₦280,000",
      backers: 7,
      days_to_fund: 15,
      item_funded: "Commercial Baking Oven"
    },
    profile: {
      name: "Fatima B.",
      trade_category: "baking",
      location_lga: "Kano Municipal",
      location_state: "Kano",
      badge_level: "level_3_established",
      photo_url: "/images/profiles/fatima_profile_1776775065422.png",
      years_experience: 10,
    },
    published_at: new Date().toISOString()
  }
]
