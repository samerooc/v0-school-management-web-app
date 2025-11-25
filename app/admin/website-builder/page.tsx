import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import WebsiteBuilderTabs from "@/components/admin/website-builder-tabs"

export default async function WebsiteBuilderPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  // Get current theme
  const { data: theme } = await supabase.from("website_themes").select("*").eq("is_active", true).single()

  // Get school settings
  const { data: settings } = await supabase.from("school_settings").select("*")
  const settingsMap = settings?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, any>) || {}

  // Get homepage sections
  const { data: sections } = await supabase.from("homepage_sections").select("*").order("display_order")

  // Get custom links
  const { data: links } = await supabase.from("custom_links").select("*").order("display_order")

  // Get custom buttons
  const { data: buttons } = await supabase.from("custom_buttons").select("*").order("display_order")

  // Get events
  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
              <p className="text-sm text-gray-600">Customize your school website design and content</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WebsiteBuilderTabs
          theme={theme}
          settings={settingsMap}
          sections={sections || []}
          links={links || []}
          buttons={buttons || []}
          events={events || []}
        />
      </main>
    </div>
  )
}
