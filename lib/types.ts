export type AgentKey = "analyst" | "architect" | "risk";

export type AgentOutput = {
  agent: AgentKey;
  title: string;
  content: string;
};

export type BrdInput = {
  projectName: string;
  industry: string;
  problem: string;
  users: string;
  goals: string;
  constraints: string;
};
