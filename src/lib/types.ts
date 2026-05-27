// Tipos que espelham os schemas Pydantic do backend (backend/app/schemas).
// Mantenha este arquivo em sincronia com as mudanças do backend.

export type Difficulty = "Fácil" | "Médio" | "Difícil";
export type SubmissionStatus = "Aprovado" | "Parcial" | "Reprovado" | "Pendente";
export type CodeReviewType = "suggestion" | "praise" | "warning";

// -------- Auth --------

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// -------- Users --------

export interface UserOut {
  id: string;
  email: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  preferred_languages: string[];
  social: Record<string, string>;
  is_verified: boolean;
  created_at: string;
}

export interface UserStatsOut {
  total_solved: number;
  total_attempted: number;
  approval_rate: number;
  current_streak: number;
  best_streak: number;
  ranking: number;
  easy: number;
  medium: number;
  hard: number;
  recent_scores: number[];
  average_score: number;
  best_score: number;
}

export interface SkillOut {
  category_slug: string;
  category_name: string;
  value: number;
}

export interface AchievementOut {
  slug: string;
  label: string;
  description: string | null;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface BookmarkOut {
  challenge_id: string;
  challenge_slug: string;
  challenge_title: string;
  saved_at: string;
}

// -------- Challenges --------

export interface CategoryOut {
  id: number;
  slug: string;
  name: string;
  description: string | null;
}

export interface TagOut {
  id: number;
  slug: string;
  name: string;
}

export interface ChallengeExampleOut {
  input: string;
  output: string;
  explanation: string | null;
  order_index: number;
}

export interface ChallengeListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: CategoryOut;
  tags: string[];
  time_limit_minutes: number;
  completion_rate: number;
  my_best_score: number | null;
  my_status: string | null;
}

export interface ChallengeOut extends ChallengeListItem {
  constraints: string[];
  starter_code: Record<string, string>;
  examples: ChallengeExampleOut[];
  published_at: string | null;
}

// -------- Submissions --------

export interface MetricsOut {
  correctness: number;
  efficiency: number;
  code_quality: number;
  edge_cases: number;
}

export interface ComplexityOut {
  time: string | null;
  space: string | null;
  explanation: string | null;
}

export interface TestResultOut {
  input: string;
  expected: string;
  got: string | null;
  passed: boolean;
  execution_time_ms: number | null;
}

export interface CodeReviewOut {
  line: number;
  type: CodeReviewType;
  message: string;
}

export interface SubmissionListItem {
  id: string;
  challenge_id: string;
  challenge_slug: string;
  challenge_title: string;
  status: SubmissionStatus;
  score: number;
  language: string;
  time_spent_seconds: number;
  lines_of_code: number;
  submitted_at: string;
}

export interface SubmissionOut {
  id: string;
  challenge_id: string;
  challenge_slug: string;
  challenge_title: string;

  language: string;
  code: string;
  lines_of_code: number;
  time_spent_seconds: number;

  status: SubmissionStatus;
  score: number;
  metrics: MetricsOut;
  complexity: ComplexityOut;
  summary: string | null;

  strengths: string[];
  improvements: string[];
  code_reviews: CodeReviewOut[];
  test_results: TestResultOut[];

  submitted_at: string;
  evaluated_at: string | null;
}

export interface FeedbackSummary {
  total: number;
  approved: number;
  partial: number;
  rejected: number;
  average_score: number;
  best_score: number;
  recurring_weakness: string | null;
}

// -------- Paginação --------

export interface PageMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface Page<T> {
  items: T[];
  meta: PageMeta;
}
