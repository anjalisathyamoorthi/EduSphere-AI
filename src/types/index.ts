export interface UserProfile {
  branch: string;
  year: string;
  college: string;
  target_goals: string;
  daily_time_target_mins: number;
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  level: number;
  streak_count: number;
  profile?: UserProfile;
}

export interface MCQ {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Topic {
  id: number;
  title: string;
  story_content: string;
  code_snippet?: string;
  mcqs: MCQ[];
  xp_reward: number;
  module_title?: string;
}

export interface LearningModule {
  id: number;
  title: string;
  description?: string;
  order: number;
  topics?: Topic[];
  topics_count?: number;
}

export interface LearningTrack {
  id: number;
  title: string;
  slug: string;
  branch: string;
  description: string;
  icon: string;
  level: string;
  xp_reward: number;
  total_modules: number;
  modules?: LearningModule[];
}

export interface MissionTask {
  id: number;
  task_text: string;
  is_completed_default: boolean;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  duration_mins: number;
  xp_reward: number;
  category: string;
  is_daily: boolean;
  status: 'in_progress' | 'completed' | 'claimed';
  progress_pct: number;
  tasks: MissionTask[];
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface TestResult {
  case: number;
  input: string;
  expected: string;
  got: string;
  passed: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';
  description: string;
  problem_statement?: string;
  starter_code_py?: string;
  starter_code_js?: string;
  test_cases?: TestCase[];
  hints?: string[];
  xp_reward: number;
  boss_name: string;
  status: 'unsolved' | 'solved';
}

export interface Flashcard {
  id: number;
  topic: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: string;
  box_level: number;
  interval_days: number;
  next_review_at?: string;
}

export interface Note {
  id: number;
  title: string;
  subject: string;
  track_name: string;
  content: string;
  ai_summary?: string;
  tags: string[];
  created_at: string;
}

export interface GroupMember {
  user_id: number;
  full_name: string;
  avatar_url: string;
  role: string;
  xp: number;
}

export interface Squad {
  id: number;
  name: string;
  description: string;
  avatar_url: string;
  code: string;
  member_count: number;
  weekly_xp: number;
  leader_id: number;
  members: GroupMember[];
}

export interface FeedPost {
  id: number;
  author_name: string;
  author_avatar: string;
  content: string;
  image_url?: string;
  category: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  stipend_salary: string;
  description: string;
  apply_url: string;
  tags: string[];
  deadline?: string;
  created_at: string;
}

export interface Question {
  id: number;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
}

export interface Exam {
  id: number;
  title: string;
  subject: string;
  duration_mins: number;
  total_questions: number;
  total_marks: number;
  passing_marks: number;
  questions?: Question[];
}

export interface AICoachReview {
  summary: string;
  strengths: string[];
  growth_areas: string[];
  focus_this_week: string;
  projected_readiness: string;
  mentor_quote: string;
}

export interface ProgressAnalytics {
  weekly_breakdown: Array<{
    day: string;
    date: string;
    study_mins: number;
    xp: number;
    missions: number;
    challenges: number;
  }>;
  monthly_heatmap: Array<{
    date: string;
    mins: number;
    intensity_level: number;
  }>;
  skills_mastery: Array<{
    skill: string;
    mastery_pct: number;
    status: string;
  }>;
  summary_stats: {
    total_study_mins: number;
    total_missions_completed: number;
    total_challenges_solved: number;
    streak_days: number;
    total_xp: number;
    current_level: number;
  };
  ai_coach_review: AICoachReview;
}

export interface TypingPassage {
  id: string;
  title: string;
  category: 'english' | 'code_python' | 'code_js' | 'code_c' | 'code_java';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
}

export interface TypingResult {
  id: number;
  mode: string;
  wpm: number;
  raw_wpm: number;
  accuracy: number;
  errors: number;
  duration_secs: number;
  xp_earned: number;
  created_at: string;
}

export interface TypingLeaderboardUser {
  user_id: number;
  full_name: string;
  avatar_url: string;
  branch: string;
  best_wpm: number;
  avg_accuracy: number;
  level: number;
  xp: number;
}
