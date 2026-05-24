export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/track" && request.method === "POST") {
      try {
        const data = await request.json();
        const country = request.headers.get("cf-ipcountry") || "Unknown";
        const userAgent = request.headers.get("user-agent") || "Unknown";
        
        await env.DB.prepare(
          "INSERT INTO stats (page, visitor_id, country, user_agent) VALUES (?, ?, ?, ?)"
        ).bind(data.page, data.visitor_id, country, userAgent).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    if (url.pathname === "/api/stats" && request.method === "GET") {
      try {
        const results = await env.DB.prepare(`
          SELECT 
            date(timestamp) as date, 
            count(*) as views, 
            count(distinct visitor_id) as visitors 
          FROM stats 
          WHERE timestamp > date('now', '-30 days')
          GROUP BY date 
          ORDER BY date ASC
        `).all();
        
        return new Response(JSON.stringify(results.results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response("Ozarkphea Stats API is running.", { 
      headers: { "Content-Type": "text/plain" } 
    });
  }
};
