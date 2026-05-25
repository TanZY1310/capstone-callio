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
    }
];

export default users;