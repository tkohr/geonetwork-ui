export interface SearchFilters {
  any?: string
  [x: string]: any
}

export interface StateConfigFilters {
  custom?: SearchFilters
  elastic?: any
}

export interface MetadataContact {
  name: string
  email: string
  website?: string
  logoUrl?: string
  address?: string
  phone?: string
}

export interface MetadataRecord {
  id: string
  uuid: string
  title: string
  metadataUrl: string
  abstract?: string
  thumbnailUrl?: string
  hasDownloads?: boolean
  hasMaps?: boolean
  updateStatus?: string
  updateFrequency?: string
  links?: MetadataLink[]
  updatedOn?: Date
  createdOn?: Date
  dataUpdatedOn?: Date
  dataCreatedOn?: Date
  lineage?: string
  keywords?: string[]
  contact?: MetadataContact
  catalog?: string
  usageConstraints?: string
}

export interface MetadataLinkValid {
  url: string
  // either a file name, a layer name or any other resource identifier
  name?: string
  protocol?: string
  format?: string
  description?: string
}
export type MetadataLink = MetadataLinkValid | { invalid: true; reason: string }

export interface RecordMetric {
  value: string
  recordCount: number
}

export const RESULTS_PAGE_SIZE = 10
