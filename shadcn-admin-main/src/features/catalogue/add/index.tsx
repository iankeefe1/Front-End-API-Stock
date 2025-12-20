import { useRef, useState } from "react"
import { useNavigate } from '@tanstack/react-router'
import { Separator } from "@/components/ui/separator"
import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"

export function CatalogueAdd() {
  const [catalogueName, setCatalogueName] = useState("")
  const [catalogueCode, setcatalogueCode] = useState("")
  const [cataloguecategory, setcataloguecategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [catalogueSpecification, setcatalogueSpecification] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageName, setImageName] = useState("No file chosen")
  const [catalogueprice, setCataloguePrice] = useState<number | "">("")
  const [cataloguecounterparty, setcataloguecounterparty] = useState("")

  const fileRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const showExtraButton = catalogueName.trim() !== "" && imagePreview !== null
  const showapproverejectbutton = catalogueName.trim() == ""

  return (
    <>
      <Header>
        <Search />
        <div className="ms-auto flex items-center gap-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ✅ allow page scrolling */}
      <Main fixed className="overflow-y-auto">
        <div className="space-y-6 pb-16">
          <h1 className="text-2xl font-bold tracking-tight">
            Add Catalogue
          </h1>

          <Separator />

          <Card className="max-w-6xl">
            <CardHeader>
              <CardTitle className="text-lg">
                Catalogue Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={catalogueName}
                    onChange={(e) => setCatalogueName(e.target.value)}
                    placeholder="Type here..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Code</Label>
                  <Input
                    value={catalogueCode}
                    onChange={(e) => setcatalogueCode(e.target.value)}
                    placeholder="Type here..."
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Product Price</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={catalogueprice}
                      onChange={(e) => {
                        const value = e.target.value
                        setCataloguePrice(value === "" ? "" : Number(value))
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                    />
                  </div>

                <div className="space-y-2">
                  <Label>Product Counterparty</Label>
                  <Select
                    value={cataloguecounterparty}
                    onValueChange={setcataloguecounterparty}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Counterparty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Apps</SelectItem>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="notConnected">
                        Not Connected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Category</Label>
                  <Select
                    value={cataloguecategory}
                    onValueChange={setcataloguecategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Apps</SelectItem>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="notConnected">
                        Not Connected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Product Listing Date</Label>
                  <DatePicker
                    selected={date}
                    onSelect={setDate}
                    className="w-full h-10 justify-start"
                  />
                </div>
              </div>

              {/* Specification */}
              <div className="space-y-2">
                <Label>Product Specification</Label>
                <Textarea
                  value={catalogueSpecification}
                  onChange={(e) =>
                    setcatalogueSpecification(e.target.value)
                  }
                  placeholder="Type here..."
                  className="resize-y"
                />
              </div>

              {/* Image upload + smaller responsive preview */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Upload */}
                <div className="space-y-2">
                  <Label>Product Image</Label>

                  <div className="flex h-10 w-full items-center rounded-md border border-input bg-background">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-full rounded-r-none"
                      onClick={() => fileRef.current?.click()}
                    >
                      Choose File
                    </Button>

                    <div className="flex-1 truncate px-3 text-sm text-muted-foreground">
                      {imageName}
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        if (!["image/jpeg", "image/png"].includes(file.type)) {
                          alert("Only JPEG or PNG images are allowed")
                          e.target.value = ""
                          setImageName("No file chosen")
                          setImagePreview(null)
                          return
                        }

                        setImageName(file.name)
                        setImagePreview(URL.createObjectURL(file))
                      }}
                    />
                  </div>
                </div>

                {/* ✅ smaller preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <Label className="invisible">Preview</Label>
                    <div className="relative aspect-[4/3] max-h-56 w-full overflow-hidden rounded-md border bg-muted">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type here..."
                  className="resize-y"
                />
              </div>

              {/* ✅ Submit + Back buttons (bottom-right with spacing) */}
                <div className="pt-4 flex justify-end gap-3">
                  {showapproverejectbutton && (
                  <Button type="submit" onClick={() => navigate({ to: "/catalogue" })}>
                    Approve
                  </Button>)}
                  
                  {showapproverejectbutton && (
                  <Button type="submit" onClick={() => navigate({ to: "/catalogue" })}>
                    Reject
                  </Button>)}
                  
                   {showExtraButton && (
                  <Button type="submit" onClick={() => navigate({ to: "/catalogue" })}>
                    Submit
                  </Button>)}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: "/catalogue" })}
                  >
                    Back
                  </Button>
                </div>

            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
