export default {
  async fetch(request) {
    // SEU HTML ORIGINAL COMPLETO - COLE AQUI DENTRO
    const html = `COLE SEU HTML ORIGINAL AQUI`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};