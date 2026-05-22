export default {
  async fetch(request) {
    return new Response(`<!DOCTYPE html>
<html>
<head>
  <title>Vibe Radio</title>
</head>
<body>
  <h1>Minha Rádio</h1>
</body>
</html>`, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
}