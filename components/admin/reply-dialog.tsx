"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactSubmission {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
  admin_reply?: string
  replied_at?: string
}

interface ReplyDialogProps {
  contact: ContactSubmission
  onReplySuccess: () => void
}

export function ReplyDialog({ contact, onReplySuccess }: ReplyDialogProps) {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState("")
  const [adminName, setAdminName] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleSendReply = async () => {
    if (!reply.trim() || !adminName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both reply message and your name",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, adminName }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reply sent successfully!",
        })
        setReply("")
        setAdminName("")
        setOpen(false)
        onReplySuccess()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to send reply",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200">
          <Mail className="h-4 w-4 mr-1" />
          Reply
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to {contact.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Original Message:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>From:</strong> {contact.name} ({contact.email})
              </p>
              {contact.phone && (
                <p>
                  <strong>Phone:</strong> {contact.phone}
                </p>
              )}
              {contact.subject && (
                <p>
                  <strong>Subject:</strong> {contact.subject}
                </p>
              )}
              <p>
                <strong>Message:</strong>
              </p>
              <p className="bg-white p-3 rounded border whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Reply Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminName">Your Name</Label>
              <Input
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reply">Reply Message</Label>
              <Textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                className="mt-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={sending}>
              {sending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
