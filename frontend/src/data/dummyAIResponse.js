const dummyAIResponse = [
  {
    userID: 1,
    responses: [
      {
        id: 1,
        role: "agent",
        content: "Hi Sarah! Just following up on your viewing this Saturday at 2:00 PM for the Downtown Loft. Please let me know if you need to reschedule.",
        timestamp: "2026-05-11T09:00:00Z",
        status: "pending"
      },
      {
        id: 2,
        role: "agent",
        content: "Also, I've attached the tenancy agreement for your review. Feel free to reach out if you have any questions.",
        timestamp: "2026-05-11T09:00:00Z",
        status: "pending"
      }
    ]
  },
  {
    userID: 2,
    responses: [
      {
        id: 1,
        role: "agent",
        content: "Hi! Confirming your viewing for the Mont Kiara condo this Saturday. The address is 8 Jalan Kiara, KL. See you then!",
        timestamp: "2026-05-12T09:00:00Z",
        status: "pending"
      }
    ]
  },
  {
    userID: 3,
    responses: [
      {
        id: 1,
        role: "agent",
        content: "Hi! Here's the floor plan for the Bangsar unit as requested. Let me know if you'd like to arrange a viewing.",
        timestamp: "2026-05-15T15:00:00Z",
        status: "pending"
      },
      {
        id: 2,
        role: "agent",
        content: "To answer your question — maintenance fee is RM 350/month and is not included in the rental price.",
        timestamp: "2026-05-16T09:30:00Z",
        status: "pending"
      }
    ]
  },
  {
    userID: 4,
    responses: []
  },
  {
    userID: 5,
    responses: []
  }
];

export default dummyAIResponse;