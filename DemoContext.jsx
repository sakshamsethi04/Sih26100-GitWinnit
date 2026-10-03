import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  apexEvidence,
  auditLog,
  bidderDocumentsTemplate,
  bids as seedBids,
  recentActivity,
  requirementTemplate,
  tenders as seedTenders,
} from '../data/mock'
import { nowStamp } from '../utils/format'

const STORAGE_KEY = 'bid-sahayak-demo-v1'

function initialState() {
  return {
    signedIn: { officer: false, bidder: false },
    tenders: seedTenders,
    requirements: {},                 // tenderId -> requirement list (lazy copy of template)
    confirmed: { 1048: true, '0981': true, '0873': true, 1102: true, 1067: true, '0995': true, '0912': true },
    bidOverrides: {},                 // bidId -> { status, decision, comment, decidedAt }
    reqOverrides: {},                 // bidId -> { reqId: status }
    clarifications: {},               // bidId -> [{ reqId, message, at }]
    bidderDocs: bidderDocumentsTemplate,
    bidSubmission: null,              // { bidId, at }
    audit: auditLog,
    activity: recentActivity,
  }
}

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState(), ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return initialState()
}

function logEntry(state, { user, name, action, entity, status, tone = 'info' }) {
  const ts = nowStamp()
  return {
    audit: [{ ts, user, name, action, entity, status }, ...state.audit],
    activity: [{ time: ts.slice(-5), date: ts.slice(0, 11), text: `${action} · ${entity}`, actor: name, tone }, ...state.activity].slice(0, 12),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'signIn':
      return { ...state, signedIn: { ...state.signedIn, [action.role]: true } }
    case 'signOut':
      return { ...state, signedIn: { ...state.signedIn, [action.role]: false } }

    case 'upsertTender': {
      const exists = state.tenders.some((t) => t.id === action.tender.id)
      const tenders = exists
        ? state.tenders.map((t) => (t.id === action.tender.id ? { ...t, ...action.tender } : t))
        : [action.tender, ...state.tenders]
      return {
        ...state,
        tenders,
        requirements: { ...state.requirements, [action.tender.id]: requirementTemplate.map((r) => ({ ...r, status: 'Extracted' })) },
        confirmed: { ...state.confirmed, [action.tender.id]: false },
        ...logEntry(state, { user: 'Bid Sahayak Engine', name: 'System', action: 'Extracted 10 requirements from tender document', entity: action.tender.ref, status: 'Completed' }),
      }
    }

    case 'updateRequirement': {
      const list = (state.requirements[action.tenderId] || requirementTemplate).map((r) =>
        r.id === action.req.id ? { ...r, ...action.req } : r,
      )
      return { ...state, requirements: { ...state.requirements, [action.tenderId]: list } }
    }

    case 'confirmRequirements': {
      const tender = state.tenders.find((t) => t.id === action.tenderId)
      const list = (state.requirements[action.tenderId] || requirementTemplate).map((r) => ({
        ...r,
        status: r.category === 'Not Applicable' ? 'Not Applicable' : 'Confirmed',
      }))
      return {
        ...state,
        requirements: { ...state.requirements, [action.tenderId]: list },
        confirmed: { ...state.confirmed, [action.tenderId]: true },
        tenders: state.tenders.map((t) =>
          t.id === action.tenderId && t.status === 'Draft' ? { ...t, status: 'Open for Bids', compliance: 'Awaiting bids' } : t,
        ),
        ...logEntry(state, {
          user: 'Procurement Officer', name: 'A. K. Verma', action: `Confirmed tender requirements (${list.length})`,
          entity: tender?.ref || action.tenderId, status: 'Completed', tone: 'ok',
        }),
      }
    }

    case 'requestClarification': {
      const { bidId, reqId, message } = action
      return {
        ...state,
        bidOverrides: { ...state.bidOverrides, [bidId]: { ...state.bidOverrides[bidId], status: 'Clarification Requested' } },
        reqOverrides: reqId
          ? { ...state.reqOverrides, [bidId]: { ...state.reqOverrides[bidId], [reqId]: 'Clarification Requested' } }
          : state.reqOverrides,
        clarifications: {
          ...state.clarifications,
          [bidId]: [...(state.clarifications[bidId] || []), { reqId, message, at: nowStamp() }],
        },
        ...logEntry(state, {
          user: 'Procurement Officer', name: 'A. K. Verma',
          action: `Requested clarification${reqId ? ` on ${reqId}` : ''}`, entity: bidId, status: 'Pending', tone: 'warn',
        }),
      }
    }

    case 'decide': {
      const { bidId, decision, comment } = action
      const status = { approve: 'Compliant', clarify: 'Clarification Requested', reject: 'Non-Compliant' }[decision]
      const verb = { approve: 'Approved compliance', clarify: 'Requested clarification', reject: 'Marked as non-compliant' }[decision]
      return {
        ...state,
        bidOverrides: { ...state.bidOverrides, [bidId]: { status, decision, comment, decidedAt: nowStamp() } },
        ...logEntry(state, {
          user: 'Procurement Officer', name: 'A. K. Verma', action: verb, entity: bidId,
          status: decision === 'approve' ? 'Approved' : decision === 'reject' ? 'Rejected' : 'Pending',
          tone: decision === 'approve' ? 'ok' : decision === 'reject' ? 'fail' : 'warn',
        }),
      }
    }

    case 'logReview':
      return { ...state, ...logEntry(state, action.entry) }

    case 'uploadBidderDoc': {
      const docs = state.bidderDocs.map((d) =>
        d.key === action.key ? { ...d, status: 'Verified', file: action.file, uploadedAt: nowStamp() } : d,
      )
      return {
        ...state,
        bidderDocs: docs,
        ...logEntry(state, { user: 'Bidder', name: 'Apex Systems Pvt Ltd', action: `Uploaded ${action.name}`, entity: 'BID-2026-041', status: 'Uploaded' }),
      }
    }

    case 'submitBid':
      return {
        ...state,
        bidSubmission: { bidId: 'BID-2026-041', at: nowStamp() },
        ...logEntry(state, { user: 'Bidder', name: 'Apex Systems Pvt Ltd', action: 'Submitted bid', entity: 'BID-2026-041', status: 'Submitted', tone: 'ok' }),
      }

    case 'reset':
      return initialState()
    default:
      return state
  }
}

const DemoContext = createContext(null)

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const getTender = useCallback((id) => state.tenders.find((t) => t.id === id), [state.tenders])

  const getRequirements = useCallback(
    (tenderId) => state.requirements[tenderId] || requirementTemplate.map((r) => ({ ...r, status: 'Confirmed' })),
    [state.requirements],
  )

  const getBid = useCallback(
    (bidId) => {
      const base = seedBids.find((b) => b.id === bidId)
      if (!base) return null
      const override = state.bidOverrides[bidId] || {}
      const results = { ...base.results, ...(state.reqOverrides[bidId] || {}) }
      return { ...base, ...override, results, clarifications: state.clarifications[bidId] || [] }
    },
    [state.bidOverrides, state.reqOverrides, state.clarifications],
  )

  const getBids = useCallback(
    (tenderId) => seedBids.filter((b) => b.tenderId === tenderId).map((b) => getBid(b.id)),
    [getBid],
  )

  const value = useMemo(
    () => ({ state, dispatch, getTender, getRequirements, getBid, getBids }),
    [state, getTender, getRequirements, getBid, getBids],
  )
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider')
  return ctx
}

// ---------------------------------------------------------------------------
// Assessment helpers
// ---------------------------------------------------------------------------
export function summarise(bid, requirements = requirementTemplate) {
  const rows = requirements.map((r) => ({
    ...r,
    result: r.category === 'Not Applicable' ? 'Not Applicable' : bid.results[r.id] || 'Not Applicable',
  }))
  const counted = rows.filter((r) => r.result !== 'Not Applicable')
  const mandatory = counted.filter((r) => r.category === 'Mandatory')
  const optional = counted.filter((r) => r.category !== 'Mandatory')
  const isOk = (r) => r.result === 'Satisfied'
  const isReview = (r) => r.result === 'Review Required' || r.result === 'Clarification Requested'
  return {
    rows,
    total: counted.length,
    satisfied: counted.filter(isOk).length,
    review: counted.filter(isReview).length,
    failed: counted.filter((r) => r.result === 'Not Satisfied').length,
    mandatory: { total: mandatory.length, satisfied: mandatory.filter(isOk).length },
    optional: { total: optional.length, satisfied: optional.filter(isOk).length },
  }
}

export function evidenceFor(bid, req) {
  if (bid.id === 'BID-2026-041' && apexEvidence[req.id]) return apexEvidence[req.id]
  const result = bid.results[req.id]
  const slug = req.evidence.split('/')[0].trim().replace(/\s+/g, '_')
  const findings = {
    Satisfied: `Submitted evidence meets the requirement: ${req.criterion}`,
    'Not Satisfied': `Submitted evidence does not meet the requirement, or the document was not provided.`,
    'Review Required': `Evidence is present but could not be matched with confidence. Officer review recommended.`,
    'Clarification Requested': 'Clarification requested from the bidder. Awaiting response.',
    'Not Applicable': 'Requirement not applicable to this bidder.',
  }
  return {
    documents: result === 'Not Satisfied' && req.id === 'REQ-005' ? [] : [`${slug}.pdf`],
    extracted: [['Bidder', bid.bidder], ['GSTIN', bid.gstin]],
    checks: [[req.source, result === 'Satisfied' ? 'Consistent' : result, result === 'Satisfied' ? 'ok' : result === 'Not Satisfied' ? 'fail' : 'warn']],
    finding: findings[result] || findings.Satisfied,
    source: req.source,
    checkedAt: '03 Oct 2026, 15:20',
    page: 'p. 1',
  }
}
