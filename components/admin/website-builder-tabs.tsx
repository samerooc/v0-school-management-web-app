"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Layout, Link2, MousePointer, Calendar, ImageIcon } from "lucide-react"
import ThemeEditor from "./theme-editor"
import SectionManager from "./section-manager"
import LinkManager from "./link-manager"
import ButtonManager from "./button-manager"
import EventManager from "./event-manager"
import LogoManager from "./logo-manager"

interface WebsiteBuilderTabsProps {
  theme: any
  settings: Record<string, any>
  sections: any[]
  links: any[]
  buttons: any[]
  events: any[]
}

export default function WebsiteBuilderTabs({
  theme,
  settings,
  sections,
  links,
  buttons,
  events,
}: WebsiteBuilderTabsProps) {
  return (
    <Tabs defaultValue="theme" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
        <TabsTrigger value="theme" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </TabsTrigger>
        <TabsTrigger value="logo" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Logo</span>
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span className="hidden sm:inline">Sections</span>
        </TabsTrigger>
        <TabsTrigger value="links" className="flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">Links</span>
        </TabsTrigger>
        <TabsTrigger value="buttons" className="flex items-center gap-2">
          <MousePointer className="h-4 w-4" />
          <span className="hidden sm:inline">Buttons</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="theme">
        <ThemeEditor theme={theme} />
      </TabsContent>

      <TabsContent value="logo">
        <LogoManager settings={settings} />
      </TabsContent>

      <TabsContent value="sections">
        <SectionManager sections={sections} />
      </TabsContent>

      <TabsContent value="links">
        <LinkManager links={links} />
      </TabsContent>

      <TabsContent value="buttons">
        <ButtonManager buttons={buttons} />
      </TabsContent>

      <TabsContent value="events">
        <EventManager events={events} />
      </TabsContent>
    </Tabs>
  )
}
