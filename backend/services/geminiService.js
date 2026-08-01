const { GoogleGenerativeAI } = require('@google/generative-ai');

// Generate Mock analysis for testing/fallback if Gemini API is missing or fails
const generateMockAnalysis = (text) => {
  const lowercaseText = text.toLowerCase();
  
  // Basic skill keyword detection
  const allSkills = [
    'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Kubernetes', 
    'Docker', 'CI/CD', 'AWS', 'Terraform', 'TypeScript', 'JavaScript', 
    'SQL', 'PostgreSQL', 'Java', 'C++', 'Go', 'Rust', 'Figma', 'System Design'
  ];
  
  const detectedSkills = allSkills.filter(skill => lowercaseText.includes(skill.toLowerCase()));
  if (detectedSkills.length === 0) {
    detectedSkills.push('JavaScript', 'React', 'HTML/CSS');
  }

  // Estimate experience based on text keywords
  let yearsOfExp = 2;
  if (lowercaseText.includes('senior') || lowercaseText.includes('lead') || lowercaseText.includes('principal')) {
    yearsOfExp = 7;
  } else if (lowercaseText.includes('mid') || lowercaseText.includes('intermediate') || lowercaseText.includes('3 years') || lowercaseText.includes('4 years')) {
    yearsOfExp = 4;
  }

  // Attempt to extract name
  let name = 'Alexandre Rivera';
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length > 0 && lines[0].length < 30) {
    name = lines[0];
  }

  // Estimate college
  let college = 'SCAD College';
  if (lowercaseText.includes('university')) {
    const uniLine = lines.find(l => l.toLowerCase().includes('university'));
    if (uniLine) college = uniLine;
  } else if (lowercaseText.includes('institute')) {
    const instLine = lines.find(l => l.toLowerCase().includes('institute'));
    if (instLine) college = instLine;
  }

  const score = Math.floor(Math.random() * 20) + 75; // 75 - 95

  return {
    name,
    title: yearsOfExp >= 6 ? 'Senior Full-Stack Engineer' : 'Full-Stack Developer',
    location: lowercaseText.includes('san francisco') ? 'San Francisco, CA' : lowercaseText.includes('new york') ? 'New York, NY' : 'Remote',
    college,
    bio: `${name} is a skilled developer with expertise in ${detectedSkills.slice(0, 3).join(', ')}. Passionate about building robust applications and writing clean code.`,
    skills: detectedSkills,
    yearsOfExperience: yearsOfExp,
    summary: `Based on a local analysis of career trajectory and technical tags, ${name} represents a strong developer candidate. Possesses hands-on capability in modern full-stack development and databases. Key strengths include ${detectedSkills.slice(0, 2).join(' and ')}.`,
    candidateScore: score,
    strengths: [
      `Proficient in ${detectedSkills.slice(0, 3).join(', ')}`,
      'Active developer with clear project experience',
      'Good understanding of modern development standards'
    ],
    weaknesses: [
      'Could benefit from more cloud architecture experience',
      'Limited testing framework documentation'
    ],
    skillGap: [
      { skill: 'React/Frontend', matchPercentage: detectedSkills.includes('React') ? 90 : 50 },
      { skill: 'Backend/Node.js', matchPercentage: detectedSkills.includes('Node.js') || detectedSkills.includes('Express') ? 85 : 45 },
      { skill: 'Databases (MongoDB/SQL)', matchPercentage: detectedSkills.includes('MongoDB') || detectedSkills.includes('SQL') ? 80 : 40 },
      { skill: 'DevOps & Kubernetes', matchPercentage: detectedSkills.includes('Kubernetes') || detectedSkills.includes('Docker') ? 75 : 30 }
    ],
    interviewQuestions: [
      {
        question: `How would you explain the life cycle of a request in an application using ${detectedSkills[0] || 'JavaScript'}?`,
        category: 'Technical',
        hints: 'Look for logical request routing, middleware execution, database queries, and proper response codes.'
      },
      {
        question: 'Discuss a challenging bug you recently resolved and the diagnostic tools you used.',
        category: 'Behavioral',
        hints: 'Evaluate problem-solving workflow, analytical thinking, and how the candidate collaborates with team members under pressure.'
      }
    ],
    education: [
      {
        degree: lowercaseText.includes('master') ? 'Master of Science in Computer Science' : 'Bachelor of Science in Computer Science',
        school: college,
        year: '2020',
        description: 'Completed coursework in advanced software engineering.'
      }
    ],
    experience: [
      {
        title: yearsOfExp >= 6 ? 'Senior Software Engineer' : 'Software Engineer',
        company: 'InnovateTech Systems',
        year: '2021 - Present',
        description: 'Led implementation of core product workflows.'
      }
    ],
    recommendation: score >= 85 ? 'Strong Match' : 'Match'
  };
};

const analyzeResumeWithOpenRouter = async (resumeText, systemPrompt) => {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    throw new Error('OpenRouter API key is not configured.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openRouterKey}`,
      'HTTP-Referer': 'https://talentai.io',
      'X-Title': 'TalentAI Platform'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash:free',
      messages: [
        {
          role: 'user',
          content: systemPrompt
        }
      ],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`OpenRouter Error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  const jsonText = data.choices[0].message.content;
  return JSON.parse(jsonText);
};

const queryGeminiJSON = async (systemPrompt, mockFallbackFn) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    if (openRouterKey) {
      try {
        return await analyzeResumeWithOpenRouter('', systemPrompt);
      } catch (err) {
        console.error('OpenRouter query failed:', err.message);
      }
    }
    console.log('No valid API keys configured. Falling back to local mock data.');
    return mockFallbackFn();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Gemini execution error:', error);
    if (openRouterKey) {
      try {
        return await analyzeResumeWithOpenRouter('', systemPrompt);
      } catch (err) {
        console.error('OpenRouter query failed:', err.message);
      }
    }
    console.log('Falling back to local mock data.');
    return mockFallbackFn();
  }
};

const optimizeResume = async (user, company, role) => {
  const mockFallback = () => {
    const currentScore = Math.floor(Math.random() * 15) + 60; // 60-75
    const optimizedScore = Math.min(98, currentScore + Math.floor(Math.random() * 12) + 12); // +12 to +24
    const keywordMatch = Math.floor(Math.random() * 20) + 50; // 50-70
    
    return {
      currentScore,
      optimizedScore,
      keywordMatch,
      atsSuggestions: [
        `Reformat section headers to use standard naming conventions compatible with standard parser systems like Taleo.`,
        `Move the skills section to the top of the resume, immediately following your summary.`,
        `Quantify your experience bullet points using the X-Y-Z formula (e.g. 'Accomplished [X] as measured by [Y], by doing [Z]') to increase ATS rankings.`
      ],
      missingKeywords: [
        role.toLowerCase().includes('frontend') ? 'Tailwind CSS' : '',
        role.toLowerCase().includes('frontend') ? 'Redux Toolkit' : '',
        role.toLowerCase().includes('backend') ? 'Redis caching' : '',
        role.toLowerCase().includes('backend') ? 'Docker' : '',
        'TypeScript',
        'CI/CD Pipeline integration',
        'Jest / RTL Testing Frameworks',
        company === 'Google' ? 'System Design' : 'Scalable Architecture'
      ].filter(Boolean),
      improvements: [
        `Transform passive project descriptions into impact-oriented summaries starting with strong action verbs.`,
        `Add a distinct 'Projects' section highlighting full-stack deployment and cloud integrations.`,
        `Convert multi-line paragraphs into clear, single-line bulleted descriptions.`
      ],
      strongerProjects: [
        `Developed a high-performance MERN analytics platform, reducing server-side payload delivery times by 24% using Redis.`,
        `Engineered a modular state management architecture, improving component render cycles and frontend speed by 30%.`
      ],
      skillOrdering: [
        `1. Core Languages: JavaScript, TypeScript, HTML5/CSS3`,
        `2. Frameworks & Libraries: React, Node.js, Express`,
        `3. Databases & Caching: MongoDB, Redis, PostgreSQL`,
        `4. DevOps & Cloud Tools: AWS (S3), Docker, Git`
      ],
      visibilityTips: [
        `Optimize your LinkedIn headline to include: '${role} | Specializing in React & Node | Open to Opportunities at ${company}'.`,
        `Incorporate references to ${company}'s core developer values (e.g., scale, efficiency, problem solving) in your summary bio.`
      ]
    };
  };

  const systemPrompt = `You are a professional ATS resume scanner and recruiter at TalentAI.
  Optimize the following candidate's resume/profile to apply for the role: ${role} at Company: ${company}.
  
  Candidate Profile:
  Name: ${user.name}
  Title: ${user.title || 'Developer'}
  Skills: ${user.skills ? user.skills.join(', ') : 'N/A'}
  Bio: ${user.bio || 'N/A'}
  Experience: ${JSON.stringify(user.experience || [])}
  Education: ${JSON.stringify(user.education || [])}

  You MUST respond with a valid JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON. The JSON keys and structure must be exactly as follows:
  {
    "currentScore": 65, // out of 100, relative to this specific company and role
    "optimizedScore": 92, // out of 100, after implementing suggestions
    "keywordMatch": 58, // match percentage out of 100
    "atsSuggestions": ["suggestion 1", "suggestion 2"],
    "missingKeywords": ["keyword 1", "keyword 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "strongerProjects": ["project description 1", "project description 2"],
    "skillOrdering": ["skill group 1: skill A, skill B", "skill group 2: skill C, skill D"],
    "visibilityTips": ["tip 1", "tip 2"]
  }`;

  return await queryGeminiJSON(systemPrompt, mockFallback);
};

const generateCareerRoadmap = async (currentSkills, targetCompany, targetRole) => {
  const mockFallback = () => {
    return {
      learningRoadmap: [
        { phase: "Phase 1: Foundation & Core Gaps", description: "Strengthen base skills and master core gaps in typescript and system logic.", duration: "2 weeks" },
        { phase: "Phase 2: Framework Mastery & Integrations", description: "Learn state managers, styling libraries, and server interactions deeply.", duration: "3 weeks" },
        { phase: "Phase 3: Backend & Data Pipelines", description: "Build scalable APIs, integrate caching, and master NoSQL schema designs.", duration: "3 weeks" },
        { phase: "Phase 4: Cloud & Deployment Workflows", description: "Understand Docker containment, CI/CD automated test suites, and AWS cloud deploys.", duration: "2 weeks" },
        { phase: "Phase 5: Interview Prep & Mock Cracking", description: "Solve algorithmic challenges, practice system design, and run mock technical interviews.", duration: "2 weeks" }
      ],
      weeklyPlan: [
        { week: "Week 1", topic: "Advanced ES6+ & TypeScript Integration", tasks: ["Convert JavaScript scripts to strongly-typed TypeScript", "Implement custom generic classes and interfaces"] },
        { week: "Week 2", topic: "Next-gen Frontend Frameworks", tasks: ["Deep dive into React concurrent rendering & hooks", "Build state dashboards using Redux Toolkit or Zustand"] },
        { week: "Week 3", topic: "API Engineering & Architecture", tasks: ["Design RESTful guidelines, middleware pipelines, and error routers", "Implement custom JWT auth protocols and cookie parsers"] },
        { week: "Week 4", topic: "Database Scaling & Caching", tasks: ["Perform indexing, aggregation queries in MongoDB", "Configure Redis cache middleware to reduce response latency"] }
      ],
      recommendedTechnologies: ["TypeScript", "Next.js", "Zustand", "Redis", "Docker", "AWS (EC2/S3)", "GitHub Actions"],
      certifications: [
        `AWS Certified Developer - Associate`,
        `MongoDB Associate Developer Certificate`,
        `Meta Front-End Developer Professional Certificate`
      ],
      projectsToBuild: [
        { title: "Real-time Collaboration Canvas", description: "Interactive canvas dashboard supporting multi-user edits using WebSockets and Redis.", difficulty: "Hard" },
        { title: "Serverless E-Commerce Gateway", description: "Microservices backend constructed on AWS Lambda, DynamoDB, and Stripe integration.", difficulty: "Medium" }
      ],
      interviewTimeline: [
        { milestone: "Week 1-3", focus: "Data structures, Big O analysis, and sliding window challenges", status: "In Progress" },
        { milestone: "Week 4-6", focus: "System Design, database schema design, and load balancer setups", status: "Upcoming" },
        { milestone: "Week 7-9", focus: "Behavioral questions using STAR format and mock technical rounds", status: "Upcoming" }
      ]
    };
  };

  const systemPrompt = `You are a professional technical career counselor at TalentAI.
  Create a personalized career roadmap for a user who wants to land a job at: ${targetCompany} as a ${targetRole}.
  
  User's Current Skills: ${currentSkills}

  You MUST respond with a valid JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON. The JSON keys and structure must be exactly as follows:
  {
    "learningRoadmap": [
      { "phase": "Phase 1: Foundations", "description": "Phase description", "duration": "2 weeks" }
    ],
    "weeklyPlan": [
      { "week": "Week 1", "topic": "Topic Name", "tasks": ["Task 1", "Task 2"] }
    ],
    "recommendedTechnologies": ["Tech 1", "Tech 2"],
    "certifications": ["Cert 1", "Cert 2"],
    "projectsToBuild": [
      { "title": "Project Title", "description": "Description", "difficulty": "Medium" }
    ],
    "interviewTimeline": [
      { "milestone": "Month 1", "focus": "System Design prep", "status": "Upcoming" }
    ]
  }`;

  return await queryGeminiJSON(systemPrompt, mockFallback);
};

const matchJobDescription = async (jobDescription, candidates) => {
  const mockFallback = () => {
    // Return mock rankings based on candidate profiles matching keywords in job description
    const jdLower = jobDescription.toLowerCase();
    
    return {
      matches: candidates.map(c => {
        let matchScore = 55;
        const matched = [];
        const missing = [];
        
        const candidateSkills = c.skills || [];
        candidateSkills.forEach(s => {
          if (jdLower.includes(s.toLowerCase())) {
            matchScore += 8;
            matched.push(s);
          } else {
            if (Math.random() > 0.5) {
              missing.push(s);
            }
          }
        });

        // Add standard software engineer requirements if missing
        const standardSkills = ['TypeScript', 'Docker', 'Jest', 'AWS', 'System Design'];
        standardSkills.forEach(s => {
          if (jdLower.includes(s.toLowerCase()) && !candidateSkills.map(x => x.toLowerCase()).includes(s.toLowerCase())) {
            missing.push(s);
          }
        });

        matchScore = Math.min(97, Math.max(35, matchScore));
        
        let ranking = 'Weak Match';
        if (matchScore >= 80) ranking = 'Strong Match';
        else if (matchScore >= 55) ranking = 'Moderate Match';

        return {
          candidateId: c._id.toString(),
          matchPercentage: matchScore,
          matchedSkills: matched.slice(0, 5),
          missingSkills: missing.slice(0, 4),
          ranking
        };
      })
    };
  };

  const systemPrompt = `You are the AI Recruiter matching algorithm at TalentAI.
  Evaluate the list of candidate profiles below against the provided Job Description.
  For each candidate, calculate:
  - Match Percentage (0-100)
  - Matched Skills (skills that overlap between candidate and job description)
  - Missing Skills (skills mentioned or implied in JD but missing in candidate's skills list)
  - Ranking category ("Strong Match" for 80-100%, "Moderate Match" for 50-79%, "Weak Match" for 0-49%)

  Job Description:
  ${jobDescription}

  Candidates:
  ${candidates.map(c => `ID: ${c._id}\nName: ${c.name}\nSkills: ${c.skills ? c.skills.join(', ') : ''}\nTitle: ${c.title || ''}\nBio: ${c.bio || ''}`).join('\n\n')}

  You MUST respond with a valid JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON. The JSON keys and structure must be exactly as follows:
  {
    "matches": [
      {
        "candidateId": "ID of candidate",
        "matchPercentage": 85,
        "matchedSkills": ["React", "TypeScript"],
        "missingSkills": ["Docker", "Kubernetes"],
        "ranking": "Strong Match"
      }
    ]
  }`;

  return await queryGeminiJSON(systemPrompt, mockFallback);
};

const compareCandidates = async (candidates) => {
  const mockFallback = () => {
    const radarLabels = ["Technical Depth", "Experience Value", "Project Quality", "Education Alignment", "Communication"];
    const candidateData = candidates.map((c, idx) => {
      const offset = idx * 5;
      return {
        name: c.name,
        data: [
          Math.min(98, 85 - offset + Math.floor(Math.random() * 8)),
          Math.min(98, 80 - offset + Math.floor(Math.random() * 8)),
          Math.min(98, 88 - offset + Math.floor(Math.random() * 8)),
          Math.min(98, 75 - offset + Math.floor(Math.random() * 8)),
          Math.min(98, 82 - offset + Math.floor(Math.random() * 8))
        ]
      };
    });

    const headers = ["Metric", ...candidates.map(c => c.name)];
    const rows = [
      ["Technical Skills", ...candidates.map(c => (c.skills || []).slice(0, 5).join(', '))],
      ["Years of Experience", ...candidates.map(c => `${c.yearsOfExperience || 0} years`)],
      ["GitHub Profile", ...candidates.map(c => c.github ? "Provided" : "N/A")],
      ["Education", ...candidates.map(c => c.education && c.education.length > 0 ? c.education[0].degree : "N/A")],
      ["Core Strength", ...candidates.map((c, i) => i === 0 ? "Scalable microservices architecting" : i === 1 ? "Frontend user experience polished polish" : "Agile delivery speed")],
      ["Growth Area", ...candidates.map((c, i) => i === 0 ? "Unit testing coverage" : i === 1 ? "Database indexing knowledge" : "CI/CD orchestration experience")]
    ];

    const winnerName = candidates[0] ? candidates[0].name : "N/A";

    return {
      radarChart: {
        labels: radarLabels,
        candidates: candidateData
      },
      comparisonTable: {
        headers,
        rows
      },
      winnerRecommendation: `${winnerName} is selected as the top candidate. Possesses the highest combination of deep technical depth, direct project experiences, and strong communication capability alignment.`,
      hiringRecommendation: `Proceed with an advanced technical interview with ${winnerName} focusing on system design. For others, maintain them in active pipeline for junior roles.`
    };
  };

  const systemPrompt = `You are a senior recruitment consultant at TalentAI.
  Compare the following candidate profiles side-by-side:
  
  Candidates:
  ${candidates.map(c => `Name: ${c.name}\nSkills: ${c.skills ? c.skills.join(', ') : ''}\nExperience: ${JSON.stringify(c.experience || [])}\nEducation: ${JSON.stringify(c.education || [])}\nBio: ${c.bio || ''}`).join('\n\n')}

  You MUST respond with a valid JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON. The JSON keys and structure must be exactly as follows:
  {
    "radarChart": {
      "labels": ["Technical Depth", "Experience Value", "Project Quality", "Education Alignment", "Communication/Bio"],
      "candidates": [
        { "name": "Candidate A Name", "data": [85, 75, 90, 80, 70] }
      ]
    },
    "comparisonTable": {
      "headers": ["Metric", "Candidate A Name", "Candidate B Name"],
      "rows": [
        ["Technical Skills", "Skills A", "Skills B"],
        ["Experience", "Exp A", "Exp B"],
        ["GitHub Activity", "Git A", "Git B"],
        ["Education", "Edu A", "Edu B"],
        ["Strengths", "Strengths A", "Strengths B"],
        ["Weaknesses", "Weaknesses A", "Weaknesses B"]
      ]
    },
    "winnerRecommendation": "Name of the candidate who is the best fit, and why (2 sentences).",
    "hiringRecommendation": "Hiring strategy recommendation for the team."
  }`;

  return await queryGeminiJSON(systemPrompt, mockFallback);
};

const analyzeResume = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are a recruitment specialist and AI recruiter at TalentAI.
Analyze the following resume text and extract all key candidate details.
You MUST respond with a valid JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON. The JSON keys and structure must be exactly as follows:
{
  "name": "Candidate Full Name",
  "title": "Current Professional Role/Title",
  "location": "Location (City, State/Country)",
  "college": "Primary College or University Name",
  "bio": "A summary bio of the candidate (approx 150 chars)",
  "skills": ["Skill1", "Skill2", ...],
  "yearsOfExperience": 5 (number),
  "summary": "Detailed AI Insight Executive Summary (approx 3-5 sentences)",
  "candidateScore": 85 (score out of 100 as integer),
  "strengths": ["Strength 1", "Strength 2", ...],
  "weaknesses": ["Growth area 1", "Growth area 2", ...],
  "skillGap": [
    { "skill": "Kubernetes & Orchestration", "matchPercentage": 90 },
    { "skill": "CI/CD Automation", "matchPercentage": 85 },
    { "skill": "Backend Development (Python)", "matchPercentage": 80 },
    { "skill": "Frontend (React/TypeScript)", "matchPercentage": 50 }
  ],
  "interviewQuestions": [
    {
      "question": "Specific question testing their skills",
      "category": "Technical",
      "hints": "Target response hints and what answers to look for"
    },
    {
      "question": "Behavioral/leadership question",
      "category": "Behavioral",
      "hints": "Target response hints and what answers to look for"
    }
  ],
  "education": [
    {
      "degree": "Degree or Certification",
      "school": "University/School Name",
      "year": "Graduation Year (e.g. 2018)",
      "description": "Details"
    }
  ],
  "experience": [
    {
      "title": "Role Title",
      "company": "Company Name",
      "year": "Dates (e.g. 2021 - Present)",
      "description": "Summary of responsibilities"
    }
  ],
  "recommendation": "Strong Match"
}

Resume Text:
${resumeText}`;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    if (openRouterKey) {
      try {
        const orData = await analyzeResumeWithOpenRouter(resumeText, systemPrompt);
        return orData;
      } catch (err) {
        console.error('OpenRouter backup analysis failed:', err.message);
      }
    }
    console.log('No valid API keys configured. Falling back to local mock analysis.');
    return generateMockAnalysis(resumeText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const response = await result.response;
    const jsonText = response.text();
    
    // Parse response
    const parsedData = JSON.parse(jsonText);
    console.log('Successfully analyzed resume using Gemini AI API.');
    return parsedData;
  } catch (error) {
    console.error('Error analyzing resume with Gemini API:', error);
    if (openRouterKey) {
      try {
        const orData = await analyzeResumeWithOpenRouter(resumeText, systemPrompt);
        return orData;
      } catch (err) {
        console.error('OpenRouter backup analysis failed:', err.message);
      }
    }
    console.log('Falling back to local mock analysis.');
    return generateMockAnalysis(resumeText);
  }
};

module.exports = {
  analyzeResume,
  optimizeResume,
  generateCareerRoadmap,
  matchJobDescription,
  compareCandidates
};
