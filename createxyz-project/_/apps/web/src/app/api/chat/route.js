import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { agent_id, message, conversation_id } = body;

    if (!agent_id || !message) {
      return Response.json(
        { error: 'Agent ID and message are required' },
        { status: 400 }
      );
    }

    // Get agent details for context
    const agents = await sql`
      SELECT id, name, specialty, prompt_instructions
      FROM ai_agents
      WHERE id = ${parseInt(agent_id)}
    `;

    if (agents.length === 0) {
      return Response.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const agent = agents[0];

    // Get user profile for personalization
    const profiles = await sql`
      SELECT preferred_name
      FROM user_profiles
      WHERE user_id = ${session.user.id}
    `;
    
    const userName = profiles[0]?.preferred_name || session.user.name || 'there';

    let currentConversationId = conversation_id;

    // Create conversation if it doesn't exist
    if (!currentConversationId) {
      const newConversations = await sql`
        INSERT INTO conversations (user_id, agent_id, title, created_at, updated_at)
        VALUES (${session.user.id}, ${parseInt(agent_id)}, ${'Chat with ' + agent.name}, NOW(), NOW())
        RETURNING id
      `;
      currentConversationId = newConversations[0].id;
    }

    // Get conversation history for context
    const messages = await sql`
      SELECT role, content
      FROM messages
      WHERE conversation_id = ${currentConversationId}
      ORDER BY created_at ASC
      LIMIT 20
    `;

    // Add user message to database
    await sql`
      INSERT INTO messages (conversation_id, role, content, created_at)
      VALUES (${currentConversationId}, 'user', ${message}, NOW())
    `;

    // Prepare context for AI
    const systemPrompt = `${agent.prompt_instructions}

The user's preferred name is ${userName}. Use this name when addressing them directly.

If you are asked about topics outside your specialty (${agent.specialty}), politely explain that you specialize in ${agent.specialty} and recommend they speak with one of these other AI professionals:

- Dr. Sarah Mitchell (General Medicine): For medical questions and health advice
- Prof. James Chen (Mathematics & Physics): For math and physics problems  
- Attorney Lisa Rodriguez (Civil & Criminal Law): For legal information and guidance
- Chef Maria Gonzalez (Cooking & Nutrition): For recipes and cooking advice
- Dr. Michael Thompson (Mental Health & Therapy): For mental health support
- Emma Davis (Personal Finance & Investment): For financial planning and investment advice

Be helpful, professional, and stay within your area of expertise.`;

    // Build conversation context
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // TODO: Replace this with actual AI integration
    // For now, using a placeholder response
    let aiResponse;
    
    try {
      // This is a placeholder. Once an AI integration is selected, this will be replaced
      // with actual AI API calls (ChatGPT, Claude, etc.)
      aiResponse = await generateAIResponse(systemPrompt, conversationHistory, message, agent);
    } catch (error) {
      console.error('Error generating AI response:', error);
      aiResponse = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }

    // Add AI response to database
    await sql`
      INSERT INTO messages (conversation_id, role, content, created_at)
      VALUES (${currentConversationId}, 'assistant', ${aiResponse}, NOW())
    `;

    // Update conversation timestamp
    await sql`
      UPDATE conversations
      SET updated_at = NOW()
      WHERE id = ${currentConversationId}
    `;

    return Response.json({
      response: aiResponse,
      conversation_id: currentConversationId
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// Placeholder AI response generator
// This will be replaced with actual AI integration
async function generateAIResponse(systemPrompt, conversationHistory, userMessage, agent) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = {
    "General Medicine": [
      `Hello! As Dr. ${agent.name.split(' ')[1]}, I'd be happy to help with your medical question. However, please remember that this is for informational purposes only and doesn't replace professional medical consultation.`,
      `That's a great question about health. Based on my medical experience, I can provide some general information, but I always recommend consulting with your healthcare provider for personalized advice.`,
      `From a medical perspective, I can share some insights about this topic. Please keep in mind that every individual case is different, so it's important to seek proper medical evaluation.`
    ],
    "Mathematics & Physics": [
      `Excellent question! As a mathematics and physics professor, I love helping students understand these concepts. Let me break this down step by step.`,
      `This is a fascinating topic in ${Math.random() > 0.5 ? 'mathematics' : 'physics'}! I'll explain this in a way that makes it clear and understandable.`,
      `Great to see your interest in learning! Let me help you work through this problem systematically.`
    ],
    "Civil & Criminal Law": [
      `Thank you for your legal question. As an attorney, I can provide general legal information, but please note this doesn't constitute formal legal advice for your specific situation.`,
      `This is an interesting legal matter. I can share some general insights about the law in this area, though I'd recommend consulting with a licensed attorney for your specific circumstances.`,
      `From a legal perspective, there are several important considerations here. Let me outline the general principles, keeping in mind that laws can vary by jurisdiction.`
    ],
    "Cooking & Nutrition": [
      `What a delicious question! As a chef, I'm excited to share some culinary wisdom with you. Cooking is both an art and a science!`,
      `I love helping people in the kitchen! This is a great opportunity to explore flavors and techniques. Let me guide you through this.`,
      `Fantastic! As someone passionate about food and nutrition, I'm happy to help you create something amazing in the kitchen.`
    ],
    "Mental Health & Therapy": [
      `Thank you for sharing this with me. As a clinical psychologist, I appreciate your trust in reaching out. Mental health is incredibly important.`,
      `I'm glad you're taking steps to understand this better. Mental health and well-being are areas I'm passionate about helping people with.`,
      `This is a thoughtful question about mental health. While I can provide general information and coping strategies, please remember to seek professional help if you're experiencing serious concerns.`
    ],
    "Personal Finance & Investment": [
      `Great question about finance! As a certified financial advisor, I'm here to help you understand personal finance and investment principles.`,
      `Financial planning is so important, and I'm glad you're thinking about this. Let me share some educational insights that might help guide your thinking.`,
      `This is an excellent financial topic to explore. Remember, this is educational information, and you should consult with licensed financial professionals for personalized advice.`
    ]
  };

  const agentResponses = responses[agent.specialty] || [
    `Thank you for your question! As someone specializing in ${agent.specialty}, I'm here to help you with topics in my area of expertise.`
  ];

  const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
  
  // Add some context about the user's message
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    return randomResponse + ` What specific questions do you have about ${agent.specialty.toLowerCase()}?`;
  }
  
  return randomResponse + ` Regarding your question: "${userMessage.slice(0, 100)}${userMessage.length > 100 ? '...' : ''}" - I'd be happy to help you understand this better. Could you provide a bit more detail about what specifically you'd like to know?`;
}