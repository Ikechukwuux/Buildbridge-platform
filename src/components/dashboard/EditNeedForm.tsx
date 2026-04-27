import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Loader2 } from "lucide-react"

export function EditNeedForm({ need }: { need: any }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [itemName, setItemName] = useState(need.item_name || "")
  const [itemCost, setItemCost] = useState((need.item_cost / 100).toString() || "")
  const [story, setStory] = useState(need.story || "")
  const [photoUrl, setPhotoUrl] = useState(need.photo_url || "")
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload photo')
      }

      const data = await res.json()
      setPhotoUrl(data.url)
    } catch (err: any) {
      console.error("Photo upload failed:", err)
      setError(err.message || "Failed to upload photo.")
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const costInKobo = Math.round(parseFloat(itemCost) * 100)
      if (isNaN(costInKobo) || costInKobo <= 0) {
        throw new Error("Please enter a valid amount")
      }

      const { error: updateError } = await supabase
        .from('needs')
        .update({
          item_name: itemName,
          item_cost: costInKobo,
          story: story,
          photo_url: photoUrl,
          location_state: need.location_state || null,
          location_lga: need.location_lga || null,
        })
        .eq('id', need.id)

      if (updateError) throw updateError
      
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update need")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-error/10 border border-error/30 rounded-2xl">
          <p className="text-sm font-bold text-error">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface">Need Photo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-surface-variant/50 border-2 border-dashed border-outline-variant flex items-center justify-center shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt="Need" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 text-center px-2">No Photo</span>
            )}
            {isUploadingPhoto && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="inline-flex items-center justify-center h-10 px-6 rounded-full border-2 border-outline-variant hover:bg-surface-variant/50 text-sm font-black text-on-surface cursor-pointer transition-colors shadow-sm disabled:opacity-50">
              {isUploadingPhoto ? "Uploading..." : "Change Photo"}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload}
                disabled={isUploadingPhoto}
              />
            </label>
            <p className="text-xs text-on-surface-variant mt-2 font-medium">Recommended: Square or landscape image, max 5MB</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface">What do you need?</label>
        <Input 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          required 
          placeholder="e.g. Sewing Machine" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface">Estimated Cost (₦)</label>
        <Input 
          type="number"
          value={itemCost} 
          onChange={(e) => setItemCost(e.target.value)} 
          required 
          min="1000"
          step="500"
          placeholder="e.g. 50000" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface">Your Story</label>
        <Textarea 
          value={story} 
          onChange={(e) => setStory(e.target.value)} 
          required 
          rows={6}
          placeholder="Why do you need this? How will it help your business?" 
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  )
}
