import { FiCreditCard, FiCalendar, FiFileText, FiDownload } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const feeRecords = [
  { id: 1, term: 'Term 1', dueDate: '2024-01-15', amount: 2500, paid: 2500, status: 'paid', receipt: true },
  { id: 2, term: 'Term 2', dueDate: '2024-04-15', amount: 2500, paid: 2500, status: 'paid', receipt: true },
  { id: 3, term: 'Term 3', dueDate: '2024-07-15', amount: 2500, paid: 1500, status: 'partial', receipt: false },
  { id: 4, term: 'Term 4', dueDate: '2024-10-15', amount: 2500, paid: 0, status: 'pending', receipt: false }
]

const StudentFees = () => {
  const statusColors = {
    paid: 'success',
    partial: 'warning',
    pending: 'info',
    overdue: 'danger'
  }

  const totalAmount = feeRecords.reduce((sum, f) => sum + f.amount, 0)
  const totalPaid = feeRecords.reduce((sum, f) => sum + f.paid, 0)
  const totalDue = totalAmount - totalPaid

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Fees</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-primary">{feeRecords.filter(f => f.status === 'paid').length}</div>
          <p className="text-sm text-gray-500 mt-1">Paid Terms</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-red-600">{feeRecords.filter(f => f.status !== 'paid').length}</div>
          <p className="text-sm text-gray-500 mt-1">Due Terms</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-2xl font-bold text-accent">৳{totalDue.toLocaleString()}</div>
          <p className="text-sm text-gray-500 mt-1">Total Due</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Term</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Paid</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((fee) => (
                <tr key={fee.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">{fee.term}</td>
                  <td className="px-6 py-4 text-sm">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">৳{fee.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">৳{fee.paid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={statusColors[fee.status]} size="sm">
                      {fee.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {fee.receipt ? (
                      <button className="text-primary hover:text-primary/80">
                        <FiDownload size={18} />
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td colSpan="2" className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-right">৳{totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">৳{totalPaid.toLocaleString()}</td>
                <td colSpan="2" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default StudentFees


