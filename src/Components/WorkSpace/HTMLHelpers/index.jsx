export function extractBody(html) {
    const t = html.trim();
    if (!t.includes('<!DOCTYPE') && !t.includes('<html')) return t;

    const match = t.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (match?.[1]) return match[1].trim();

    const fallback = t.match(/<body[^>]*>([\s\S]*)/i);
    return fallback ? fallback[1].replace(/<\/body>[\s\S]*$/i, '').trim() : t;
}


export function extractStyleTag(html) {
    const match = html?.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    return match?.[1]?.trim() || '';
}


export function exportHTML(editor, project) {
    const html = [
        '<!DOCTYPE html><html><head>',
        '  <meta charset="utf-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1">',
        `  <title>${project.name || 'Project'}</title>`,
        `  <style>${editor.getCss()}</style>`,
        '</head><body>',
        editor.getHtml(),
        '</body></html>',
    ].join('\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `${project.slug || 'page'}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
}