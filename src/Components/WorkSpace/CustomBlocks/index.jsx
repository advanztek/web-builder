export const CUSTOM_BLOCKS = [
    {
        id: 'hero-section',
        label: 'Hero Section',
        category: 'Sections',
        content: `
      <section style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:100px 20px;text-align:center;color:white;">
        <div style="max-width:800px;margin:0 auto;">
          <h1 style="font-size:48px;font-weight:bold;margin-bottom:20px;">Welcome to Our Website</h1>
          <p style="font-size:20px;margin-bottom:30px;opacity:0.9;">Build amazing experiences with our platform</p>
          <button style="background:white;color:#667eea;padding:15px 40px;border:none;border-radius:5px;font-size:18px;font-weight:bold;cursor:pointer;">Get Started</button>
        </div>
      </section>`,
        media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="3" width="20" height="10" rx="2"/></svg>',
    },
    {
        id: 'feature-card',
        label: 'Feature Card',
        category: 'Components',
        content: `
      <div style="background:white;border-radius:10px;padding:30px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center;">
        <div style="font-size:48px;margin-bottom:15px;">✨</div>
        <h3 style="font-size:24px;font-weight:bold;margin-bottom:10px;color:#333;">Amazing Feature</h3>
        <p style="color:#666;line-height:1.6;">This is a description of an amazing feature.</p>
      </div>`,
        media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="4" y="4" width="16" height="16" rx="2"/></svg>',
    },
    {
        id: 'navbar',
        label: 'Navigation',
        category: 'Sections',
        content: `
      <nav style="background:white;box-shadow:0 2px 4px rgba(0,0,0,0.1);padding:15px 20px;">
        <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:24px;font-weight:bold;color:#1976d2;">Brand</div>
          <div style="display:flex;gap:30px;">
            <a href="#" style="color:#333;text-decoration:none;">Home</a>
            <a href="#" style="color:#333;text-decoration:none;">About</a>
            <a href="#" style="color:#333;text-decoration:none;">Contact</a>
          </div>
        </div>
      </nav>`,
        media: '<svg viewBox="0 0 24 24"><rect fill="currentColor" x="2" y="4" width="20" height="3" rx="1"/></svg>',
    },
];