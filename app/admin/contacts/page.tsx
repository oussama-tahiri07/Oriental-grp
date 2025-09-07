"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Mail, Phone } from "lucide-react"
import Link from "next/link"

interface ContactSubmission {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

function ContactManagementContent() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/admin/contacts")
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (contactId: number) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      })
      if (response.ok) {
        setContacts(contacts.map((contact) => (contact.id === contactId ? { ...contact, is_read: true } : contact)))
      }
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const deleteContact = async (contactId: number) => {
    if (!confirm("Are you sure you want to delete this contact submission?")) return

    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setContacts(contacts.filter((contact) => contact.id !== contactId))
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Contact Submissions</h1>
            <p className="text-gray-600 mt-2">Manage customer inquiries and contact requests</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className={`${!contact.is_read ? "border-orange-200 bg-orange-50" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {contact.name}
                      {!contact.is_read && <Badge className="bg-orange-500">New</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{contact.subject}</p>
                  </div>
                  <div className="flex gap-2">
                    {!contact.is_read && (
                      <Button size="sm" variant="outline" onClick={() => markAsRead(contact.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteContact(contact.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{contact.message}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted on {new Date(contact.created_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ContactManagementPage() {
  return (
    <AuthGuard requiredRole="admin">
      <ContactManagementContent />
    </AuthGuard>
  )
}
