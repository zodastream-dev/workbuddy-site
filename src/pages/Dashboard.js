import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const PRIORITY_CONFIG = {
  high:   { label: '高', color: 'text-red-600 bg-red-50 border-red-200' },
  medium: { label: '中', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  low:    { label: '低', color: 'text-green-600 bg-green-50 border-green-200' }
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('all') // all | active | done

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchTodos()
    // eslint-disable-next-line
  }, [user])

  const fetchTodos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setTodos(data || [])
    setLoading(false)
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    const { data, error } = await supabase.from('todos').insert([{
      user_id: user.id,
      title: newTitle.trim(),
      priority: newPriority,
      done: false
    }]).select()
    if (!error && data) {
      setTodos(prev => [data[0], ...prev])
      setNewTitle('')
    }
    setAdding(false)
  }

  const toggleDone = async (todo) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', todo.id)
      .select()
    if (!error && data) {
      setTodos(prev => prev.map(t => t.id === todo.id ? data[0] : t))
    }
  }

  const deleteTodo = async (id) => {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const doneCount = todos.filter(t => t.done).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部用户栏 */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              你好，{user?.user_metadata?.username || user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-sm text-slate-500">
              今日完成 {doneCount} / {totalCount} 项任务
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 进度条 */}
        {totalCount > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>今日进度</span>
              <span className="font-medium">{totalCount > 0 ? Math.round(doneCount/totalCount*100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (doneCount/totalCount*100) : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* 添加任务 */}
        <form onSubmit={addTodo} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">添加新任务</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="输入任务内容..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-sm"
            />
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
            >
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {adding ? '添加...' : '+ 添加'}
            </button>
          </div>
        </form>

        {/* 筛选标签 */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: `全部 (${totalCount})` },
            { key: 'active', label: `待完成 (${totalCount - doneCount})` },
            { key: 'done', label: `已完成 (${doneCount})` }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 任务列表 */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-slate-400">加载中...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">
                {filter === 'done' ? '还没有完成的任务' : '还没有任务，添加一个吧！'}
              </p>
            </div>
          ) : (
            filtered.map(todo => (
              <div
                key={todo.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-3 transition-all ${
                  todo.done ? 'border-slate-100 opacity-60' : 'border-slate-100 shadow-sm'
                }`}
              >
                {/* 完成勾选 */}
                <button
                  onClick={() => toggleDone(todo)}
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    todo.done
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-slate-300 hover:border-primary-400'
                  }`}
                >
                  {todo.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* 任务内容 */}
                <span className={`flex-1 text-sm ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {todo.title}
                </span>

                {/* 优先级 */}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_CONFIG[todo.priority]?.color}`}>
                  {PRIORITY_CONFIG[todo.priority]?.label}
                </span>

                {/* 删除按钮 */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
