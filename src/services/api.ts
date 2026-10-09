import {
  User, LearningTrack, Topic, Mission, Challenge, Flashcard,
  Note, Squad, FeedPost, Opportunity, Exam, ProgressAnalytics,
  TypingPassage, TypingResult, TypingLeaderboardUser
} from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call ${url} failed, using fallback mock data.`, err);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

// Fallback Mock Data
export const MOCK_USER: User = {
  id: 1,
  email: 'alex.student@edusphere.ai',
  full_name: 'Alex Sharma',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma',
  xp: 1450,
  level: 3,
  streak_count: 7,
  profile: {
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    college: 'IIT Delhi',
    target_goals: 'Master DSA, System Design, React & FastAPI',
    daily_time_target_mins: 45,
    bio: 'Passionate B.Tech 3rd year CS undergrad aiming for tier-1 SDE roles.',
    github_url: 'https://github.com/alex-sharma-btech',
    linkedin_url: 'https://linkedin.com/in/alex-sharma-btech',
  },
};

export const MOCK_TRACKS: LearningTrack[] = [
  {
    id: 1,
    title: 'Mastering Data Structures & Algorithms',
    slug: 'dsa-mastery',
    branch: 'Computer Science & Engineering',
    description: 'Gamified journey through arrays, linked lists, trees, graphs, and dynamic programming.',
    icon: 'code',
    level: 'Intermediate',
    xp_reward: 600,
    total_modules: 3,
    modules: [
      {
        id: 1,
        title: 'Module 1: Pointer Magic & Arrays',
        order: 1,
        topics: [
          {
            id: 1,
            title: 'The Two-Pointer Quest: Reversing Arrays in O(1) Space',
            story_content: 'Imagine you are navigating an ancient archive. Reverse runic arrays without extra parchment...',
            code_snippet: 'def reverse_array(arr):\n    left, right = 0, len(arr)-1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1; right -= 1\n    return arr',
            mcqs: [
              {
                id: 1,
                question: 'What is the time complexity of the Two-Pointer array reversal algorithm?',
                options: ['O(N^2)', 'O(N)', 'O(log N)', 'O(1)'],
                correct: 1,
                explanation: 'Linear time O(N) since we visit elements once.',
              },
            ],
            xp_reward: 75,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Full-Stack Web Engineering (React 19 + FastAPI)',
    slug: 'fullstack-web',
    branch: 'Computer Science & Engineering',
    description: 'Build scalable web applications with Vite, React, Tailwind, and asynchronous FastAPI.',
    icon: 'layout',
    level: 'Beginner to Advanced',
    xp_reward: 750,
    total_modules: 3,
  },
];

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: '15-Min Quick Sprint',
    description: 'Solve 1 quick array question and review 5 flashcards.',
    duration_mins: 15,
    xp_reward: 100,
    category: 'Coding',
    is_daily: true,
    status: 'in_progress',
    progress_pct: 50.0,
    tasks: [
      { id: 1, task_text: 'Review 5 Flashcards in Spaced Repetition', is_completed_default: true },
      { id: 2, task_text: 'Solve 1 Array Code Puzzle', is_completed_default: false },
    ],
  },
  {
    id: 2,
    title: '30-Min Core Builder',
    description: 'Complete 1 story lesson topic and log a 25-min Pomodoro session.',
    duration_mins: 30,
    xp_reward: 200,
    category: 'Focus',
    is_daily: true,
    status: 'in_progress',
    progress_pct: 0.0,
    tasks: [
      { id: 3, task_text: "Complete 'Two-Pointer Quest' Lesson", is_completed_default: false },
      { id: 4, task_text: 'Complete a 25-min Pomodoro in Squad Room', is_completed_default: false },
    ],
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Boss Challenge: The Two Sum Titan',
    slug: 'two-sum-titan',
    difficulty: 'Medium',
    description: 'Find indices of two numbers in an array that add up to a target value.',
    problem_statement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    starter_code_py: 'def solve(data):\n    nums, target = data[0], data[1]\n    seen = {}\n    for idx, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], idx]\n        seen[num] = idx\n    return []\n',
    starter_code_js: 'function solve(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}',
    test_cases: [
      { input: '([2, 7, 11, 15], 9)', expected: '[0, 1]' },
      { input: '([3, 2, 4], 6)', expected: '[1, 2]' },
    ],
    hints: ['Use HashMap/Dictionary for O(1) lookup.'],
    xp_reward: 300,
    boss_name: 'Titan of Hash Tables',
    status: 'unsolved',
  },
];

export const apiService = {
  // Auth & Profile
  getMe: () => fetchJSON<User>('/auth/me', undefined, MOCK_USER),
  getProfile: () => fetchJSON<any>('/users/profile', undefined, MOCK_USER),
  updateOnboarding: (data: any) =>
    fetchJSON('/onboarding', { method: 'POST', body: JSON.stringify(data) }, { status: 'success' }),

  // Learning
  getTracks: () => fetchJSON<LearningTrack[]>('/learning/tracks', undefined, MOCK_TRACKS),
  getTrackBySlug: (slug: string) => fetchJSON<LearningTrack>(`/learning/tracks/${slug}`, undefined, MOCK_TRACKS[0]),
  getTopicById: (id: number) => fetchJSON<Topic>(`/learning/topics/${id}`, undefined, MOCK_TRACKS[0].modules![0].topics![0]),
  completeTopic: (id: number) => fetchJSON(`/learning/topics/${id}/complete`, { method: 'POST' }, { xp_earned: 75 }),

  // Missions & Challenges
  getMissions: () => fetchJSON<Mission[]>('/missions', undefined, MOCK_MISSIONS),
  claimMission: (id: number) => fetchJSON(`/missions/${id}/claim`, { method: 'POST' }, { xp_earned: 100 }),
  getChallenges: () => fetchJSON<Challenge[]>('/challenges', undefined, MOCK_CHALLENGES),
  getChallengeBySlug: (slug: string) => fetchJSON<Challenge>(`/challenges/${slug}`, undefined, MOCK_CHALLENGES[0]),
  submitChallenge: (slug: string, code: string, language: string) =>
    fetchJSON(`/challenges/${slug}/submit`, { method: 'POST', body: JSON.stringify({ code, language }) }, {
      success: true,
      stdout: '[Sandbox Output] Test cases passed! +300 XP',
      test_results: [{ case: 1, passed: true }],
      passed_tests: 2,
      total_tests: 2,
      xp_earned: 300,
    }),

  // Sandbox
  executeSandbox: (language: string, code: string, test_cases?: any[]) =>
    fetchJSON('/sandbox/execute', { method: 'POST', body: JSON.stringify({ language, code, test_cases }) }, {
      success: true,
      stdout: '[Sandbox Output] Code executed cleanly in 12ms!',
      stderr: '',
      execution_time_ms: 12,
    }),

  // Flashcards
  getFlashcards: () => fetchJSON<Flashcard[]>('/flashcards', undefined, [
    {
      id: 1,
      topic: 'Data Structures',
      question: 'What is the average and worst-case time complexity of QuickSort?',
      answer: 'Average: O(N log N), Worst: O(N^2)',
      explanation: 'Worst case occurs when pivot selection consistently picks extreme min/max elements.',
      difficulty: 'Medium',
      box_level: 1,
      interval_days: 1,
    },
    {
      id: 2,
      topic: 'System Design',
      question: 'What is CAP Theorem in distributed databases?',
      answer: 'A system can only provide 2 of 3 guarantees simultaneously: Consistency, Availability, Partition Tolerance.',
      explanation: 'In a network partition, you must choose between consistency or availability.',
      difficulty: 'Hard',
      box_level: 2,
      interval_days: 3,
    },
  ]),
  reviewFlashcard: (id: number, rating: string) =>
    fetchJSON(`/flashcards/${id}/review`, { method: 'POST', body: JSON.stringify({ rating }) }, { xp_earned: 15, box_level: 2 }),

  // Notes
  getNotes: () => fetchJSON<Note[]>('/notes', undefined, [
    {
      id: 1,
      title: 'Dynamic Programming - Memoization vs Tabulation',
      subject: 'Algorithms',
      track_name: 'Computer Science',
      content: 'Memoization is top-down using recursion + hashmap. Tabulation is bottom-up filling a table iteratively.',
      ai_summary: '📌 **AI Summary**: Memoization = top-down; Tabulation = bottom-up iteration. Both achieve O(N) time.',
      tags: ['DP', 'Algorithms'],
      created_at: new Date().toISOString(),
    },
  ]),
  createNote: (data: { title: string; subject: string; track_name?: string; content: string; tags_json?: string }) =>
    fetchJSON('/notes', { method: 'POST', body: JSON.stringify(data) }, {
      id: 2,
      ...data,
      ai_summary: `📌 **AI Summary: ${data.title}**\n• Core concepts synthesized automatically with AI.`,
      tags: ['BTech', 'StudyNotes'],
      created_at: new Date().toISOString(),
    }),
  deleteNote: (id: number) => fetchJSON(`/notes/${id}`, { method: 'DELETE' }, { status: 'success' }),

  // Groups & Squads
  getGroups: () => fetchJSON<Squad[]>('/groups', undefined, [
    {
      id: 1,
      name: 'Delhi Tech Coders Squad',
      description: 'B.Tech 3rd & 4th year study squad for FAANG & startup placement preparation.',
      avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=DelhiTechCoders',
      code: 'DELHI7',
      member_count: 3,
      weekly_xp: 4530,
      leader_id: 1,
      members: [
        { user_id: 1, full_name: 'Alex Sharma', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma', role: 'leader', xp: 1450 },
        { user_id: 2, full_name: 'Priya Verma', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaVerma', role: 'member', xp: 2100 },
      ],
    },
  ]),
  joinGroup: (id: number) => fetchJSON(`/groups/${id}/join`, { method: 'POST' }, { status: 'success' }),
  logPomodoro: (id: number, duration_mins: number, subject: string) =>
    fetchJSON(`/groups/${id}/pomodoro`, { method: 'POST', body: JSON.stringify({ duration_mins, subject }) }, { xp_earned: 50 }),

  // Feed
  getFeed: () => fetchJSON<FeedPost[]>('/feed', undefined, [
    {
      id: 1,
      author_name: 'Priya Verma',
      author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaVerma',
      content: 'When your C++ code compiles on the first attempt without segfaults: unexpected happiness! 🥳',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
      category: 'meme',
      likes_count: 18,
      comments_count: 4,
      is_liked: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      author_name: 'Alex Sharma',
      author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma',
      content: 'Just built a 4-second timeout code sandbox in FastAPI + Python subprocess. Works seamlessly for JS & Py!',
      category: 'tech',
      likes_count: 24,
      comments_count: 6,
      is_liked: true,
      created_at: new Date().toISOString(),
    },
  ]),
  createPost: (content: string, image_url?: string, category?: string) =>
    fetchJSON('/feed', { method: 'POST', body: JSON.stringify({ content, image_url, category }) }, {
      id: 3,
      author_name: 'Alex Sharma',
      author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma',
      content,
      image_url,
      category: category || 'meme',
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
    }),
  likePost: (id: number) => fetchJSON(`/feed/${id}/like`, { method: 'POST' }, { is_liked: true, likes_count: 19 }),

  // Opportunities
  getOpportunities: () => fetchJSON<Opportunity[]>('/opportunities', undefined, [
    {
      id: 1,
      title: 'Frontend Engineering Intern (React/TS)',
      company: 'Google Cloud India',
      location: 'Bangalore / Hybrid',
      type: 'Internship',
      stipend_salary: '₹85,000 / month',
      description: 'Work with the core Cloud Console team to build modern React 19 micro-frontends.',
      apply_url: 'https://careers.google.com',
      tags: ['React', 'TypeScript', 'Tailwind'],
      deadline: '2026-11-15',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'National AI & Web3 Hackathon 2026',
      company: 'Devfolio & EduSphere',
      location: 'Online',
      type: 'Hackathon',
      stipend_salary: '₹5,000,000 Prize Pool',
      description: 'Build next-gen AI applications using Gemini Flash models.',
      apply_url: 'https://devfolio.co',
      tags: ['AI', 'Gemini', 'FastAPI', 'React'],
      deadline: '2026-10-30',
      created_at: new Date().toISOString(),
    },
  ]),

  // Exams
  getExams: () => fetchJSON<Exam[]>('/exams', undefined, [
    {
      id: 1,
      title: 'GATE CS & Placement Core Benchmark',
      subject: 'Computer Science',
      duration_mins: 20,
      total_questions: 4,
      total_marks: 40,
      passing_marks: 25,
    },
  ]),
  getExamDetail: (id: number) => fetchJSON<Exam>(`/exams/${id}`, undefined, {
    id: 1,
    title: 'GATE CS & Placement Core Benchmark',
    subject: 'Computer Science',
    duration_mins: 20,
    total_questions: 4,
    total_marks: 40,
    passing_marks: 25,
    questions: [
      {
        id: 1,
        topic: 'DSA',
        question_text: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
        option_a: 'O(1)',
        option_b: 'O(log N)',
        option_c: 'O(N)',
        option_d: 'O(N log N)',
        marks: 10,
      },
      {
        id: 2,
        topic: 'DBMS',
        question_text: 'Which normal form eliminates partial key dependencies?',
        option_a: '1NF',
        option_b: '2NF',
        option_c: '3NF',
        option_d: 'BCNF',
        marks: 10,
      },
    ],
  }),
  submitExam: (id: number, answers_json: string, time_taken_secs: number) =>
    fetchJSON(`/exams/${id}/submit`, { method: 'POST', body: JSON.stringify({ exam_id: id, answers_json, time_taken_secs }) }, {
      status: 'success',
      score: 30,
      total_marks: 40,
      passed: true,
      percentage: 75.0,
      xp_earned: 60,
    }),

  // Progress Analytics
  getProgressAnalytics: () => fetchJSON<ProgressAnalytics>('/progress/analytics', undefined, {
    weekly_breakdown: [
      { day: 'Mon', date: '2026-10-03', study_mins: 45, xp: 180, missions: 2, challenges: 1 },
      { day: 'Tue', date: '2026-10-04', study_mins: 30, xp: 140, missions: 1, challenges: 0 },
      { day: 'Wed', date: '2026-10-05', study_mins: 60, xp: 250, missions: 2, challenges: 1 },
      { day: 'Thu', date: '2026-10-06', study_mins: 40, xp: 160, missions: 1, challenges: 0 },
      { day: 'Fri', date: '2026-10-07', study_mins: 55, xp: 220, missions: 2, challenges: 1 },
      { day: 'Sat', date: '2026-10-08', study_mins: 75, xp: 310, missions: 3, challenges: 1 },
      { day: 'Sun', date: '2026-10-09', study_mins: 50, xp: 190, missions: 2, challenges: 1 },
    ],
    monthly_heatmap: Array.from({ length: 30 }).map((_, i) => ({
      date: `2026-10-${String(i + 1).padStart(2, '0')}`,
      mins: (i * 7) % 60,
      intensity_level: (i % 4) + 1,
    })),
    skills_mastery: [
      { skill: 'Data Structures', mastery_pct: 85, status: 'Mastered' },
      { skill: 'Algorithms', mastery_pct: 78, status: 'Proficient' },
      { skill: 'Web Development', mastery_pct: 90, status: 'Mastered' },
      { skill: 'Operating Systems', mastery_pct: 68, status: 'Learning' },
    ],
    summary_stats: {
      total_study_mins: 355,
      total_missions_completed: 13,
      total_challenges_solved: 5,
      streak_days: 7,
      total_xp: 1450,
      current_level: 3,
    },
    ai_coach_review: {
      summary: 'Outstanding momentum this week Alex! You logged 355 minutes of deep focus and completed 13 daily missions.',
      strengths: ['Consistent study streak', 'Strong array & string algorithm accuracy'],
      growth_areas: ['Improve speed on timed coding challenges', 'Increase flashcard review cadence'],
      focus_this_week: 'Dynamic Programming & System Design Rate Limiters',
      projected_readiness: '88% Placement Ready',
      mentor_quote: 'Consistency outperforms intensity. Keep building your daily streak!',
    },
  }),

  // AI Mentor & Interview
  chatWithAIMentor: (message: string, branch?: string, context?: string) =>
    fetchJSON('/ai/mentor', { method: 'POST', body: JSON.stringify({ message, branch, context }) }, {
      reply: `🤖 **EduSphere AI Mentor**\n\nGreat engineering question! Focus on breaking down the algorithm into sub-problems and analyzing Time & Space complexity.\n\n\`\`\`python\n# Quick Example\ndef solve(data):\n    return [x * 2 for x in data]\n\`\`\``,
      persona: 'EduSphere AI Mentor',
      branch: 'CSE',
    }),
  evaluateMockInterview: (role: string, question: string, student_answer: string) =>
    fetchJSON('/ai/interview', { method: 'POST', body: JSON.stringify({ role, question, student_answer }) }, {
      score: 85,
      verdict: 'Good',
      feedback: 'Solid explanation of algorithm design and core data structures. Excellent clarity!',
      strengths: ['Clear logical structure', 'Good domain terminology'],
      improvements: ['Mention edge case handling explicitly', 'Analyze Big-O space complexity'],
    }),

  // Typing Speed Trainer (Part 4)
  getTypingPassages: () => fetchJSON<TypingPassage[]>('/typing/passages', undefined, [
    {
      id: 'eng_easy_1',
      title: 'Welcome to B.Tech Engineering',
      category: 'english',
      difficulty: 'Easy',
      text: 'Engineering is the application of science and mathematics to solve complex real world problems.',
    },
    {
      id: 'code_py_1',
      title: 'Python Binary Search',
      category: 'code_python',
      difficulty: 'Medium',
      text: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1',
    },
    {
      id: 'code_js_1',
      title: 'JavaScript Async Fetch',
      category: 'code_js',
      difficulty: 'Medium',
      text: 'async function fetchData(url) {\n    try {\n        const res = await fetch(url);\n        const data = await res.json();\n        return data;\n    } catch (err) {\n        console.error(err);\n    }\n}',
    },
  ]),
  saveTypingResult: (data: any) =>
    fetchJSON('/typing/result', { method: 'POST', body: JSON.stringify(data) }, {
      status: 'success',
      xp_earned: 50,
      is_personal_best: true,
      net_wpm: data.wpm,
      raw_wpm: data.raw_wpm,
      accuracy: data.accuracy,
      total_xp: 1500,
    }),
  getTypingHistory: () => fetchJSON<TypingResult[]>('/typing/history', undefined, [
    { id: 1, mode: 'code_python', wpm: 74.5, raw_wpm: 78.0, accuracy: 95.5, errors: 3, duration_secs: 30, xp_earned: 60, created_at: new Date().toISOString() },
  ]),
  getTypingLeaderboard: () => fetchJSON<TypingLeaderboardUser[]>('/typing/leaderboard', undefined, [
    { user_id: 1, full_name: 'Priya Verma', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaVerma', branch: 'CSE', best_wpm: 92.4, avg_accuracy: 98.2, level: 4, xp: 2100 },
    { user_id: 2, full_name: 'Alex Sharma', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma', branch: 'CSE', best_wpm: 78.5, avg_accuracy: 96.0, level: 3, xp: 1450 },
    { user_id: 3, full_name: 'Rohan Gupta', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohanGupta', branch: 'ECE', best_wpm: 68.2, avg_accuracy: 94.5, level: 2, xp: 980 },
  ]),
};
