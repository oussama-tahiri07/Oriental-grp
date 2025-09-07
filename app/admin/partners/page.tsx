"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, Search, X, Save, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Partner {
  id: number
  name: string
  logo_path: string
  website_url: string
  display_order: number
  created_at: string
}

interface MissionPoint {
  id: number
  text: string
  icon_name: string
  display_order: number
}

interface PartnerFormData {
  name: string
  logo_path: string
  website_url: string
  display_order: string
}

interface MissionFormData {
  text: string
  icon_name: string
  display_order: string
}

const availableIcons = [
  { name: "Users", label: "Users" },
  { name: "GraduationCap", label: "Education" },
  { name: "Heart", label: "Heart" },
  { name: "Globe", label: "Globe" },
  { name: "Award", label: "Award" },
  { name: "Target", label: "Target" },
]

function PartnersManagementContent() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [missionPoints, setMissionPoints] = useState<MissionPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [editingMission, setEditingMission] = useState<MissionPoint | null>(null)
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false)
  const [showAddMissionForm, setShowAddMissionForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [partnerFormData, setPartnerFormData] = useState<PartnerFormData>({
    name: "",
    logo_path: "",
    website_url: "",
    display_order: "0",
  })

  const [missionFormData, setMissionFormData] = useState<MissionFormData>({
    text: "",
    icon_name: "Users",
    display_order: "0",
  })

  useEffect(() => {
    fetchPartners()
    fetchMissionPoints()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/admin/partners")
      if (response.ok) {
        const data = await response.json()
        setPartners(data)
      }
    } catch (error) {
      console.error("Error fetching partners:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMissionPoints = async () => {
    try {
      const response = await fetch("/api/mission-points")
      if (response.ok) {
        const data = await response.json()
        setMissionPoints(data)
      }
    } catch (error) {
      console.error("Error fetching mission points:", error)
    }
  }

  const deletePartner = async (partnerId: number) => {
    if (!confirm("Are you sure you want to delete this partner?")) return

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setPartners(partners.filter((partner) => partner.id !== partnerId))
        setSuccess("Partner deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting partner:", error)
      setError("Failed to delete partner")
    }
  }

  const deleteMissionPoint = async (missionId: number) => {
    if (!confirm("Are you sure you want to delete this mission point?")) return

    try {
      const response = await fetch(`/api/mission-points/${missionId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setMissionPoints(missionPoints.filter((mission) => mission.id !== missionId))
        setSuccess("Mission point deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting mission point:", error)
      setError("Failed to delete mission point")
    }
  }

  const resetPartnerForm = () => {
    setPartnerFormData({
      name: "",
      logo_path: "",
      website_url: "",
      display_order: "0",
    })
    setEditingPartner(null)
    setShowAddPartnerForm(false)
    setError("")
    setSuccess("")
  }

  const resetMissionForm = () => {
    setMissionFormData({
      text: "",
      icon_name: "Users",
      display_order: "0",
    })
    setEditingMission(null)
    setShowAddMissionForm(false)
    setError("")
    setSuccess("")
  }

  const handleEditPartner = (partner: Partner) => {
    setPartnerFormData({
      name: partner.name,
      logo_path: partner.logo_path,
      website_url: partner.website_url,
      display_order: partner.display_order.toString(),
    })
    setEditingPartner(partner)
    setShowAddPartnerForm(false)
  }

  const handleEditMission = (mission: MissionPoint) => {
    setMissionFormData({
      text: mission.text,
      icon_name: mission.icon_name,
      display_order: mission.display_order.toString(),
    })
    setEditingMission(mission)
    setShowAddMissionForm(false)
  }

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!partnerFormData.name.trim()) {
      setError("Partner name is required")
      return
    }

    try {
      const partnerData = {
        name: partnerFormData.name.trim(),
        logo_path: partnerFormData.logo_path.trim() || "/placeholder.svg?height=80&width=120",
        website_url: partnerFormData.website_url.trim(),
        display_order: Number.parseInt(partnerFormData.display_order) || 0,
      }

      const url = editingPartner ? `/api/admin/partners/${editingPartner.id}` : "/api/admin/partners"
      const method = editingPartner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      })

      if (response.ok) {
        const savedPartner = await response.json()

        if (editingPartner) {
          setPartners(partners.map((p) => (p.id === editingPartner.id ? savedPartner : p)))
          setSuccess("Partner updated successfully!")
        } else {
          setPartners([...partners, savedPartner])
          setSuccess("Partner added successfully!")
        }

        resetPartnerForm()
        fetchPartners()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save partner")
      }
    } catch (error) {
      setError("An error occurred while saving the partner")
      console.error("Error saving partner:", error)
    }
  }

  const handleMissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!missionFormData.text.trim()) {
      setError("Mission text is required")
      return
    }

    try {
      const missionData = {
        text: missionFormData.text.trim(),
        icon_name: missionFormData.icon_name,
        display_order: Number.parseInt(missionFormData.display_order) || 0,
      }

      const url = editingMission ? `/api/mission-points/${editingMission.id}` : "/api/mission-points"
      const method = editingMission ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(missionData),
      })

      if (response.ok) {
        const savedMission = await response.json()

        if (editingMission) {
          setMissionPoints(missionPoints.map((m) => (m.id === editingMission.id ? savedMission : m)))
          setSuccess("Mission point updated successfully!")
        } else {
          setMissionPoints([...missionPoints, savedMission])
          setSuccess("Mission point added successfully!")
        }

        resetMissionForm()
        fetchMissionPoints()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save mission point")
      }
    } catch (error) {
      setError("An error occurred while saving the mission point")
      console.error("Error saving mission point:", error)
    }
  }

  const filteredPartners = partners.filter((partner) => partner.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Partners Management</h1>
            <p className="text-gray-600 mt-2">Manage your business partners and BAYTI Association mission</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Partner Form */}
        {(showAddPartnerForm || editingPartner) && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</CardTitle>
                <Button variant="outline" size="sm" onClick={resetPartnerForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePartnerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="partner_name">Partner Name *</Label>
                    <Input
                      id="partner_name"
                      value={partnerFormData.name}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                      placeholder="Enter partner name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner_display_order">Display Order</Label>
                    <Input
                      id="partner_display_order"
                      type="number"
                      value={partnerFormData.display_order}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, display_order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="partner_logo">Logo Path</Label>
                    <Input
                      id="partner_logo"
                      value={partnerFormData.logo_path}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, logo_path: e.target.value })}
                      placeholder="/images/partner-logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner_website">Website URL</Label>
                    <Input
                      id="partner_website"
                      type="url"
                      value={partnerFormData.website_url}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, website_url: e.target.value })}
                      placeholder="https://partner-website.com"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    {editingPartner ? "Update Partner" : "Add Partner"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetPartnerForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Mission Point Form */}
        {(showAddMissionForm || editingMission) && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingMission ? "Edit Mission Point" : "Add New Mission Point"}</CardTitle>
                <Button variant="outline" size="sm" onClick={resetMissionForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMissionSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="mission_text">Mission Text *</Label>
                  <Textarea
                    id="mission_text"
                    value={missionFormData.text}
                    onChange={(e) => setMissionFormData({ ...missionFormData, text: e.target.value })}
                    placeholder="Enter mission point description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="mission_icon">Icon</Label>
                    <select
                      id="mission_icon"
                      value={missionFormData.icon_name}
                      onChange={(e) => setMissionFormData({ ...missionFormData, icon_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableIcons.map((icon) => (
                        <option key={icon.name} value={icon.name}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="mission_display_order">Display Order</Label>
                    <Input
                      id="mission_display_order"
                      type="number"
                      value={missionFormData.display_order}
                      onChange={(e) => setMissionFormData({ ...missionFormData, display_order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    {editingMission ? "Update Mission" : "Add Mission"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetMissionForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Partners Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Partners ({filteredPartners.length})</CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search partners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAddPartnerForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img
                          src={partner.logo_path || "/placeholder.svg"}
                          alt={partner.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{partner.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Order: {partner.display_order}</span>
                          {partner.website_url && (
                            <a
                              href={partner.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPartner(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePartner(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission Points Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>BAYTI Association Mission Points ({missionPoints.length})</CardTitle>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAddMissionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Mission Point
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {missionPoints.map((mission) => (
                <div key={mission.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{mission.icon_name}</span>
                        <span className="text-sm text-gray-500">Order: {mission.display_order}</span>
                      </div>
                      <p className="text-gray-700">{mission.text}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditMission(mission)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteMissionPoint(mission.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PartnersManagementPage() {
  return (
    <AuthGuard requiredRole="admin">
      <PartnersManagementContent />
    </AuthGuard>
  )
}
