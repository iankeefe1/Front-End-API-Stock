import { useRef, useState } from "react"
import Swal from 'sweetalert2'
import { useNavigate } from '@tanstack/react-router'
import { Separator } from "@/components/ui/separator"
import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { ThemeSwitch } from "@/components/theme-switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MasterValueApiDropdown } from "@/components/MasterValueApiDropdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

const counterpartyOptions = [
  { value: "all", label: "All Apps" },
  { value: "connected", label: "Connected" },
  { value: "notConnected", label: "Not Connected" },
]

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
  const [counterpartyOpen, setCounterpartyOpen] = useState(false)
  const [catalogueUOM, setCatalogueUOM] = useState("")

  // const [uomOptions, setUomOptions] = useState([]);
  // const [selectedUom, setSelectedUom] = useState("");
  // const [UOMopen, setUOM] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const showExtraButton = catalogueName.trim() !== "" && imagePreview !== null
  const showapproverejectbutton = catalogueName.trim() == ""



  const handleSubmit = async () => {
  if (!fileRef.current?.files?.[0]) {
    alert("Please select an image")
    return
  }

  const formData = new FormData()

  formData.append("ProductName", catalogueName)
  formData.append("ProductCode", catalogueCode)
  formData.append("MVProductCategory", cataloguecategory)
  formData.append("Price", catalogueprice.toString())
  formData.append("CounterpartyID", "1")
  // formData.append("ListingDate", date ? date.toISOString() : "")
  formData.append("Specification", catalogueSpecification)
  formData.append("Description", description)
  formData.append("MVUnitOfMeasure", catalogueUOM)
  formData.append("Image", fileRef.current.files[0])

  if (date) {
  const yyyyMMdd = date.toISOString().split("T")[0]

  // eslint-disable-next-line no-console
  console.log("ListingDate = ", yyyyMMdd);

  formData.append("ListingDate", yyyyMMdd)
}

  // eslint-disable-next-line no-console
  console.log("Image = ", fileRef.current.files[0]);

  // fetch("https://localhost:7209/Product/Ping", { method: "POST" });

  const response = await fetch(
    "https://localhost:7209/Product/SubmitProducts",
    {
      method: "POST",
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error("Failed to save catalogue")
  }

  Swal.fire({
  title: "Drag me!",
  icon: "success",
  draggable: true
});

  navigate({ to: "/catalogue" })
}



  return (
    <>
      <Header>
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

                 {/* 🔽 ONLY THIS PART CHANGED */}
                <div className="space-y-2">
                  <Label>Product Counterparty</Label>

                  <Popover
                    open={counterpartyOpen}
                    onOpenChange={setCounterpartyOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {cataloguecounterparty
                          ? counterpartyOptions.find(
                              (o) => o.value === cataloguecounterparty
                            )?.label
                          : "Select Counterparty"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search counterparty..." />
                        <CommandEmpty>No result found.</CommandEmpty>
                        <CommandGroup>
                          {counterpartyOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                setcataloguecounterparty(option.value)
                                setCounterpartyOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  cataloguecounterparty === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                   <Label>Product Category</Label>

                  <MasterValueApiDropdown
                    apiUrl="https://localhost:7209/MasterValue/GetMasterValueProductCategory"
                    placeholder="Select Product Category"
                    value={cataloguecategory}
                    onValueChange={setcataloguecategory}
                  />
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
              <div className="space-y-2">
                <Label>Unit Of Measurement</Label>

                 <MasterValueApiDropdown
                  apiUrl="https://localhost:7209/MasterValue/GetMasterValueUOM"
                  placeholder="Select Unit Of Measurement"
                  value={catalogueUOM}
                  onValueChange={setCatalogueUOM}
                />
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
                  <Button type="submit" onClick={() => window.history.back()}>
                    Approve
                  </Button>)}
                  
                  {showapproverejectbutton && (
                  <Button type="submit" onClick={() => window.history.back()}>
                    Reject
                  </Button>)}
                  
                   {showExtraButton && (
                 <Button type="button" onClick={handleSubmit}>
                    Submit
                  </Button>)}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
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
