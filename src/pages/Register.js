import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) return setError('请输入用户名')
    if (password.length < 6) return setError('密码至少6位')
    if (password !== confirm) return setError('两次输入的密码不一致')

    setLoading(true)
    const { error: err } = await signUp(email, password, username)
    setLoading(false)

    if (err) {
      if (err.message.includes('already registered')) {
        setError('该邮箱已注册，请直接登录')
      } else {
        setError(err.message)
      }
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">注册成功！</h2>
          <p className="text-slate-500 mb-6">
            我们已发送确认邮件到 <strong>{email}</strong>，请查收并点击确认链接后登录。
          </p>
          <Link
            to="/login"
            className="inline-block w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            去登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">创建账号</h1>
          <p className="text-slate-500 text-sm mt-1">加入 WorkBuddy，开始管理你的任务</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="你的昵称"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱地址</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="至少6位"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">确认密码</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="再次输入密码"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                注册中...
              </span>
            ) : '创建账号'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          已有账号？{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
