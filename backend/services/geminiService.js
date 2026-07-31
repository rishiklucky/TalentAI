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

  console.log('Attempting analysis via OpenRouter (google/gemini-2.5-flash:free)...');

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
  const parsedData = JSON.parse(jsonText);
  console.log('Successfully analyzed resume using OpenRouter API.');
  return parsedData;
};

const analyzeResume = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // System prompt template
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
  analyzeResume
};
