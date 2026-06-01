const users = [
    {
        id: 1,
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        phone: "+1 (555) 123-4567",
        budgetMin: "$800K",
        budgetMax: "$1.2M",
        preferences: "3BR, Modern, Downtown",
        status: "No Pickup",
        lastContact: "2026-05-10",
        breadcrumb: { parent: "Lead Pipeline", current: "Sarah Chen" },
        contact: {
            email: "sarah.chen@email.com",
            phone: "+1 (555) 123-4567",
            preferences: "3BR, Modern, Downtown"
        },
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-10 14:32", connected: true },
            { id: 2, name: "WhatsApp Linked", lastSync: "2026-05-11 09:15", connected: true }
        ]
    },
    {
        id: 2,
        name: "James Lim",
        email: "james.lim@email.com",
        phone: "+1 (555) 987-6543",
        budgetMin: "$500K",
        budgetMax: "$750K",
        preferences: "2BR, Minimalist, Suburban",
        status: "Whatsapp",
        lastContact: "2026-05-08",
        breadcrumb: { parent: "Lead Pipeline", current: "James Lim" },
        contact: {
            email: "james.lim@email.com",
            phone: "+1 (555) 987-6543",
            preferences: "2BR, Minimalist, Suburban"
        },
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-09 11:20", connected: true },
            { id: 2, name: "WhatsApp Linked", lastSync: "2026-05-10 15:45", connected: false }
        ]
    },
    {
        id: 3,
        name: "Aisha Rahman",
        email: "aisha.rahman@email.com",
        phone: "+60 (11) 234-5678",
        budgetMin: "$600K",
        budgetMax: "$900K",
        preferences: "3BR, Contemporary, KLCC area",
        status: "Pending Appointment",
        lastContact: "2026-04-28",
        breadcrumb: { parent: "Lead Pipeline", current: "Aisha Rahman" },
        contact: {
            email: "aisha.rahman@email.com",
            phone: "+60 (11) 234-5678",
            preferences: "3BR, Contemporary, KLCC area"
        },
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-12 09:00", connected: true },
            { id: 2, name: "WhatsApp Linked", lastSync: "2026-05-12 09:05", connected: true }
        ]
    },
    {
        id: 4,
        name: "David Tan",
        email: "david.tan@email.com",
        phone: "+60 (12) 345-6789",
        budgetMin: "$400K",
        budgetMax: "$600K",
        preferences: "2BR, Furnished, Mont Kiara",
        status: "Completed",
        lastContact: "2026-05-11",
        breadcrumb: { parent: "Lead Pipeline", current: "David Tan" },
        contact: {
            email: "david.tan@email.com",
            phone: "+60 (12) 345-6789",
            preferences: "2BR, Furnished, Mont Kiara"
        },
        syncStatus: [
            { id: 1, name: "Google Sheets Not Connected", lastSync: "", connected: false },
            { id: 2, name: "WhatsApp Not Linked", lastSync: "", connected: false }
        ]
    },
    {
        id: 5,
        name: "Priya Nair",
        email: "priya.nair@email.com",
        phone: "+60 (16) 456-7890",
        budgetMin: "$300K",
        budgetMax: "$500K",
        preferences: "1BR, Pet-friendly, Bangsar",
        status: "Whatsapp",
        lastContact: "2026-05-14",
        breadcrumb: { parent: "Lead Pipeline", current: "Priya Nair" },
        contact: {
            email: "priya.nair@email.com",
            phone: "+60 (16) 456-7890",
            preferences: "1BR, Pet-friendly, Bangsar"
        },
        syncStatus: [
            { id: 1, name: "Google Sheets Connected", lastSync: "2026-05-14 16:30", connected: true },
            { id: 2, name: "WhatsApp Not Linked", lastSync: "", connected: false }
        ]
    }
];

export default users;