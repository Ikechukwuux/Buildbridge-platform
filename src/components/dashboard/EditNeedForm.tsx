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
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
