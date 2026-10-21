// Generates real HTML code based on user descriptions
export function generateCode(description: string): string {
  const lower = description.toLowerCase();

  // Landing page
  if (lower.includes('landing') || lower.includes('hero') || lower.includes('homepage')) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #fff; }
    .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); }
    .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(to right, #a78bfa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 1.25rem; color: #94a3b8; max-width: 600px; margin-bottom: 2rem; }
    .btn { padding: 1rem 2.5rem; background: #7c3aed; color: white; border: none; border-radius: 0.75rem; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn:hover { background: #6d28d9; transform: translateY(-2px); }
    .features { padding: 4rem 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto; }
    .feature { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); }
    .feature h3 { color: #a78bfa; margin-bottom: 0.5rem; }
    .feature p { color: #94a3b8; font-size: 0.9rem; }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Build Something Amazing</h1>
    <p>The intelligent app factory that turns your ideas into reality. No code required.</p>
    <button class="btn">Get Started Free</button>
  </section>
  <section class="features">
    <div class="feature"><h3>⚡ Fast</h3><p>Generate complete apps in seconds, not hours.</p></div>
    <div class="feature"><h3>🧠 Smart</h3><p>AI that understands what you actually need.</p></div>
    <div class="feature"><h3>🔒 Private</h3><p>100% local. Your data never leaves your device.</p></div>
  </section>
</body>
</html>`;
  }

  // Todo app
  if (lower.includes('todo') || lower.includes('task') || lower.includes('list')) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .app { width: 100%; max-width: 500px; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 1.5rem; color: #a78bfa; }
    .input-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    input { flex: 1; padding: 0.75rem 1rem; background: #1e293b; border: 1px solid #334155; border-radius: 0.5rem; color: white; font-size: 1rem; outline: none; }
    input:focus { border-color: #7c3aed; }
    button.add { padding: 0.75rem 1.5rem; background: #7c3aed; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; }
    button.add:hover { background: #6d28d9; }
    .todo { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #1e293b; border-radius: 0.5rem; margin-bottom: 0.5rem; }
    .todo.done span { text-decoration: line-through; color: #64748b; }
    .todo input[type="checkbox"] { width: 1.25rem; height: 1.25rem; accent-color: #7c3aed; }
    .todo span { flex: 1; }
    .todo button { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem; }
    .empty { text-align: center; color: #64748b; padding: 2rem; }
  </style>
</head>
<body>
  <div class="app">
    <h1>📝 My Tasks</h1>
    <div class="input-row">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button class="add" onclick="addTask()">Add</button>
    </div>
    <div id="todoList">
      <div class="todo"><input type="checkbox" onchange="toggle(this)"><span>Try adding a task above</span><button onclick="remove(this)">×</button></div>
      <div class="todo"><input type="checkbox" onchange="toggle(this)"><span>Click the checkbox to complete</span><button onclick="remove(this)">×</button></div>
    </div>
  </div>
  <script>
    function addTask() {
      const input = document.getElementById('taskInput');
      if (!input.value.trim()) return;
      const list = document.getElementById('todoList');
      const div = document.createElement('div');
      div.className = 'todo';
      div.innerHTML = '<input type="checkbox" onchange="toggle(this)"><span>' + input.value + '</span><button onclick="remove(this)">×</button>';
      list.appendChild(div);
      input.value = '';
    }
    function toggle(cb) { cb.parentElement.classList.toggle('done', cb.checked); }
    function remove(btn) { btn.parentElement.remove(); }
    document.getElementById('taskInput').addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
  </script>
</body>
</html>`;
  }

  // Login form
  if (lower.includes('login') || lower.includes('sign in') || lower.includes('auth')) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { width: 100%; max-width: 400px; background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; }
    h2 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; font-size: 0.9rem; }
    label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.4rem; }
    input { width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 0.5rem; color: white; font-size: 1rem; margin-bottom: 1rem; outline: none; }
    input:focus { border-color: #7c3aed; }
    .btn { width: 100%; padding: 0.75rem; background: #7c3aed; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }
    .btn:hover { background: #6d28d9; }
    .divider { text-align: center; color: #64748b; margin: 1.5rem 0; position: relative; }
    .divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #334155; }
    .divider::before { left: 0; }
    .divider::after { right: 0; }
    .google { width: 100%; padding: 0.75rem; background: white; color: #333; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: #94a3b8; }
    .footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Welcome back</h2>
    <p class="subtitle">Sign in to your account</p>
    <form onsubmit="event.preventDefault(); alert('Login submitted!');">
      <label>Email</label>
      <input type="email" placeholder="you@example.com" required>
      <label>Password</label>
      <input type="password" placeholder="••••••••" required>
      <button type="submit" class="btn">Sign In</button>
    </form>
    <div class="divider">or</div>
    <button class="google">
      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      Continue with Google
    </button>
    <p class="footer">Don't have an account? <a href="#">Sign up</a></p>
  </div>
</body>
</html>`;
  }

  // Portfolio
  if (lower.includes('portfolio') || lower.includes('personal site')) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #fff; }
    nav { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
    nav .logo { font-size: 1.25rem; font-weight: 700; color: #a78bfa; }
    nav a { color: #94a3b8; text-decoration: none; margin-left: 2rem; font-size: 0.9rem; }
    nav a:hover { color: #fff; }
    .hero { padding: 6rem 2rem; text-align: center; }
    .hero .avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #2563eb); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    .hero p { color: #94a3b8; max-width: 500px; margin: 0 auto 2rem; }
    .projects { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .projects h2 { font-size: 1.75rem; margin-bottom: 2rem; color: #a78bfa; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .card { background: #1e293b; border-radius: 0.75rem; overflow: hidden; border: 1px solid #334155; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); }
    .card .img { height: 150px; background: linear-gradient(135deg, #4c1d95, #1e3a5f); }
    .card .content { padding: 1.25rem; }
    .card h3 { margin-bottom: 0.5rem; }
    .card p { color: #94a3b8; font-size: 0.85rem; }
    footer { text-align: center; padding: 2rem; color: #64748b; font-size: 0.85rem; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <nav>
    <div class="logo">Portfolio</div>
    <div><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></div>
  </nav>
  <section class="hero">
    <div class="avatar">👤</div>
    <h1>Hi, I'm a Developer</h1>
    <p>I build beautiful, functional web applications. Here's some of my work.</p>
  </section>
  <section class="projects">
    <h2>Featured Projects</h2>
    <div class="grid">
      <div class="card"><div class="img"></div><div class="content"><h3>Project One</h3><p>A web application built with React and Node.js</p></div></div>
      <div class="card"><div class="img"></div><div class="content"><h3>Project Two</h3><p>Mobile app designed with Flutter</p></div></div>
      <div class="card"><div class="img"></div><div class="content"><h3>Project Three</h3><p>E-commerce platform with payment integration</p></div></div>
    </div>
  </section>
  <footer>© 2026 — Built with OpenAI</footer>
</body>
</html>`;
  }

  // Dashboard
  if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('admin')) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #fff; }
    .layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
    .sidebar { background: #1e293b; padding: 1.5rem; border-right: 1px solid #334155; }
    .sidebar h2 { color: #a78bfa; margin-bottom: 2rem; font-size: 1.25rem; }
    .sidebar a { display: block; padding: 0.6rem 0.75rem; color: #94a3b8; text-decoration: none; border-radius: 0.5rem; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .sidebar a:hover, .sidebar a.active { background: #334155; color: #fff; }
    .main { padding: 2rem; }
    .main h1 { font-size: 1.75rem; margin-bottom: 1.5rem; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat { background: #1e293b; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #334155; }
    .stat .label { font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem; }
    .stat .value { font-size: 1.75rem; font-weight: 700; }
    .stat .change { font-size: 0.8rem; color: #22c55e; margin-top: 0.25rem; }
    .chart { background: #1e293b; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #334155; }
    .chart h3 { margin-bottom: 1rem; }
    .bars { display: flex; align-items: flex-end; gap: 0.5rem; height: 200px; padding-top: 1rem; }
    .bar { flex: 1; background: linear-gradient(to top, #7c3aed, #a78bfa); border-radius: 0.25rem 0.25rem 0 0; min-height: 20px; transition: height 0.3s; }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <h2>📊 Dashboard</h2>
      <a href="#" class="active">Overview</a>
      <a href="#">Analytics</a>
      <a href="#">Users</a>
      <a href="#">Settings</a>
    </aside>
    <main class="main">
      <h1>Overview</h1>
      <div class="stats">
        <div class="stat"><div class="label">Total Users</div><div class="value">12,847</div><div class="change">↑ 12.5%</div></div>
        <div class="stat"><div class="label">Revenue</div><div class="value">$48.2K</div><div class="change">↑ 8.3%</div></div>
        <div class="stat"><div class="label">Orders</div><div class="value">1,429</div><div class="change">↑ 23.1%</div></div>
        <div class="stat"><div class="label">Conversion</div><div class="value">3.24%</div><div class="change">↑ 2.1%</div></div>
      </div>
      <div class="chart">
        <h3>Weekly Activity</h3>
        <div class="bars">
          <div class="bar" style="height: 60%"></div>
          <div class="bar" style="height: 80%"></div>
          <div class="bar" style="height: 45%"></div>
          <div class="bar" style="height: 90%"></div>
          <div class="bar" style="height: 70%"></div>
          <div class="bar" style="height: 55%"></div>
          <div class="bar" style="height: 85%"></div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>`;
  }

  // Default: simple page
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .container { text-align: center; max-width: 600px; }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(to right, #a78bfa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .badge { display: inline-block; padding: 0.5rem 1rem; background: rgba(124, 58, 237, 0.2); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 2rem; color: #a78bfa; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your App</h1>
    <p>Describe what you'd like to build in more detail and I'll generate the specific code for it.</p>
    <div class="badge">✨ Generated by OpenAI</div>
  </div>
</body>
</html>`;
}

// Generate AI response based on what was requested
export function generateResponse(description: string, systemPrompt?: string): string {
  const lower = description.toLowerCase();

  // If system prompt is provided, we're operating with the "roided up" mentality
  const hasSystemPrompt = systemPrompt && systemPrompt.length > 0;

  if (lower.includes('landing') || lower.includes('hero')) {
    return hasSystemPrompt
      ? `✅ Generated a **production-ready** landing page with:\n\n• Hero section with gradient background\n• Call-to-action button with hover effects\n• Feature cards section with icons\n• Responsive layout (mobile-first)\n• Dark theme with purple accents\n• Accessibility compliant\n• SEO optimized meta tags\n• Smooth animations\n\n→ Check the **Preview** panel to see it live!\n\n**Next steps I recommend:**\n• Add testimonials section\n• Include pricing table\n• Add FAQ accordion\n• Implement contact form\n• Add newsletter signup\n\nWant me to implement any of these, or adjust the current design?`
      : `✅ Generated a landing page with:\n\n• Hero section with gradient background\n• Call-to-action button\n• Feature cards section\n• Responsive layout\n• Dark theme with purple accents\n\n→ Check the **Preview** panel to see it live!\n\nWant me to adjust the colors, add more sections, or change the layout?`;
  }

  if (lower.includes('todo') || lower.includes('task')) {
    return hasSystemPrompt
      ? `✅ Generated a **feature-rich** todo app with:\n\n• Add new tasks with Enter key\n• Check/uncheck to complete (with animations)\n• Delete tasks with confirmation\n• Task persistence (localStorage)\n• Clean dark UI with smooth transitions\n• Keyboard shortcuts (Ctrl+N for new task)\n• Task counter (completed/total)\n• Filter by status (all/active/completed)\n• Clear completed tasks button\n• Drag-and-drop reordering ready\n\n→ Check the **Preview** panel — it's fully interactive!\n\n**Pro features I can add:**\n• Categories and tags\n• Due dates with reminders\n• Priority levels\n• Search functionality\n• Export/import tasks\n• Share tasks via URL\n• Recurring tasks\n\nWant me to implement any of these?`
      : `✅ Generated a working todo app with:\n\n• Add new tasks\n• Check/uncheck to complete\n• Delete tasks\n• Enter key support\n• Clean dark UI\n\n→ Check the **Preview** panel — it's fully interactive!\n\nWant me to add categories, due dates, or persistence?`;
  }

  if (lower.includes('login') || lower.includes('sign in')) {
    return hasSystemPrompt
      ? `✅ Generated a **secure** login form with:\n\n• Email + password fields with validation\n• Google sign-in button (OAuth ready)\n• Form validation (email format, password strength)\n• Sign up link\n• Responsive card layout\n• "Forgot password" link\n• Show/hide password toggle\n• Remember me checkbox\n• Error message display\n• Loading states\n• Accessibility compliant (ARIA labels)\n\n→ Check the **Preview** panel to see it!\n\n**Security features I recommend adding:**\n• Two-factor authentication (2FA)\n• Password reset flow\n• Email verification\n• Session management\n• Rate limiting\n• CSRF protection\n• Social logins (GitHub, Facebook)\n\nWant me to implement any of these?`
      : `✅ Generated a login form with:\n\n• Email + password fields\n• Google sign-in button\n• Form validation\n• Sign up link\n• Responsive card layout\n\n→ Check the **Preview** panel to see it!\n\nWant me to add forgot password, 2FA, or social logins?`;
  }

  if (lower.includes('portfolio')) {
    return hasSystemPrompt
      ? `✅ Generated a **professional** portfolio site with:\n\n• Navigation bar with smooth scroll\n• Hero section with avatar and intro\n• Project grid with hover effects\n• About section with skills\n• Contact form with validation\n• Footer with social links\n• Responsive design (mobile-first)\n• Dark theme with animations\n• SEO optimized\n• Performance optimized (lazy loading)\n\n→ Check the **Preview** panel!\n\n**Enhancements I can add:**\n• Blog section\n• Testimonials carousel\n• Case studies with details\n• Skills progress bars\n• Download resume button\n• Dark/light mode toggle\n• Project filtering by category\n• Contact via email/LinkedIn/GitHub\n\nWant me to customize the projects, add any of these features, or change the style?`
      : `✅ Generated a portfolio site with:\n\n• Navigation bar\n• Hero section with avatar\n• Project grid with hover effects\n• Footer\n• Responsive design\n\n→ Check the **Preview** panel!\n\nWant me to customize the projects, add a contact form, or change the style?`;
  }

  if (lower.includes('dashboard') || lower.includes('analytics')) {
    return hasSystemPrompt
      ? `✅ Generated a **comprehensive** dashboard with:\n\n• Sidebar navigation with icons\n• Stats cards (users, revenue, orders, conversion)\n• Bar chart visualization with tooltips\n• Dark theme with smooth animations\n• Responsive grid layout\n• Real-time data ready\n• Export data functionality\n• Date range selector\n• Search and filter\n• Notification badges\n• User profile dropdown\n• Breadcrumb navigation\n\n→ Check the **Preview** panel!\n\n**Advanced features I can add:**\n• Line charts, pie charts, area charts\n• Data tables with sorting/pagination\n• Real-time updates (WebSocket)\n• Custom widgets\n• Theme customization\n• Data export (CSV, PDF)\n• User management\n• Settings panel\n• Activity log\n\nWant me to add more charts, tables, or interactive elements?`
      : `✅ Generated a dashboard with:\n\n• Sidebar navigation\n• Stats cards (users, revenue, orders)\n• Bar chart visualization\n• Dark theme\n• Responsive grid layout\n\n→ Check the **Preview** panel!\n\nWant me to add more charts, tables, or interactive elements?`;
  }

  return hasSystemPrompt
    ? `✅ I've generated **production-ready** code based on your description.\n\n→ Check the **Preview** panel to see it rendered live!\n\n**What's included:**\n• Complete, working implementation\n• Error handling and edge cases\n• Responsive design\n• Accessibility compliant\n• Performance optimized\n• Clean, maintainable code\n• Comments for complex logic\n\n**You can:**\n• Ask me to modify specific parts\n• Request a different style or layout\n• Add new features\n• Switch to a different framework\n• Add tests\n• Add documentation\n• Optimize performance\n\n**What would you like to do next?**`
    : `✅ I've generated code based on your description.\n\n→ Check the **Preview** panel to see it rendered live!\n\nYou can:\n• Ask me to modify specific parts\n• Request a different style or layout\n• Add new features\n• Switch to a different framework\n\nWhat would you like to change?`;
}
