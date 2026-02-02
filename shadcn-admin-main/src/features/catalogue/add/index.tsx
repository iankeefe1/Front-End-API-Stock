import { useEffect, useRef, useState } from "react"
import { API_BASE_URL, IMG_API_BASE_URL} from "@/config/api"
import { useNavigate, useSearch ,useRouter } from '@tanstack/react-router'
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
import { CounterpartyDropdown } from "@/components/CounterpartyDropdown"
import { useAuthStore } from '@/stores/auth-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useToast } from "@/components/ui/use-toast"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
// const counterpartyOptions = [
//   { value: "all", label: "All Apps" },
//   { value: "connected", label: "Connected" },
//   { value: "notConnected", label: "Not Connected" },
// ]

export function CatalogueAdd() {

  // -------------------------
  // State
  const { auth } = useAuthStore()
  const [catalogueName, setCatalogueName] = useState("")
  const [catalogueCode, setcatalogueCode] = useState("")
  const [cataloguecategory, setcataloguecategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [mindate, setminDate] = useState<Date | undefined>(undefined)
  const [maxdate, setmaxDate] = useState<Date | undefined>(undefined)
  const [catalogueSpecification, setcatalogueSpecification] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageName, setImageName] = useState("No file chosen")
  const [catalogueprice, setCataloguePrice] = useState<number | "">("")
  const [cataloguecounterparty, setcataloguecounterparty] = useState("")
  const [catalogueUOM, setCatalogueUOM] = useState("")
  const [errors, setErrors] = useState<{ catalogueName?: string; catalogueCode?: string; cataloguecategory?: 
    string; date?: string; catalogueSpecification?: string; imageName?: string;
    catalogueprice?: string; cataloguecounterparty?: string; catalogueUOM?: string; mindate?: string; maxdate?: string;
   }>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmOpenApprove, setConfirmOpenApprove] = useState(false)
  const [confirmOpenReject, setConfirmOpenReject] = useState(false)
  const [submitComment, setSubmitComment] = useState("")
  const [commentError, setCommentError] = useState("")
  const [submitError] = useState("")
  const router = useRouter()
  //  const { toast } = useToast()
  // State
  // ------------------------------------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  // Route params
  const { productid, pagestate, approvalid } = useSearch({
    from: '/_authenticated/catalogue/add/',
  })
  // Route params
  // ------------------------------------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  // Condition
  const fileRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const showExtraButton = pagestate != "view" && pagestate != "approval"
  const showapproverejectbutton = pagestate === "approval"
  const isReadOnly = pagestate === 'view' || pagestate ==="approval"
  // const { toast } = useToast()
  const [successOpen, setSuccessOpen] = useState(false)
   const [successOpenApprove, setSuccessOpenApprove] = useState(false)
   const [successOpenReject, setSuccessOpenReject] = useState(false)
  // 👇 final condition
  const shouldDisable = isReadOnly && (!!productid || !!approvalid)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  // Condition
  // ------------------------------------------------------------------------------------------------------------------------------------------------------

  const user = auth.user

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  // Fetch product when VIEW
  useEffect(() => {
    if (!productid) return

    const fetchProduct = async () => {
        const res = await fetch(
          `${API_BASE_URL}/Product/GetProductById?productId=${productid}`
        )

        if (!res.ok) throw new Error("Failed to load product")

        const data = await res.json()

        setCatalogueName(data.productName ?? "")
        setcatalogueCode(data.productCode ?? "")
        setCataloguePrice(data.price ?? "")
        setcataloguecategory(String(data.mvProductCategory ?? ""))
        setcataloguecounterparty(String(data.counterpartyID ?? ""))
        setCatalogueUOM(String(data.mvUnitOfMeasure ?? ""))
        setcatalogueSpecification(data.specification ?? "")
        setDescription(data.description ?? "")

        if (data.listingDate) {
          setDate(new Date(data.listingDate))
        }

        if (data.mindate) {
          setminDate(new Date(data.mindate))
        }

        if (data.maxdate) {
          setmaxDate(new Date(data.maxdate))
        }

        if (data.imageUrl) {
          setImagePreview(`${IMG_API_BASE_URL}${data.imageUrl}`)
          setImageName("Existing image")
        }
    }

    fetchProduct()
  }, [productid])
  // Fetch product when VIEW
  // ------------------------------------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  // Fetch product when approval
  useEffect(() => {
    if (!approvalid) return

    const fetchProduct = async () => {
        const res = await fetch(
          `${API_BASE_URL}/Product/GetProductByApprovalId?approvalid=${approvalid}`
        )

        if (!res.ok) throw new Error("Failed to load product")

        const data = await res.json()

        setCatalogueName(data.productName ?? "")
        setcatalogueCode(data.productCode ?? "")
        setCataloguePrice(data.price ?? "")
        setcataloguecategory(String(data.mvProductCategory ?? ""))
        setcataloguecounterparty(String(data.counterpartyID ?? ""))
        setCatalogueUOM(String(data.mvUnitOfMeasure ?? ""))
        setcatalogueSpecification(data.specification ?? "")
        setDescription(data.description ?? "")

        if (data.listingDate) {
          setDate(new Date(data.listingDate))
        }

        if (data.mindate) {
          setminDate(new Date(data.mindate))
        }

        if (data.maxdate) {
          setmaxDate(new Date(data.maxdate))
        }

        if (data.imageUrl) {
          setImagePreview(`${IMG_API_BASE_URL}${data.imageUrl}`)
          setImageName("Existing image")
        }

        
    }

    fetchProduct()
  }, [approvalid])
  // Fetch product when VIEW
  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  
  const validateForm = () => {
  const newErrors: typeof errors = {}

  if (!catalogueName.trim())
    newErrors.catalogueName = "Product name is required"

  if (!catalogueCode.trim())
    newErrors.catalogueCode = "Product code is required"

  if (!cataloguecategory.trim())
    newErrors.cataloguecategory = "Catalogue category is required"

  if (!date)
    newErrors.date = "Listing Date is required"

  if (!mindate)
    newErrors.mindate = "Minimum Time Period is required"

  if (!maxdate)
    newErrors.maxdate = "Maximum Time Period is required"

  if (!catalogueSpecification.trim())
    newErrors.catalogueSpecification = "Product Specification is required"

  const file = fileRef.current?.files?.[0]
  if (!file)
    newErrors.imageName = "Product Image is required"

  if (!catalogueprice)
    newErrors.catalogueprice = "Product price is required"

  if (!cataloguecounterparty.trim())
    newErrors.cataloguecounterparty = "Product counterparty is required"

  if (!catalogueUOM.trim())
    newErrors.catalogueUOM = "Product UOM is required"

  setErrors(newErrors)

  // ✅ return validation result
  return Object.keys(newErrors).length === 0
  }

  type ValidationValue =
  | string
  | number
  | ""
  | Date
  | undefined
  | null
  | File
  // Validation
 const validateField = (
  field: keyof typeof errors,
  value: ValidationValue
) => {
  let message = ""

  switch (field) {
    case "catalogueName":
      if (typeof value === "string" && !value.trim())
        message = "Product name is required"
      break

    case "catalogueCode":
      if (typeof value === "string" && !value.trim())
        message = "Product code is required"
      break

    case "catalogueprice":
      if (value === "" || value === null)
        message = "Product price is required"
      break

    case "cataloguecategory":
      if (typeof value === "string" && !value.trim())
        message = "Catalogue category is required"
      break

    case "catalogueSpecification":
      if (typeof value === "string" && !value.trim())
        message = "Product Specification is required"
      break

    case "cataloguecounterparty":
      if (typeof value === "string" && !value.trim())
        message = "Product counterparty is required"
      break

    case "catalogueUOM":
      if (typeof value === "string" && !value.trim())
        message = "Product UOM is required"
      break

    case "date":
      if (!value)
        message = "Listing Date is required"
      break
    
    case "mindate":
      if (!value)
        message = "Minimum Time Period is required"
      break

    case "maxdate":
      if (!value)
        message = "Maximum Time Period is required"
      break

    case "imageName":
      if (!value)
        message = "Product Image is required"
      break
  }

  setErrors((prev) => ({
    ...prev,
    [field]: message || undefined,
  }))
}


  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  // Button Clicked
  const handleSubmit = async () => {
  // if (!fileRef.current?.files?.[0]) {
  //   toast({
  //     title: "Image Required",
  //     description: "Please select an image before submitting.",
  //     variant: "destructive",
  //   })

  const newErrors: typeof errors = {}
  if (!catalogueName.trim()) newErrors.catalogueName = "Product name is required"
  if (!catalogueCode.trim()) newErrors.catalogueCode = "Product code is required"
  if (!cataloguecategory.trim()) newErrors.cataloguecategory = "Catalogue category is required"
  if (!date) newErrors.date = "Listing Date is required"
  if (!mindate) newErrors.mindate = "Minimum Time Period is required"
  if (!maxdate) newErrors.maxdate = "Maximum Time Period is required"
  if (!catalogueSpecification.trim()) newErrors.catalogueSpecification = "Product Specification is required"
  const file = fileRef.current?.files?.[0]  
  if (!file) {
  newErrors.imageName = "Product Image is required"
  }
  // if (fileRef.current.files[0] == null) newErrors.imageName = "Product Image is required"
  if (!catalogueprice) newErrors.catalogueprice = "Product price is required"
  if (!cataloguecounterparty.trim()) newErrors.cataloguecounterparty = "Product counterparty is required"
  if (!catalogueUOM.trim()) newErrors.catalogueUOM = "Product UOM is required"

  setErrors(newErrors)

  if (Object.keys(newErrors).length === 0) {
    const formData = new FormData()

    formData.append("ProductName", catalogueName)
    formData.append("ProductCode", catalogueCode)
    formData.append("MVProductCategory", cataloguecategory)
    formData.append("Price", catalogueprice.toString())
    formData.append("CounterpartyID", cataloguecounterparty)
    // formData.append("ListingDate", date ? date.toISOString() : "")
    formData.append("Specification", catalogueSpecification)
    formData.append("Description", description)
    formData.append("MVUnitOfMeasure", catalogueUOM)
    formData.append("Comment", submitComment)
    if (file) {
      formData.append("Image", file) // ✅ safe
    }
    

    if (date) {
    const yyyyMMdd = date.toISOString().split("T")[0]

    // // eslint-disable-next-line no-console
    // console.log("ListingDate = ", yyyyMMdd);

    formData.append("ListingDate", yyyyMMdd)
    }

    if (mindate) {
    const yyyyMMddmin = mindate.toISOString().split("T")[0]

    // // eslint-disable-next-line no-console
    // console.log("ListingDate = ", yyyyMMdd);

    formData.append("EffectiveDate", yyyyMMddmin)
    } 

    if (maxdate) {
    const yyyyMMddmax = maxdate.toISOString().split("T")[0]

    // // eslint-disable-next-line no-console
    // console.log("ListingDate = ", yyyyMMdd);

    formData.append("ExpiredDate", yyyyMMddmax)
    } 
    // console.log("Image = ", fileRef.current.files[0]);

    // fetch("https://localhost:7209/Product/Ping", { method: "POST" });
    



    const response = await fetch(
      `${API_BASE_URL}/Product/SubmitProducts?userId=${user?.userID}`,
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      setErrorMessage(
        errorData?.message || "Something went wrong"
      )
      setErrorOpen(true)
      return
    }
    else
    {
      setSuccessOpen(true)
    }  
}
}

const handleApprove = async () => {
  // if (!fileRef.current?.files?.[0]) {
  //   toast({
  //     title: "Image Required",
  //     description: "Please select an image before submitting.",
  //     variant: "destructive",
  //   })

  const newErrors: typeof errors = {}

  setErrors(newErrors)

  if(approvalid && user)
  {
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData()

      formData.append("ApprovalID", approvalid.toString())
      formData.append("Userid", user.userID.toString())
      formData.append("Comment", submitComment)

      const response = await fetch(
        `${API_BASE_URL}/Product/ApproveProducts`,
        {
          method: "PUT",
          body: formData
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        setErrorMessage(
          errorData?.message || "Something went wrong"
        )
        setErrorOpen(true)
        return
      }
      else
      {
        setSuccessOpenApprove(true)
      }  
    }
  }
}

const handleReject = async () => {
  // if (!fileRef.current?.files?.[0]) {
  //   toast({
  //     title: "Image Required",
  //     description: "Please select an image before submitting.",
  //     variant: "destructive",
  //   })

  const newErrors: typeof errors = {}

  setErrors(newErrors)

  if(approvalid && user)
  {
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData()

      formData.append("ApprovalID", approvalid.toString())
      formData.append("Userid", user.userID.toString())
      formData.append("Comment", submitComment)

      const response = await fetch(
        `${API_BASE_URL}/Product/RejectProducts`,
        {
          method: "PUT",
          body: formData
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        setErrorMessage(
          errorData?.message || "Something went wrong"
        )
        setErrorOpen(true)
        return
      }
      else
      {
        setSuccessOpenReject(true)
      }  
    }
  }
}
  // Button Clicked
  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      {/* BODY*/}
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
          
          {/* {Object.entries(errors).map(([field, message]) => (
          <p key={field} className="text-red-500 text-sm">
            {message}
          </p> ))} */}

          <Card className="max-w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                Catalogue Information
              </CardTitle>
            </CardHeader>
            {submitError && (
              <p className="text-sm text-red-600 mt-2">{submitError}</p>
            )}

            <CardContent className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={catalogueName}
                    onChange={(e) => {
                      const value = e.target.value
                      setCatalogueName(value)
                      validateField("catalogueName", value)
                    }}
                    placeholder="Type here..."
                    readOnly={shouldDisable}
                  />
                  {errors.catalogueName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.catalogueName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Product Code</Label>
                  <Input
                    value={catalogueCode}
                    onChange={(e) => {
                      const value = e.target.value
                      setcatalogueCode(value)
                      validateField("catalogueCode", value)
                    }}
                    placeholder="Type here..."
                    readOnly={shouldDisable}
                  />
                  {errors.catalogueCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.catalogueCode}
                    </p>
                  )}
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
                        const value = e.target.value === "" ? "" : Number(e.target.value)
                        setCataloguePrice(value)
                        validateField("catalogueprice", value)
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      readOnly={shouldDisable}
                    />
                    {errors.catalogueprice && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.catalogueprice}
                    </p>
                  )}
                  </div>

                 {/* 🔽 ONLY THIS PART CHANGED */}
                <div className="space-y-2">
                  <Label>Product Counterparty</Label>

                 <CounterpartyDropdown
                    apiUrl={`${API_BASE_URL}/CounterParty/GetCounterpartyValuesActive`}
                    value={cataloguecounterparty}
                    onChange={(value) => {
                      setcataloguecounterparty(value)
                      validateField("cataloguecounterparty", value)
                    }}
                    readOnly={shouldDisable}
                  />
                  {errors.cataloguecounterparty && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.cataloguecounterparty}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                   <Label>Product Category</Label>

                  <MasterValueApiDropdown
                    apiUrl={`${API_BASE_URL}/MasterValue/GetMasterValueProductCategory`}
                    placeholder="Select Product Category"
                    value={cataloguecategory}
                    onValueChange={(value) => {
                      setcataloguecategory(value)
                      validateField("cataloguecategory", value)
                    }}
                    readOnly={shouldDisable}
                  />
                  {errors.cataloguecategory && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.cataloguecategory}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Product Listing Date</Label>
                  <DatePicker
                    selected={date}
                    onSelect={(value) => {
                      setDate(value)
                      validateField("date", value)
                    }}
                    className="w-full h-10 justify-start"
                    readOnly={shouldDisable}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                   <Label>Effective Date</Label>
                  <DatePicker
                    selected={mindate}
                    onSelect={(value) => {
                      setminDate(value)
                      validateField("mindate", value)
                    }}
                    className="w-full h-10 justify-start"
                    readOnly={shouldDisable}
                  />
                  {errors.mindate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.mindate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Expired Date</Label>
                  <DatePicker
                    selected={maxdate}
                    onSelect={(value) => {
                      setmaxDate(value)
                      validateField("maxdate", value)
                    }}
                    className="w-full h-10 justify-start"
                    readOnly={shouldDisable}
                  />
                  {errors.maxdate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.maxdate}
                    </p>
                  )}
                </div>
              </div> 

              <div className="space-y-2">
                <Label>Unit Of Measurement</Label>

                 <MasterValueApiDropdown
                  apiUrl={`${API_BASE_URL}/MasterValue/GetMasterValueUOM`}
                  placeholder="Select Unit Of Measurement"
                  value={catalogueUOM}
                  onValueChange={(value) => {
                      setCatalogueUOM(value)
                      validateField("catalogueUOM", value)
                    }}
                  readOnly={shouldDisable}
                />
                {errors.catalogueUOM && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.catalogueUOM}
                    </p>
                  )}
              </div>

              {/* Specification */}
              <div className="space-y-2">
                <Label>Product Specification</Label>
                <Textarea
                  value={catalogueSpecification}
                  onChange={(e) => {
                      const value = e.target.value
                      setcatalogueSpecification(value)
                      validateField("catalogueSpecification", value)
                    }}
                  placeholder="Type here..."
                  className="resize-y"
                  readOnly={shouldDisable}
                />
                {errors.catalogueSpecification && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.catalogueSpecification}
                    </p>
                  )}
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
                      disabled={shouldDisable}
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
                      readOnly={shouldDisable}
                    />
                    
                  </div>
                  {errors.imageName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.imageName}
                    </p>
                  )}
                </div>               
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
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
                </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type here..."
                  className="resize-y"
                  readOnly={shouldDisable}
                />
              </div>

              {/* ✅ Submit + Back buttons (bottom-right with spacing) */}
                <div className="pt-4 flex justify-end gap-3">
                  {showapproverejectbutton  && (
                 <Button
                  type="button"
                  onClick={() => {
                    setCommentError("")


                    setConfirmOpenApprove(true) // ✅ open popup only if valid
                  }}
                >
                  Approve
                </Button>)}
                  
                   {showapproverejectbutton  && (
                 <Button
                  type="button"
                  onClick={() => {
                    setCommentError("")


                    setConfirmOpenReject(true) // ✅ open popup only if valid
                  }}
                >
                  Reject
                </Button>)}
                
                  
                   {showExtraButton  && (
                 <Button
                  type="button"
                  onClick={() => {
                    setCommentError("")

                    const isValid = validateForm()

                    if (!isValid) return // ❌ stop here, show errors

                    setConfirmOpen(true) // ✅ open popup only if valid
                  }}
                >
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
        {/* BODY*/}

        {/* POP UP SUBMIT COMMENT*/}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit? Please add a comment first!
            </DialogDescription>
          </DialogHeader>

          {/* Comment textbox */}
          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              placeholder="Add your comment here..."
              value={submitComment}
              onChange={(e) => {
                setSubmitComment(e.target.value)
                setCommentError("")
              }}
            />
            {commentError && (
              <p className="text-sm text-red-500">{commentError}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (!submitComment.trim()) {
                  setCommentError("Comment is required")
                  return
                }
                setConfirmOpen(false)
                handleSubmit()
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* POP UP APPROVE COMMENT*/}
      <Dialog open={confirmOpenApprove} onOpenChange={setConfirmOpenApprove}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to Approve? Please add a comment first!
            </DialogDescription>
          </DialogHeader>          
          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              placeholder="Add your comment here..."
              value={submitComment}
              onChange={(e) => {
                setSubmitComment(e.target.value)
                setCommentError("")
              }}
            />
            {commentError && (
              <p className="text-sm text-red-500">{commentError}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpenApprove(false)}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (!submitComment.trim()) {
                  setCommentError("Comment is required")
                  return
                }
                setConfirmOpenApprove(false)
                handleApprove()
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* POP UP REJECT COMMENT*/}
      <Dialog open={confirmOpenReject} onOpenChange={setConfirmOpenReject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to Reject? Please add a comment first!
            </DialogDescription>
          </DialogHeader>          
          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              placeholder="Add your comment here..."
              value={submitComment}
              onChange={(e) => {
                setSubmitComment(e.target.value)
                setCommentError("")
              }}
            />
            {commentError && (
              <p className="text-sm text-red-500">{commentError}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpenReject(false)}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (!submitComment.trim()) {
                  setCommentError("Comment is required")
                  return
                }
                setConfirmOpenReject(false)
                handleReject()
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* POP UP SUBMIT COMPLETE */}
      <Dialog
        open={successOpen}
        onOpenChange={(open) => {
          setSuccessOpen(open)
          if (!open) navigate({ to: "/catalogue" })
        }}
      >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✅ Submission Successful
          </DialogTitle>
          <DialogDescription>
            Your catalogue has been successfully submitted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => {
              setSuccessOpen(false)
              navigate({ to: "/catalogue" })
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* POP UP APPROVE COMPLETE */}
    <Dialog
    open={successOpenApprove}
    onOpenChange={(open) => {
      setSuccessOpenApprove(open)
      if (!open) {
        router.history.back()
      }
    }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✅ Approve Successful
          </DialogTitle>
          <DialogDescription>
            Your catalogue has been successfully approved.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => {
              setSuccessOpenApprove(false)
              router.history.back()
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* POP UP REJECT COMPLETE */}
    <Dialog
    open={successOpenReject}
    onOpenChange={(open) => {
      setSuccessOpenReject(open)
      if (!open) {
        router.history.back()
      }
    }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✅ Reject Successful
          </DialogTitle>
          <DialogDescription>
            Your catalogue has been successfully rejected.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => {
              setSuccessOpenReject(false)
              router.history.back()
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* POP UP FAILED */}
    <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            ❌ Submission Failed
          </DialogTitle>
          <DialogDescription>
            {errorMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => setErrorOpen(false)}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </Main>
    </>
  )
}
