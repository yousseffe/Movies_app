"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EmailTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()
  const [testEmail, setTestEmail] = useState("")

  const handleTestConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-email")
      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast({
          title: "Email configuration is valid",
          description: "Your email server configuration appears to be working correctly.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Email configuration error",
          description: data.message || "There was a problem with your email configuration.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Test failed",
        description: "An error occurred while testing the email configuration.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address to send the test email to.",
      })
      return
    }

    setIsLoading(true)
    try {
      // This would be a new API route to send a test email
      const response = await fetch("/api/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Test email sent",
          description: `A test email has been sent to ${testEmail}. Please check your inbox.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send test email",
          description: data.message || "There was a problem sending the test email.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Test failed",
        description: "An error occurred while sending the test email.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Email Configuration Test</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
          <CardDescription>Verify that your email server settings are configured correctly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={handleTestConfig} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Configuration"}
            </Button>
          </div>

          {result && (
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Send Test Email</h3>
            <div className="space-y-2">
              <Label htmlFor="test-email">Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="Enter email address"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleSendTestEmail} disabled={isLoading || !testEmail} className="mt-2">
              {isLoading ? "Sending..." : "Send Test Email"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <h3 className="text-lg font-medium mb-2">Current Email Configuration</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Host:</strong> {process.env.EMAIL_SERVER_HOST || "Not set"}
            </p>
            <p>
              <strong>Port:</strong> {process.env.EMAIL_SERVER_PORT || "Not set"}
            </p>
            <p>
              <strong>Secure:</strong> {process.env.EMAIL_SERVER_SECURE || "Not set"}
            </p>
            <p>
              <strong>From:</strong> {process.env.EMAIL_FROM || "Not set"}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

