interface WelcomeEmailProps {
  name: string
  verificationUrl?: string
}

export default function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", lineHeight: "1.5" }}>
      <div style={{ backgroundColor: "#D92424", padding: "20px", textAlign: "center", borderBottom: "4px solid #B22222" }}>
        <h1 style={{ color: "#ffffff", margin: "0" }}>Welcome to Movie Platform!</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <p style={{ color: "#333", fontSize: "16px" }}>Hello {name},</p>
        <p style={{ color: "#333", fontSize: "16px" }}>
          Thank you for joining our Movie Platform! We're excited to have you as part of our community.
        </p>

        {verificationUrl && (
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a
              href={verificationUrl}
              style={{
                backgroundColor: "#0070f3",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Verify Your Email
            </a>
          </div>
        )}

        <p style={{ color: "#333", fontSize: "16px" }}>With your new account, you can:</p>
        <ul style={{ paddingLeft: "20px", color: "#333", fontSize: "16px" }}>
          <li>Browse our movie collection</li>
          <li>Create and manage your watchlist</li>
          <li>Rate and review movies</li>
          <li>Get personalized recommendations</li>
        </ul>

        <p style={{ color: "#333", fontSize: "16px" }}>
          If you need assistance, feel free to reach out to our support team.
        </p>
        <p style={{ color: "#333", fontSize: "16px" }}>Happy watching!</p>
        <p style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>The Movie Platform Team</p>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
          borderTop: "1px solid #ddd",
        }}
      >
        <p>© {new Date().getFullYear()} Movie Platform. All rights reserved.</p>
        <p>If you did not sign up for this account, please ignore this email or contact support.</p>
      </div>
    </div>
  )
}
