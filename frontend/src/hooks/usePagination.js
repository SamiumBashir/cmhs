import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const usePagination = (url, initialPage = 1, limit = 20, dependencies = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)

  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true)
    try {
      const response = await api.get(`${url}?page=${pageNum}&limit=${limit}`)
      setData(response.data.data || [])
      setTotal(response.data.pagination?.total || 0)
      setPage(pageNum)
    } catch (error) {
      console.error('Pagination fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [url, limit])

  useEffect(() => {
    fetchPage(initialPage)
  }, [fetchPage, initialPage, ...dependencies])

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    loading,
    page,
    total,
    totalPages,
    setPage,
    fetchPage,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

export default usePagination
