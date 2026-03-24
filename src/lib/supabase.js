import { createClient } from '@supabase/supabase-js'

// 本地开发时在项目根目录创建 .env.local 文件：
//   REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
//   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
//
// 部署到 GitHub Pages 时在仓库 Settings → Secrets 里配置相同的两个变量

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://rvrwmiyrovhftkcwbnkg.supabase.co'
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_iizhCM-0JOdnmIoY1chdbA_IxzOLBhi'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
