import * as React from "react"
import { notFound } from "next/navigation"
import { IMPACT_STORIES } from "@/lib/impact-stories"
import { StoryDetail } from "@/components/impact/StoryDetail"
import type { Metadata } from "next"

interface StoryPageProps {
  params: Promise<{ storyId: string }>
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { storyId } = await params
  const story = IMPACT_STORIES.find(s => s.id === storyId)
  if (!story) return { title: "Story Not Found | BuildBridge" }
  return {
    title: `${story.title} | BuildBridge Impact`,
    description: story.caption,
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { storyId } = await params
  const story = IMPACT_STORIES.find(s => s.id === storyId)

  if (!story) {
    notFound()
  }

  return <StoryDetail story={story} />
}
