import { bidderDocumentsTemplate } from '../../data/mock'

/** Documents for the signed-in bidder on a tender. Only tender 1048 carries demo progress. */
export function docsFor(tenderId, state) {
  if (tenderId === '1048') return state.bidderDocs
  return bidderDocumentsTemplate.map((d) => ({ ...d, status: 'Not uploaded', file: undefined }))
}

const AUTO = {
  'REQ-008': 'Signed at submission',
  'REQ-009': 'Fetched from source',
  'REQ-010': 'Optional',
}

export function requirementStatus(req, docs) {
  const doc = docs.find((d) => d.reqId === req.id)
  if (doc) return doc.status
  return AUTO[req.id] || 'Not started'
}

export function docSummary(docs) {
  const mandatory = docs.filter((d) => d.mandatory)
  const uploaded = docs.filter((d) => !['Not uploaded', 'Missing'].includes(d.status))
  const mandatoryUploaded = mandatory.filter((d) => !['Not uploaded', 'Missing'].includes(d.status))
  const satisfied = docs.filter((d) => ['Verified', 'Uploaded'].includes(d.status))
  return {
    total: docs.length,
    uploaded: uploaded.length,
    mandatoryTotal: mandatory.length,
    mandatoryUploaded: mandatoryUploaded.length,
    satisfied: satisfied.length,
    attention: docs.filter((d) => ['Under Review', 'Missing', 'Not uploaded'].includes(d.status)),
    ready: mandatoryUploaded.length === mandatory.length,
  }
}
