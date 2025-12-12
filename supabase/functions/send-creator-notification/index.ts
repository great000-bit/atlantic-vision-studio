import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreatorApplicationRequest {
  name: string;
  email: string;
  role: string;
  location: string;
  portfolio_link?: string;
  experience: string;
  file_urls: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const application: CreatorApplicationRequest = await req.json();
    
    console.log("New creator application received:", {
      name: application.name,
      email: application.email,
      role: application.role,
      location: application.location,
      portfolio_link: application.portfolio_link,
      experience: application.experience?.substring(0, 100) + "...",
      file_count: application.file_urls?.length || 0,
    });

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - skipping email notification");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Application logged (email notification requires RESEND_API_KEY)" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Build file links HTML
    const fileLinksHtml = application.file_urls?.length > 0
      ? `<p><strong>Uploaded Files:</strong></p>
         <ul>${application.file_urls.map((url, i) => `<li><a href="${url}">File ${i + 1}</a></li>`).join("")}</ul>`
      : "<p><em>No files uploaded</em></p>";

    // Send email notification using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Atlantic Creators <onboarding@resend.dev>",
        to: ["theatlanticcreators@gmail.com"],
        subject: `New Creator Application: ${application.name} - ${application.role}`,
        html: `
          <h1>New Creator Application</h1>
          <p>A new application has been submitted to join the Atlantic Creators Collective.</p>
          
          <h2>Applicant Details</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${application.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${application.email}">${application.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Role</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${application.role}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${application.location}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Portfolio</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${application.portfolio_link ? `<a href="${application.portfolio_link}">${application.portfolio_link}</a>` : "Not provided"}</td>
            </tr>
          </table>
          
          <h2>Experience</h2>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${application.experience}</p>
          
          <h2>Uploaded Files</h2>
          ${fileLinksHtml}
          
          <hr style="margin: 24px 0;" />
          <p style="color: #666; font-size: 12px;">
            This application was submitted through the Atlantic Creators website.
            Log in to the admin panel to manage applications.
          </p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Email delivery failed: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, message: "Application notification sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-creator-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
