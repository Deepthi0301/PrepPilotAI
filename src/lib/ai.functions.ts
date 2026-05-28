import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MODEL = "google/gemini-3-flash-preview";

async function callGateway(body: Record<string, unknown>) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, ...body }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Settings → Workspace → Usage.");
    const txt = await res.text().catch(() => "");
    throw new Error(`AI gateway error (${res.status}): ${txt.slice(0, 200)}`);
  }
  return res.json();
}

function extractToolArgs(json: any): any {
  const call = json.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("AI did not return structured output");
  return JSON.parse(call.function.arguments);
}

/* ---------------- Mock Interview ---------------- */

const interviewTypes = ["hr", "technical", "behavioral"] as const;
type InterviewType = (typeof interviewTypes)[number];

export const generateInterviewQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        type: z.enum(interviewTypes),
        previousQuestions: z.array(z.string().max(500)).max(20),
        role: z.string().max(100).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sys = `You are an expert ${data.type.toUpperCase()} interviewer for a student preparing for internships and placements${data.role ? ` for the role of ${data.role}` : ""}. Generate ONE realistic, beginner-friendly interview question. Avoid repeating any of the previous questions. Return JSON only.`;
    const user = `Previous questions:\n${data.previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n") || "(none yet)"}\n\nGive the next question.`;
    const json = await callGateway({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "ask_question",
            description: "Return the next interview question",
            parameters: {
              type: "object",
              properties: { question: { type: "string" } },
              required: ["question"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "ask_question" } },
    });
    return extractToolArgs(json) as { question: string };
  });

export const evaluateAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        type: z.enum(interviewTypes),
        question: z.string().min(1).max(2000),
        answer: z.string().min(1).max(4000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sys = `You are a kind but honest interview coach for college students. Give beginner-friendly feedback for a ${data.type} interview answer. Score 0-100. Return JSON only.`;
    const user = `Question: ${data.question}\n\nStudent Answer: ${data.answer}`;
    const json = await callGateway({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "evaluate",
            parameters: {
              type: "object",
              properties: {
                professionalism: { type: "number", description: "0-100" },
                confidence: { type: "number", description: "0-100" },
                clarity: { type: "number", description: "0-100, speaking clarity" },
                grammarScore: { type: "number", description: "0-100, grammar quality" },
                grammarMistakes: { type: "array", items: { type: "string" }, description: "Specific grammar mistakes spotted (empty if none)" },
                improvementSuggestions: { type: "array", items: { type: "string" }, description: "2-3 concrete improvement tips" },
                communication: { type: "string", description: "1-2 sentence feedback on communication" },
                strengths: { type: "array", items: { type: "string" }, description: "2-3 strengths" },
                weaknesses: { type: "array", items: { type: "string" }, description: "2-3 areas to improve" },
                betterAnswer: { type: "string", description: "A polished, professional version of the answer" },
              },
              required: ["professionalism", "confidence", "clarity", "grammarScore", "grammarMistakes", "improvementSuggestions", "communication", "strengths", "weaknesses", "betterAnswer"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "evaluate" } },
    });
    return extractToolArgs(json) as {
      professionalism: number;
      confidence: number;
      clarity: number;
      grammarScore: number;
      grammarMistakes: string[];
      improvementSuggestions: string[];
      communication: string;
      strengths: string[];
      weaknesses: string[];
      betterAnswer: string;
    };
  });

/* ---------------- Communication Improver ---------------- */

export const improveCommunication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { text: string }) => z.object({ text: z.string().min(1).max(2000) }).parse(d))
  .handler(async ({ data }) => {
    const json = await callGateway({
      messages: [
        {
          role: "system",
          content:
            "You convert casual/weak English into polished, professional interview-ready communication. Keep meaning intact, be concise, sound confident but humble. Return JSON only.",
        },
        { role: "user", content: data.text },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "improve",
            parameters: {
              type: "object",
              properties: {
                improved: { type: "string" },
                explanation: { type: "string", description: "Short, friendly explanation of changes" },
              },
              required: ["improved", "explanation"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "improve" } },
    });
    return extractToolArgs(json) as { improved: string; explanation: string };
  });

/* ---------------- Speaking / Communication Feedback ---------------- */

export const analyzeSpeaking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { transcript: string; context?: string }) =>
    z.object({ transcript: z.string().min(1).max(4000), context: z.string().max(500).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const json = await callGateway({
      messages: [
        {
          role: "system",
          content:
            "You are a speaking & communication coach. Analyze a student's spoken transcript. Score each metric 0-100. Be kind, specific, beginner-friendly. Return JSON only.",
        },
        {
          role: "user",
          content: `${data.context ? `Context: ${data.context}\n\n` : ""}Transcript:\n${data.transcript}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "analyze",
            parameters: {
              type: "object",
              properties: {
                clarity: { type: "number", description: "0-100 speaking clarity" },
                confidence: { type: "number", description: "0-100 confidence" },
                grammarScore: { type: "number", description: "0-100 grammar" },
                fluency: { type: "number", description: "0-100 fluency / flow" },
                grammarMistakes: { type: "array", items: { type: "string" } },
                improvementSuggestions: { type: "array", items: { type: "string" }, description: "3 concrete tips" },
                summary: { type: "string", description: "1-2 sentence overall feedback" },
              },
              required: ["clarity", "confidence", "grammarScore", "fluency", "grammarMistakes", "improvementSuggestions", "summary"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "analyze" } },
    });
    return extractToolArgs(json) as {
      clarity: number;
      confidence: number;
      grammarScore: number;
      fluency: number;
      grammarMistakes: string[];
      improvementSuggestions: string[];
      summary: string;
    };
  });

/* ---------------- Daily Speaking Topic ---------------- */

export const generateSpeakingTopic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ seed: z.string().max(100).optional() }).parse(d ?? {}))
  .handler(async () => {
    const json = await callGateway({
      messages: [
        {
          role: "system",
          content:
            "Pick ONE engaging 1-minute speaking-practice topic for a college student. Pick from: technology, college life, leadership, AI, career. Return JSON only.",
        },
        { role: "user", content: `Generate a fresh topic. Random seed: ${Math.random().toString(36).slice(2)}` },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "topic",
            parameters: {
              type: "object",
              properties: {
                topic: { type: "string" },
                category: { type: "string" },
                hints: { type: "array", items: { type: "string" }, description: "3 short talking-point hints" },
              },
              required: ["topic", "category", "hints"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "topic" } },
    });
    return extractToolArgs(json) as { topic: string; category: string; hints: string[] };
  });

/* ---------------- Group Discussion ---------------- */

export const generateGDPack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ topic: z.string().max(300).optional() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const userMsg = data.topic
      ? `Topic: ${data.topic}`
      : `Pick a fresh, relevant Group Discussion topic for students (tech / society / careers). Random seed: ${Math.random().toString(36).slice(2)}`;
    const json = await callGateway({
      messages: [
        {
          role: "system",
          content: "You are a GD coach. Return a structured prep pack for a student group discussion. Return JSON only.",
        },
        { role: "user", content: userMsg },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "gd",
            parameters: {
              type: "object",
              properties: {
                topic: { type: "string" },
                pointsToSpeak: { type: "array", items: { type: "string" } },
                supportingArguments: { type: "array", items: { type: "string" } },
                counterArguments: { type: "array", items: { type: "string" } },
                communicationTips: { type: "array", items: { type: "string" } },
              },
              required: ["topic", "pointsToSpeak", "supportingArguments", "counterArguments", "communicationTips"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "gd" } },
    });
    return extractToolArgs(json) as {
      topic: string;
      pointsToSpeak: string[];
      supportingArguments: string[];
      counterArguments: string[];
      communicationTips: string[];
    };
  });