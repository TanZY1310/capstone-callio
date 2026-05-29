const dummyWAHistory = [
  {
    userID: 1,
    messages: [
      {
        id: 1,
        role: "client",
        content: "Hi, I saw the listing for the Downtown Loft. Is it still available for a viewing this Saturday?",
        timestamp: "2026-05-10T09:42:00Z",
        seen: "2026-05-10T09:43:00Z"
      },
      {
        id: 2,
        role: "agent",
        content: "Hello Sarah! Yes, it's available. I have a slot at 2:00 PM. Would that work for you?",
        timestamp: "2026-05-10T09:45:00Z",
        seen: null
      },
      {
        id: 3,
        role: "client",
        content: "That works perfectly. Please send me the address and any entry instructions.",
        timestamp: "2026-05-10T09:47:00Z",
        seen: "2026-05-10T09:48:00Z"
      },
      {
        id: 4,
        role: "agent",
        content: "The address is 12 Jalan Bukit Bintang, KL. Just buzz unit 3B at the entrance. See you Saturday!",
        timestamp: "2026-05-10T09:50:00Z",
        seen: null
      },
      {
        id: 5,
        role: "client",
        content: "Perfect, thank you! One more thing — is parking available?",
        timestamp: "2026-05-11T08:30:00Z",
        seen: "2026-05-11T08:31:00Z"
      },
      {
        id: 6,
        role: "agent",
        content: "Yes, there are 2 covered bays included with the unit.",
        timestamp: "2026-05-11T08:35:00Z",
        seen: null
      }
    ]
  },
  {
    userID: 2,
    messages: [
      {
        id: 1,
        role: "client",
        content: "Good morning, I'm interested in the Mont Kiara condo. What's the asking price?",
        timestamp: "2026-05-12T08:15:00Z",
        seen: "2026-05-12T08:16:00Z"
      },
      {
        id: 2,
        role: "agent",
        content: "Good morning! It's listed at RM 1.2M. Would you like to arrange a viewing?",
        timestamp: "2026-05-12T08:20:00Z",
        seen: null
      },
      {
        id: 3,
        role: "client",
        content: "Yes please. I'm free this weekend.",
        timestamp: "2026-05-12T08:22:00Z",
        seen: "2026-05-12T08:23:00Z"
      }
    ]
  },
  {
    userID: 3,
    messages: [
      {
        id: 1,
        role: "client",
        content: "Hi, does the Bangsar unit come furnished?",
        timestamp: "2026-05-15T14:00:00Z",
        seen: "2026-05-15T14:01:00Z"
      },
      {
        id: 2,
        role: "agent",
        content: "Yes, fully furnished with built-in kitchen and wardrobe.",
        timestamp: "2026-05-15T14:05:00Z",
        seen: null
      },
      {
        id: 3,
        role: "client",
        content: "Great. Can I get the floor plan?",
        timestamp: "2026-05-15T14:07:00Z",
        seen: "2026-05-15T14:08:00Z"
      },
      {
        id: 4,
        role: "agent",
        content: "Sure, I'll send it over shortly.",
        timestamp: "2026-05-15T14:10:00Z",
        seen: null
      },
      {
        id: 5,
        role: "client",
        content: "Also, is the maintenance fee included in the rental?",
        timestamp: "2026-05-16T09:00:00Z",
        seen: "2026-05-16T09:01:00Z"
      }
    ]
  },
  {
    userID: 4,
    messages: []
  },
  {
    userID: 5,
    messages: []
  }
];

export default dummyWAHistory;