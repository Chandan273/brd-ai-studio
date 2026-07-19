import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import type { AgentKey, BrdInput } from "@/lib/types";

const roles: Record<AgentKey, string> = {
  analyst: "You are a meticulous senior business analyst. Identify requirements, success metrics, assumptions, and concise acceptance criteria.",
  architect: "You are a pragmatic solution architect. Propose a secure, scalable solution, integration approach, data entities, and a phased delivery plan.",
  risk: "You are a rigorous delivery and compliance lead. Identify risks, mitigations, dependencies, governance needs, and open questions.",
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as BrdInput & { agent: AgentKey };
    if (!body.projectName || !body.problem || !body.agent) {
      return NextResponse.json({ error: "Project name, problem statement, and agent are required." }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY. Add it to .env.local to enable live AI generation." }, { status: 503 });
    }
    const { text } = await generateText({
      model: anthropic(process.env.ANTHROPIC_MODEL || "claude-haiku-4-5"),
      system: `${roles[body.agent]} Write in clear Markdown. Do not invent facts. Be concrete and concise.`,
      prompt: `Create your BRD contribution for this project:\n\nProject: ${body.projectName}\nIndustry: ${body.industry || "Not specified"}\nProblem: ${body.problem}\nPrimary users: ${body.users || "Not specified"}\nBusiness goals: ${body.goals || "Not specified"}\nConstraints: ${body.constraints || "Not specified"}`,
    });
    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The agent could not complete the request. Please try again." }, { status: 500 });
  }
}
