export default {

  async fetch(request) {

    const data = {
      track: "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",
      startedAt: 1779408575397
    };

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      }
    );

  }

}