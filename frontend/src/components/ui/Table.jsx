import { motion } from 'framer-motion'

const Table = ({
  columns = [],
  data = [],
  loading = false,
  striped = false,
  hover = true,
  actions
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                  col.align === 'center' ? 'text-center' : ''
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.05 }}
              className={`border-b border-gray-100 ${hover ? 'hover:bg-gray-50 transition-colors' : ''} ${
                striped && rowIndex % 2 === 1 ? 'bg-gray-50/50' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                  col.align === 'center' ? 'text-center' : ''
                }`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {actions(row)}
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table


