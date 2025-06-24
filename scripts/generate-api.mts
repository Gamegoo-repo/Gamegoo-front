import 'dotenv/config'
import { ApiGenerationOrchestrator } from './lib/orchestrator'

const orchestrator = new ApiGenerationOrchestrator({
  serverCheck: true,
  forceDownload: false,
  keepTempFiles: false
})

orchestrator.run()
