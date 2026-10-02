export type MerchantType = {
  merchant_id: string
  default_category_id: string | null
  name: string
  deleted_at: string | null
}

export type CreateMerchantType = {
  default_category_id?: string | null
  name: string
}
