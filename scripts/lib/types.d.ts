export interface SwaggerSchema {
  openapi: string
  info: any
  paths: Record<string, any>
  components?: {
    securitySchemes?: Record<string, any>
    schemas?: Record<string, any>
  }
  security?: Array<Record<string, any>>
}

export interface GenerationOptions {
  serverCheck?: boolean
  forceDownload?: boolean
  keepTempFiles?: boolean
  generateServices?: boolean
}
