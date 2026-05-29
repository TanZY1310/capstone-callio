const users = [
    {
        id: 1,
        name: "Sarah Chen",
        breadcrumb: { parent: "Lead Pipeline", current: "Sarah Chen" },
        contact: {
            email: "sarah.chen@email.com",
            phone: "+1 (555) 123-4567",
            preferences: "3BR, Modern, Downtown"
        },
        status: "hot",
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-10 14:32", connected: true },
            { id: 2, name: "WhatsApp Linked", lastSync: "2026-05-11 09:15", connected: true }
        ]
    },
    {
        id: 2,
        name: "James Lim",
        breadcrumb: { parent: "Lead Pipeline", current: "James Lim" },
        contact: {
            email: "james.lim@email.com",
            phone: "+1 (555) 987-6543",
            preferences: "2BR, Minimalist, Suburban"
        },
        status: "warm",
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-09 11:20", connected: true },
            { id: 2, name: "WhatsApp Linked", lastSync: "2026-05-10 15:45", connected: false }
        ]
    },
    {
        id: 3,
        name: "Aisha Rahman",
        breadcrumb: { parent: "Lead Pipeline", current: "Aisha Rahman" },
        contact: {
            email: "aisha.rahman@email.com",
            phone: "+60 (11) 234-5678",
            preferences: "3BR, Contemporary, KLCC area"
        },
        status: "hot",
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-12 09:00", connected: true },
            { id: 2, name: "WhatsApp Linked", lastSync: "2026-05-12 09:05", connected: true }
        ]
    },
    {
        id: 4,
        name: "David Tan",
        breadcrumb: { parent: "Lead Pipeline", current: "David Tan" },
        contact: {
            email: "david.tan@email.com",
            phone: "+60 (12) 345-6789",
            preferences: "2BR, Furnished, Mont Kiara"
        },
        status: "cold",
        syncStatus: [
            { id: 1, name: "Google Sheets Not Connected", lastSync: "", connected: false },
            { id: 2, name: "WhatsApp Not Linked", lastSync: "", connected: false }
        ]
    },
    {
        id: 5,
        name: "Priya Nair",
        breadcrumb: { parent: "Lead Pipeline", current: "Priya Nair" },
        contact: {
            email: "priya.nair@email.com",
            phone: "+60 (16) 456-7890",
            preferences: "1BR, Pet-friendly, Bangsar"
        },
        status: "warm",
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-14 16:30", connected: true },
            { id: 2, name: "WhatsApp Not Linked", lastSync: "", connected: false }
        ]
    }
];

export default users;