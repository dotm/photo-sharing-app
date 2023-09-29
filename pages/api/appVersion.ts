// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export type AppVersionResponseData = {
  version: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AppVersionResponseData>
) {
  res.status(200).json({ version: process.env.VERCEL_GIT_COMMIT_SHA ?? "N/A" })
}
