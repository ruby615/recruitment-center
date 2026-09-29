import type {
  Candidate,
  CandidateType,
  CvFile,
  Deal,
  FormSubmission,
  Owner,
  Region,
} from "./types";

export const OWNERS: Owner[] = [
  { id: "own_sophie", name: "Sophie Vermeulen" },
  { id: "own_jonas", name: "Jonas Peeters" },
  { id: "own_lena", name: "Lena Dubois" },
  { id: "own_marco", name: "Marco Rossi" },
];

export function ownerName(ownerId: string) {
  return OWNERS.find((owner) => owner.id === ownerId)?.name ?? "Unassigned";
}

export function fullName(person: { firstName: string; lastName: string }) {
  return `${person.firstName} ${person.lastName}`;
}

export function photoUrl(file: string) {
  return `${import.meta.env.BASE_URL}avatars/${file}`;
}

export function dealCounts(candidate: Candidate) {
  const outcomes = [
    ...candidate.pastDeals.map((deal) => deal.outcome),
    candidate.currentDeal.outcome,
  ];
  return {
    successful: outcomes.filter((outcome) => outcome === "successful").length,
    rejected: outcomes.filter((outcome) => outcome === "rejected").length,
  };
}

function currentDeal(input: {
  id: string;
  name: string;
  stage: string;
  lastActivity: string;
  lastActivityDate: string;
  priority: string;
  source: string;
  created: string;
  type: CandidateType;
  region: Region;
  location: string;
}): Deal {
  return {
    id: input.id,
    name: input.name,
    stage: input.stage,
    outcome: "open",
    lastActivity: input.lastActivity,
    lastActivityDate: input.lastActivityDate,
    properties: [
      { label: "Deal name", value: input.name },
      { label: "Pipeline", value: "Recruitment" },
      { label: "Deal stage", value: input.stage },
      { label: "Priority", value: input.priority },
      { label: "Source", value: input.source },
      { label: "Created", value: input.created },
      { label: "Candidate type", value: input.type },
      { label: "Region", value: input.region },
      { label: "Residential location", value: input.location },
    ],
  };
}

function applicationForm(
  submittedAt: string,
  fields: FormSubmission["fields"],
): FormSubmission {
  return { title: "Candidate application", submittedAt, fields };
}

const amaraCv: CvFile = {
  fileName: "Amara-Diallo-CV.pdf",
  uploadedAt: "18 Sep 2026",
  source: "WhatsApp",
  profile:
    "Nurse with six years in residential care. Calm with new residents, confident with medication rounds, and used to coordinating with families.",
  experience: [
    {
      role: "Nurse",
      place: "Residence Les Tilleuls",
      period: "Mar 2023 – Jan 2025",
    },
    {
      role: "Nurse assistant",
      place: "Home Astrid",
      period: "Jun 2021 – Feb 2023",
    },
  ],
  education: "Bachelor of Nursing, Thomas More, 2021",
  languages: "French, Dutch, English",
};

export const seedCandidates: Candidate[] = [
  {
    id: "cand_amara",
    photo: "amara.jpg",
    firstName: "Amara",
    lastName: "Diallo",
    email: "amara.diallo@email.com",
    phone: "+32 470 11 20 01",
    type: "Nurse",
    residentialLocation: "Antwerp",
    region: "North",
    ownerId: "own_sophie",
    aircallStatus: "Not called",
    currentDeal: currentDeal({
      id: "deal_amara",
      name: "Home Zonnebloem — Nurse",
      stage: "Appointment to be scheduled",
      lastActivity: "Candidate CV uploaded via WhatsApp",
      lastActivityDate: "18 Sep 2026",
      priority: "High",
      source: "WhatsApp",
      created: "16 Sep 2026",
      type: "Nurse",
      region: "North",
      location: "Antwerp",
    }),
    pastDeals: [
      {
        id: "past_amara_1",
        name: "Residence Les Tilleuls",
        stage: "Closed won",
        outcome: "successful",
        closedDate: "14 Jan 2025",
      },
      {
        id: "past_amara_2",
        name: "Clinic Noord",
        stage: "Closed lost",
        outcome: "rejected",
        closedDate: "2 Nov 2024",
        rejectReason: "Schedule mismatch",
      },
    ],
    relatedContacts: [
      {
        id: "rel_amara_1",
        name: "Aïcha Diallo",
        photo: "aicha.jpg",
        phone: "+32 470 55 18 22",
        email: "aicha.diallo@email.com",
        matchedBy: "name",
      },
      {
        id: "rel_amara_2",
        name: "Amara D.",
        photo: "amara.jpg",
        phone: "+32 470 11 20 01",
        email: "amara.d@email.com",
        matchedBy: "phone",
      },
    ],
    previousClients: [
      {
        id: "client_amara_1",
        name: "Residence Les Tilleuls",
        role: "Nurse",
        period: "Mar 2023 – Jan 2025",
      },
      {
        id: "client_amara_2",
        name: "Home Astrid",
        role: "Nurse assistant",
        period: "Jun 2021 – Feb 2023",
      },
    ],
    form: applicationForm("16 Sep 2026", [
      { label: "Role", value: "Nurse" },
      { label: "Years of experience", value: "6" },
      { label: "Languages", value: "French, Dutch, English" },
      { label: "Preferred shifts", value: "Day" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "6 Oct 2026" },
      { label: "Region", value: "North" },
    ]),
    cv: amaraCv,
  },
  {
    id: "cand_fatima",
    photo: "fatima.jpg",
    firstName: "Fatima",
    lastName: "El Amrani",
    email: "fatima.elamrani@email.com",
    phone: "+32 471 20 44 18",
    type: "Caregiver",
    residentialLocation: "Brussels",
    region: "Central",
    ownerId: "own_lena",
    aircallStatus: "Not called",
    currentDeal: currentDeal({
      id: "deal_fatima",
      name: "Maison Verte — Caregiver",
      stage: "CV review",
      lastActivity: "Application form submitted",
      lastActivityDate: "22 Sep 2026",
      priority: "High",
      source: "Website form",
      created: "22 Sep 2026",
      type: "Caregiver",
      region: "Central",
      location: "Brussels",
    }),
    pastDeals: [
      {
        id: "past_fatima_1",
        name: "Home Sint-Anna",
        stage: "Closed won",
        outcome: "successful",
        closedDate: "3 May 2025",
      },
    ],
    relatedContacts: [
      {
        id: "rel_fatima_1",
        name: "Youssef El Amrani",
        photo: "youssef.jpg",
        phone: "+32 472 90 11 04",
        email: "youssef.elamrani@email.com",
        matchedBy: "name",
      },
    ],
    previousClients: [
      {
        id: "client_fatima_1",
        name: "Home Sint-Anna",
        role: "Caregiver",
        period: "Aug 2024 – Apr 2025",
      },
    ],
    form: applicationForm("22 Sep 2026", [
      { label: "Role", value: "Caregiver" },
      { label: "Years of experience", value: "4" },
      { label: "Languages", value: "French, Arabic, Dutch" },
      { label: "Preferred shifts", value: "Evening" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "Immediately" },
      { label: "Region", value: "Central" },
    ]),
    cv: {
      fileName: "Fatima-El-Amrani-CV.pdf",
      uploadedAt: "22 Sep 2026",
      source: "Website form",
      profile:
        "Caregiver focused on daily living support. Experienced with dementia units and evening shifts.",
      experience: [
        {
          role: "Caregiver",
          place: "Home Sint-Anna",
          period: "Aug 2024 – Apr 2025",
        },
      ],
      education: "Care assistant certificate, 2022",
      languages: "French, Arabic, Dutch",
    },
  },
  {
    id: "cand_noah",
    photo: "noah.jpg",
    firstName: "Noah",
    lastName: "Janssen",
    email: "noah.janssen@email.com",
    phone: "+32 473 18 02 77",
    type: "Cleaner",
    residentialLocation: "Bruges",
    region: "West",
    ownerId: "own_jonas",
    aircallStatus: "Not called",
    currentDeal: currentDeal({
      id: "deal_noah",
      name: "Residence Duinzicht — Cleaner",
      stage: "Appointment to be scheduled",
      lastActivity: "Owner assigned",
      lastActivityDate: "25 Sep 2026",
      priority: "Medium",
      source: "Referral",
      created: "25 Sep 2026",
      type: "Cleaner",
      region: "West",
      location: "Bruges",
    }),
    pastDeals: [],
    relatedContacts: [],
    previousClients: [],
    form: applicationForm("25 Sep 2026", [
      { label: "Role", value: "Cleaner" },
      { label: "Years of experience", value: "2" },
      { label: "Languages", value: "Dutch" },
      { label: "Preferred shifts", value: "Morning" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "1 Oct 2026" },
      { label: "Region", value: "West" },
    ]),
    cv: {
      fileName: "Noah-Janssen-CV.pdf",
      uploadedAt: "25 Sep 2026",
      source: "Email",
      profile:
        "Cleaner looking for a first placement in residential care. Reliable on early shifts.",
      experience: [
        {
          role: "Cleaner",
          place: "Hotel Kapelle",
          period: "Jan 2024 – Aug 2026",
        },
      ],
      education: "Secondary school, Bruges",
      languages: "Dutch",
    },
  },
  {
    id: "cand_elena",
    photo: "elena.jpg",
    firstName: "Elena",
    lastName: "Popescu",
    email: "elena.popescu@email.com",
    phone: "+32 474 66 30 12",
    type: "Nurse",
    residentialLocation: "Leuven",
    region: "Central",
    ownerId: "own_sophie",
    aircallStatus: "No answer",
    currentDeal: currentDeal({
      id: "deal_elena",
      name: "Clinique Saint-Luc staffing — Nurse",
      stage: "Follow-up call",
      lastActivity: "Call via Aircall — no answer",
      lastActivityDate: "27 Sep 2026",
      priority: "High",
      source: "Indeed",
      created: "12 Sep 2026",
      type: "Nurse",
      region: "Central",
      location: "Leuven",
    }),
    pastDeals: [
      {
        id: "past_elena_1",
        name: "UZ weekend pool",
        stage: "Closed lost",
        outcome: "rejected",
        closedDate: "19 Aug 2025",
        rejectReason: "Distance too far",
      },
    ],
    relatedContacts: [
      {
        id: "rel_elena_1",
        name: "Elena Popescu",
        photo: "elena.jpg",
        phone: "+32 474 66 30 12",
        email: "e.popescu@email.com",
        matchedBy: "phone",
      },
    ],
    previousClients: [
      {
        id: "client_elena_1",
        name: "Spitalul Municipal",
        role: "Nurse",
        period: "2019 – 2024",
      },
    ],
    form: applicationForm("12 Sep 2026", [
      { label: "Role", value: "Nurse" },
      { label: "Years of experience", value: "7" },
      { label: "Languages", value: "Romanian, English, French" },
      { label: "Preferred shifts", value: "Night" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "13 Oct 2026" },
      { label: "Region", value: "Central" },
    ]),
    cv: {
      fileName: "Elena-Popescu-CV.pdf",
      uploadedAt: "12 Sep 2026",
      source: "Indeed",
      profile:
        "Hospital nurse moving into residential care. Strong on night shifts and wound care.",
      experience: [
        {
          role: "Nurse",
          place: "Spitalul Municipal",
          period: "2019 – 2024",
        },
      ],
      education: "Nursing diploma, Bucharest, 2019",
      languages: "Romanian, English, French",
    },
  },
  {
    id: "cand_malik",
    photo: "malik.jpg",
    firstName: "Malik",
    lastName: "Benali",
    email: "malik.benali@email.com",
    phone: "+32 475 01 88 43",
    type: "Coordinator",
    residentialLocation: "Charleroi",
    region: "South",
    ownerId: "own_marco",
    aircallStatus: "Not called",
    currentDeal: currentDeal({
      id: "deal_malik",
      name: "Groupe Solaire — Coordinator",
      stage: "Interview to schedule",
      lastActivity: "CV forwarded by previous client",
      lastActivityDate: "20 Sep 2026",
      priority: "Medium",
      source: "Referral",
      created: "9 Sep 2026",
      type: "Coordinator",
      region: "South",
      location: "Charleroi",
    }),
    pastDeals: [
      {
        id: "past_malik_1",
        name: "Aide & Présence",
        stage: "Closed won",
        outcome: "successful",
        closedDate: "11 Mar 2024",
      },
      {
        id: "past_malik_2",
        name: "Residence du Parc",
        stage: "Closed won",
        outcome: "successful",
        closedDate: "28 Jun 2025",
      },
      {
        id: "past_malik_3",
        name: "Night desk Charleroi",
        stage: "Closed lost",
        outcome: "rejected",
        closedDate: "4 Dec 2025",
        rejectReason: "Role already filled",
      },
    ],
    relatedContacts: [
      {
        id: "rel_malik_1",
        name: "Sara Benali",
        photo: "sara.jpg",
        phone: "+32 476 22 10 90",
        email: "sara.benali@email.com",
        matchedBy: "name",
      },
    ],
    previousClients: [
      {
        id: "client_malik_1",
        name: "Aide & Présence",
        role: "Team coordinator",
        period: "2022 – 2024",
      },
      {
        id: "client_malik_2",
        name: "Residence du Parc",
        role: "Shift coordinator",
        period: "2024 – 2025",
      },
    ],
    form: applicationForm("9 Sep 2026", [
      { label: "Role", value: "Coordinator" },
      { label: "Years of experience", value: "8" },
      { label: "Languages", value: "French, Dutch" },
      { label: "Preferred shifts", value: "Day" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "20 Oct 2026" },
      { label: "Region", value: "South" },
    ]),
    cv: {
      fileName: "Malik-Benali-CV.pdf",
      uploadedAt: "20 Sep 2026",
      source: "Referral",
      profile:
        "Coordinator who has run care teams of twelve. Comfortable planning rotas and covering calls when a shift drops.",
      experience: [
        {
          role: "Shift coordinator",
          place: "Residence du Parc",
          period: "2024 – 2025",
        },
        {
          role: "Team coordinator",
          place: "Aide & Présence",
          period: "2022 – 2024",
        },
      ],
      education: "Social work bachelor, 2018",
      languages: "French, Dutch",
    },
  },
  {
    id: "cand_ingrid",
    photo: "ingrid.jpg",
    firstName: "Ingrid",
    lastName: "Sørensen",
    email: "ingrid.sorensen@email.com",
    phone: "+32 476 40 15 63",
    type: "Caregiver",
    residentialLocation: "Hasselt",
    region: "East",
    ownerId: "own_jonas",
    aircallStatus: "In progress",
    currentDeal: currentDeal({
      id: "deal_ingrid",
      name: "Woonzorg Hof — Caregiver",
      stage: "Appointment to be scheduled",
      lastActivity: "Call started via Aircall",
      lastActivityDate: "28 Sep 2026",
      priority: "High",
      source: "WhatsApp",
      created: "18 Sep 2026",
      type: "Caregiver",
      region: "East",
      location: "Hasselt",
    }),
    pastDeals: [
      {
        id: "past_ingrid_1",
        name: "Summer cover Hasselt",
        stage: "Closed won",
        outcome: "successful",
        closedDate: "30 Aug 2025",
      },
    ],
    relatedContacts: [],
    previousClients: [
      {
        id: "client_ingrid_1",
        name: "Woonzorg Hof",
        role: "Holiday caregiver",
        period: "Jul 2025 – Aug 2025",
      },
    ],
    form: applicationForm("18 Sep 2026", [
      { label: "Role", value: "Caregiver" },
      { label: "Years of experience", value: "5" },
      { label: "Languages", value: "Dutch, English" },
      { label: "Preferred shifts", value: "Weekend" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "Immediately" },
      { label: "Region", value: "East" },
    ]),
    cv: {
      fileName: "Ingrid-Sorensen-CV.pdf",
      uploadedAt: "18 Sep 2026",
      source: "WhatsApp",
      profile:
        "Caregiver returning after a summer placement. Prefers weekend rotas close to Hasselt.",
      experience: [
        {
          role: "Holiday caregiver",
          place: "Woonzorg Hof",
          period: "Jul 2025 – Aug 2025",
        },
      ],
      education: "Care diploma, Hasselt, 2021",
      languages: "Dutch, English",
    },
  },
  {
    id: "cand_omar",
    photo: "omar.jpg",
    firstName: "Omar",
    lastName: "Haddad",
    email: "omar.haddad@email.com",
    phone: "+32 477 28 91 05",
    type: "Driver",
    residentialLocation: "Liège",
    region: "South",
    ownerId: "own_marco",
    aircallStatus: "Not called",
    currentDeal: currentDeal({
      id: "deal_omar",
      name: "Transport Sud — Driver",
      stage: "Appointment to be scheduled",
      lastActivity: "Candidate CV uploaded via WhatsApp",
      lastActivityDate: "26 Sep 2026",
      priority: "Low",
      source: "WhatsApp",
      created: "24 Sep 2026",
      type: "Driver",
      region: "South",
      location: "Liège",
    }),
    pastDeals: [
      {
        id: "past_omar_1",
        name: "School run Namur",
        stage: "Closed lost",
        outcome: "rejected",
        closedDate: "15 Feb 2026",
        rejectReason: "License category missing",
      },
    ],
    relatedContacts: [
      {
        id: "rel_omar_1",
        name: "Omar Haddad",
        photo: "omar.jpg",
        phone: "+32 477 28 91 05",
        email: "o.haddad@email.com",
        matchedBy: "phone",
      },
    ],
    previousClients: [
      {
        id: "client_omar_1",
        name: "Taxi Lumière",
        role: "Driver",
        period: "2023 – 2025",
      },
    ],
    form: applicationForm("24 Sep 2026", [
      { label: "Role", value: "Driver" },
      { label: "Years of experience", value: "9" },
      { label: "Languages", value: "French, Arabic" },
      { label: "License", value: "B" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "5 Oct 2026" },
      { label: "Region", value: "South" },
    ]),
    cv: {
      fileName: "Omar-Haddad-CV.pdf",
      uploadedAt: "26 Sep 2026",
      source: "WhatsApp",
      profile:
        "Driver with patient-transport experience. Holds a category B license and knows the Liège ring.",
      experience: [
        {
          role: "Driver",
          place: "Taxi Lumière",
          period: "2023 – 2025",
        },
      ],
      education: "Driving school certificate, category B",
      languages: "French, Arabic",
    },
  },
  {
    id: "cand_luca",
    photo: "luca.jpg",
    firstName: "Luca",
    lastName: "Moretti",
    email: "luca.moretti@email.com",
    phone: "+32 478 33 47 60",
    type: "Driver",
    residentialLocation: "Ghent",
    region: "East",
    ownerId: "own_lena",
    aircallStatus: "Completed",
    currentDeal: currentDeal({
      id: "deal_luca",
      name: "City rides Ghent — Driver",
      stage: "Offer drafted",
      lastActivity: "Call via Aircall — completed",
      lastActivityDate: "28 Sep 2026",
      priority: "Medium",
      source: "Website form",
      created: "8 Sep 2026",
      type: "Driver",
      region: "East",
      location: "Ghent",
    }),
    pastDeals: [
      {
        id: "past_luca_1",
        name: "Airport shuttle",
        stage: "Closed won",
        outcome: "successful",
        closedDate: "2 Apr 2026",
      },
    ],
    relatedContacts: [
      {
        id: "rel_luca_1",
        name: "Giulia Moretti",
        photo: "giulia.jpg",
        phone: "+32 479 12 00 48",
        email: "giulia.moretti@email.com",
        matchedBy: "name",
      },
    ],
    previousClients: [
      {
        id: "client_luca_1",
        name: "Airport shuttle East",
        role: "Driver",
        period: "Jan 2026 – Mar 2026",
      },
    ],
    form: applicationForm("8 Sep 2026", [
      { label: "Role", value: "Driver" },
      { label: "Years of experience", value: "11" },
      { label: "Languages", value: "Italian, Dutch, English" },
      { label: "License", value: "B, D" },
      { label: "Work authorization", value: "Yes" },
      { label: "Available from", value: "Immediately" },
      { label: "Region", value: "East" },
    ]),
    cv: {
      fileName: "Luca-Moretti-CV.pdf",
      uploadedAt: "8 Sep 2026",
      source: "Website form",
      profile:
        "Driver with bus and car licenses. Recently finished an airport shuttle contract in East Flanders.",
      experience: [
        {
          role: "Driver",
          place: "Airport shuttle East",
          period: "Jan 2026 – Mar 2026",
        },
      ],
      education: "Professional driving, category D, 2015",
      languages: "Italian, Dutch, English",
    },
  },
];

export const TODAY_LABEL = "29 Sep 2026";

export function cloneCandidates(): Candidate[] {
  return structuredClone(seedCandidates);
}
