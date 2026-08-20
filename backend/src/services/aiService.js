class AIService {
  static async generateResponse({ systemPrompt, userMessage }) {
    const apiKey = process.env.AI_API_KEY;
    const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

    // If an API Key is provided, attempt to call external Google Gemini API
    if (apiKey && apiKey !== 'your_key_here') {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
              }
            ]
          })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (err) {
        console.warn('[AIService] External API call failed or timed out, using system engine fallback:', err.message);
      }
    }

    // Intelligent role-aware system fallback engine
    return this.getFallbackResponse(systemPrompt, userMessage);
  }

  static getFallbackResponse(systemPrompt, userMessage) {
    const lower = userMessage.toLowerCase();

    // Identify role context from system prompt
    let role = 'STUDENT';
    if (systemPrompt.includes('ADMIN')) role = 'ADMIN';
    else if (systemPrompt.includes('HOD')) role = 'HOD';
    else if (systemPrompt.includes('FACULTY')) role = 'FACULTY';

    // Check for security violations
    if (
      lower.includes('password') ||
      lower.includes('secret') ||
      lower.includes('token') ||
      lower.includes('credential') ||
      lower.includes('bypass')
    ) {
      return '🔒 For security and privacy compliance, sensitive credentials, tokens, and unauthorized administrative access keys are protected and cannot be shared or modified.';
    }

    // Role-specific questions
    if (role === 'STUDENT') {
      if (lower.includes('assignment') || lower.includes('submit')) {
        return '📝 **How to Submit an Assignment:**\n1. Go to your **Student Dashboard**.\n2. Click on the **Assignments** tab.\n3. Find your assignment and click **Submit Assignment**.\n4. Provide your submission URL/file and confirm. You can update or revoke your submission anytime before the deadline!';
      }
      if (lower.includes('attendance')) {
        return '📊 **How to Check Attendance:**\n1. Open your **Student Dashboard**.\n2. Click on **Attendance** to view subject-wise total classes, present count, absent count, and your percentage.';
      }
      if (lower.includes('exam') || lower.includes('schedule')) {
        return '📅 **How to View Exam Schedule:**\n1. Navigate to the **Exams** tab in your portal.\n2. View subject dates, exam slots, room allocations, and exam types (Internal, Midterm, Final).';
      }
      if (lower.includes('result') || lower.includes('mark') || lower.includes('grade') || lower.includes('cgpa')) {
        return '🎓 **How to View Results:**\n1. Go to the **Results** or **Marks** tab on your Student Dashboard.\n2. Check your subject scores, total marks, grades, and cumulative CGPA calculations.';
      }
      if (lower.includes('complaint')) {
        return '💬 **How to File a Complaint:**\n1. Navigate to **Complaints** in your Student Dashboard.\n2. Click **+ New Complaint**.\n3. Enter the subject and detailed description.\n4. Track your status (Open, In-Progress, Resolved) and view administrator responses.';
      }
      if (lower.includes('material') || lower.includes('download')) {
        return '📚 **How to Access Study Materials:**\n1. Go to the **Study Materials** section.\n2. Filter by your enrolled subjects and click **Download / Open** to access handouts uploaded by your faculty.';
      }
      if (lower.includes('fee')) {
        return '💳 **How to Check Fees:**\n1. Click the **Fees** tab on your portal.\n2. Review your total academic fees, paid amounts, due amounts, and due dates.';
      }
    }

    if (role === 'FACULTY') {
      if (lower.includes('assignment') || lower.includes('create')) {
        return '✍️ **How to Create & Manage Assignments:**\n1. Go to your **Faculty Dashboard**.\n2. Under **Assignments**, click **+ Create Assignment**.\n3. Select your assigned subject, title, description, instructions, max marks, and deadline.\n4. View student submissions anytime and click **Grade** to award marks and feedback.';
      }
      if (lower.includes('attendance') || lower.includes('mark')) {
        return '📋 **How to Mark Attendance:**\n1. Go to the **Attendance** tab in your Faculty Dashboard.\n2. Select the subject and date.\n3. Toggle Present/Absent status for students or click **Mark All Present**.\n4. Click **Save Attendance** to save records and notify students.';
      }
      if (lower.includes('material') || lower.includes('upload')) {
        return '📁 **How to Upload Study Materials:**\n1. Go to **Study Materials**.\n2. Click **+ Upload Material**.\n3. Pick your assigned subject, enter title & description, and provide the file link.';
      }
      if (lower.includes('mark') || lower.includes('grade')) {
        return '💯 **How to Enter Student Marks:**\n1. Navigate to the **Marks Entry** tab.\n2. Choose the subject and exam type.\n3. Input internal, midterm, practical, or final marks.\n4. Grades and CGPAs will auto-calculate upon saving.';
      }
    }

    if (role === 'HOD') {
      if (lower.includes('student') || lower.includes('faculty')) {
        return '🏛️ **How to Manage Department Personnel:**\n1. Go to your **HOD Dashboard**.\n2. Access **Department Students** or **Department Faculty** tabs.\n3. View records, search, filter by semester/course, or edit department information.';
      }
      if (lower.includes('attendance') || lower.includes('report') || lower.includes('performance')) {
        return '📊 **How to Monitor Department Analytics:**\n1. Click on **Attendance Monitoring** or **Results** in your HOD portal.\n2. Filter by subject or semester to audit department performance and generate summary reports.';
      }
      if (lower.includes('notice')) {
        return '📢 **How to Publish Department Notices:**\n1. Click **Notices** in your HOD dashboard.\n2. Click **+ Create Department Notice**.\n3. Target faculty or students in your department and publish instantly.';
      }
    }

    if (role === 'ADMIN') {
      if (lower.includes('student') || lower.includes('faculty') || lower.includes('department') || lower.includes('subject') || lower.includes('room')) {
        return '⚙️ **System Management Operations:**\n1. Navigate to your **Admin Management Dashboard**.\n2. Switch between Students, Faculty, Departments, Courses, Subjects, Rooms, Timetables, Exams, Fees, Users, or Audit Logs.\n3. Use the operational **+ Add**, **Edit**, **Deactivate**, and **Delete** controls with automatic audit tracking.';
      }
      if (lower.includes('audit')) {
        return '📜 **System Auditing:**\n1. Open the **Audit Logs** tab in the Admin portal.\n2. Filter real-time system logs by user ID, action, or date to maintain security compliance.';
      }
    }

    // Default friendly guide response
    return `👋 Hello! I am your **Campus360 AI Assistant**. You are currently logged in as **${role}**.\n\nYou can ask me how to navigate the portal, manage your academic records, submit assignments, track attendance, check fees, or manage system records!`;
  }
}

module.exports = AIService;
