## Setup

- npx create-next-app@latest --ts --use-npm photo-sharing-app
- code ./photo-sharing-app
- npm install @supabase/supabase-js
- npm install @supabase/auth-helpers-react @supabase/auth-helpers-nextjs
- npm install @supabase/auth-ui-react
- npm i supabase@latest --save-dev
- npx supabase login
- add this in package.json as db script:
  - npx supabase gen types typescript --project-id "drscirjcwhmelzrhkwfr" --schema public > utils/database.ts 
- npm i @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled framer-motion
- Create .env.local and populate with Supabase credentials

From vercel:

- Populate environment variables and deploy.

From supabase:

- change Authentication > URL Configuration
  - use Vercel for site url and redirect urls

## Run in Local

- npm install
  - run this once, if you haven't
- npm run dev
- open http://localhost:3000

## TODO

- Implement photo page.
  - Allow comment
- Deploy (don't forget env var)
- Check flow new user
- Check flow new user viewing existing user
- Improve styling
- Delete Photo
  - also delete from storage
- Delete Comment
- Edit Comment