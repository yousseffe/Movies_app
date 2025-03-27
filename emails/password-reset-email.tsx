interface PasswordResetEmailProps {
  name: string
  resetUrl: string
}

export default function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#333" }}>Action Required: Reset Your Password</h1>
      </div>
      <div style={{ padding: "20px" }}>
        <p>Hello {name},</p>
        <p>
          We noticed that you requested to reset your password for your Movie Platform account. 
          If you made this request, click the button below to reset your password.
        </p>
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={resetUrl}
            style={{
              backgroundColor: "#0070f3",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Reset Password
          </a>
        </div>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p style={{ wordBreak: "break-all", color: "#0070f3" }}>{resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you did not request this reset, you can safely ignore this email—your account remains secure.</p>
        <p>If you need any help, contact our support team.</p>
        <p>Best regards,</p>
        <p>The Movie Platform Team</p>
      </div>
      <div
        style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center", fontSize: "12px", color: "#666" }}
      >
        <p>© {new Date().getFullYear()} Movie Platform. All rights reserved.</p>
        <p>For support, visit <a href="https://movieplatform.com/support">our help center</a>.</p>
        <p>
          If you no longer wish to receive emails, 
          <a href="https://movieplatform.com/unsubscribe">unsubscribe here</a>.
        </p>
      </div>
    </div>
  )
}
