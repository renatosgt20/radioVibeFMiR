export default {
  async fetch(request) {

    const url = new URL(request.url);

    // rota da rádio
    if (url.pathname === "/now") {

      return Response.json({
        track: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

        startedAt: Date.now() - 60000
      });
    }

    return new Response("Worker online");
  }
}