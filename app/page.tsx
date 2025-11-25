import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  Award,
  Building2,
  GraduationCap,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("school_settings").select("key, value")

  const settingsMap =
    settings?.reduce(
      (acc, { key, value }) => {
        // Value is already the correct type from Supabase JSONB column
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  // Fetch latest announcements
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("published", true)
    .order("publish_date", { ascending: false })
    .limit(3)

  // Fetch gallery images
  const { data: galleryImages } = await supabase.from("gallery_images").select("*").order("display_order").limit(6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {settingsMap.school_name || "Greenwood International School"}
                </h1>
                <p className="text-sm text-gray-600">{settingsMap.school_tagline || "Excellence in Education"}</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-600">Established {settingsMap.established_year || "2005"}</Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
              Welcome to {settingsMap.school_name || "Greenwood International School"}
            </h2>
            <p className="text-xl text-gray-700 mb-8 text-pretty leading-relaxed">
              {settingsMap.about_us || "Nurturing young minds and fostering excellence in education"}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/login">Portal Login</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{settingsMap.total_students || "1200+"}</div>
                <div className="text-sm text-gray-600">Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{settingsMap.faculty_count || "85+"}</div>
                <div className="text-sm text-gray-600">Faculty Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Awards Won</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{settingsMap.campus_area || "15 Acres"}</div>
                <div className="text-sm text-gray-600">Campus Area</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">About Our School</h2>
            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
              {settingsMap.about_us ||
                "Welcome to Greenwood International School, where we nurture young minds and foster excellence in education."}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
                  <p className="text-gray-600">
                    Comprehensive curriculum designed to challenge and inspire students to achieve their full potential.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Experienced Faculty</h3>
                  <p className="text-gray-600">
                    Dedicated and qualified teachers committed to providing personalized attention to every student.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Holistic Development</h3>
                  <p className="text-gray-600">
                    Focus on overall growth including academics, sports, arts, and character building.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Campus Gallery</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <Card key={image.id} className="overflow-hidden group cursor-pointer">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image.image_url || "/placeholder.svg?height=400&width=600"}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-sm">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Announcements Section */}
      {announcements && announcements.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-bold text-gray-900">Latest Announcements</h2>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                            {announcement.priority === "high" && <Badge variant="destructive">Important</Badge>}
                          </div>
                          <p className="text-gray-600 mb-3">{announcement.content}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(announcement.publish_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">{settingsMap.contact_phone || "+91-11-2345-6789"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">{settingsMap.contact_email || "info@greenwood.edu"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-600 text-sm">
                    {settingsMap.contact_address || "Sector 21, Knowledge Park, New Delhi"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">
              © {new Date().getFullYear()} {settingsMap.school_name || "Greenwood International School"}. All rights
              reserved.
            </p>
            <p className="text-gray-400 text-sm">Principal: {settingsMap.principal_name || "Dr. Meera Sharma"}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
