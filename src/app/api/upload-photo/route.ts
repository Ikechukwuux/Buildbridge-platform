import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("photo") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No photo file provided." },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Image must be smaller than 5MB." },
        { status: 400 }
      )
    }

    // Sanitise extension — only allow known-safe values
    const rawExt = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(rawExt) ? rawExt : 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const folder = (formData.get("folder") as string) || "covers"
    const filePath = `${folder}/${fileName}`

    // Ensure the needs bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    if (!listError) {
      const needsBucket = buckets?.find((b: any) => b.name === "needs")
      if (!needsBucket) {
        console.warn("Bucket 'needs' not found, creating it...")
        const { error: createError } = await supabaseAdmin.storage.createBucket("needs", {
          public: true,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
          fileSizeLimit: "5MB",
        })
        if (createError) {
          console.error("Failed to create bucket:", createError)
          return NextResponse.json(
            { success: false, error: `Could not create storage bucket: ${createError.message}` },
            { status: 500 }
          )
        }
      }
    }

    // Upload to Supabase Storage (using service role key to bypass RLS)
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("needs")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("needs")
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    })
  } catch (err: any) {
    console.error("Upload photo exception:", err)
    return NextResponse.json(
      { success: false, error: err?.message || err?.toString() || "An unexpected error occurred during upload." },
      { status: 500 }
    )
  }
}
