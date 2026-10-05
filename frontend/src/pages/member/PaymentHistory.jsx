import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { 
  FiDollarSign, FiCalendar, FiCreditCard, FiCheckCircle, 
  FiDownload, FiPrinter, FiFileText, FiShield, FiArrowUpRight
} from 'react-icons/fi';

export const PaymentHistory = () => {
  const { data, loading, error } = useFetch('/member/payments');
  const [activeReceipt, setActiveReceipt] = useState(null);

  if (loading) return <SkeletonLoader count={3} height="140px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const totalSpent = data?.total_spent || 0;
  const invoices = data?.invoices || [];
  const activePlan = data?.active_plan || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge badge-active mb-2">Billing & Invoices</span>
          <h3 className="text-white font-weight-bold mb-1">Payment History</h3>
          <p className="text-muted mb-0">Review all past transactions, download official tax invoices and payment receipts.</p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="glass-card-static p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Lifetime Total Invested</span>
              <h2 className="text-cyan font-weight-bold mt-2 mb-0">${totalSpent.toFixed(2)}</h2>
            </div>
            <small className="text-muted mt-3">
              <FiCheckCircle className="text-success me-1" /> All payments verified
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="glass-card-static p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Current Active Subscription</span>
              <h3 className="text-white font-weight-bold mt-2 mb-0">{activePlan.plan_title || 'Pro Performance Plan'}</h3>
            </div>
            <small className="text-cyan mt-3 fw-semibold">
              ${activePlan.payment_amount || 129.99} / {activePlan.duration_months || 3} Months
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-12 col-lg-4">
          <div className="glass-card-static p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Total Invoices Issued</span>
              <h2 className="text-primary font-weight-bold mt-2 mb-0">{invoices.length} Invoices</h2>
            </div>
            <small className="text-muted mt-3">
              <FiShield className="text-cyan me-1" /> 256-bit Encrypted Billing
            </small>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-card-static p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="text-white font-weight-bold mb-0 d-flex align-items-center gap-2">
            <FiFileText className="text-cyan" /> Transactions & Invoices
          </h5>
          <span className="badge badge-role">{invoices.length} Records</span>
        </div>

        <div className="table-responsive">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Plan Description</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No transactions found.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span className="font-monospace text-cyan fw-bold small">{inv.id}</span>
                    </td>
                    <td className="text-muted small">
                      <FiCalendar className="me-1" size={13} />
                      {inv.date}
                    </td>
                    <td className="text-white fw-semibold">{inv.plan_title}</td>
                    <td className="text-muted small">
                      <FiCreditCard className="me-1" size={13} />
                      {inv.payment_method}
                    </td>
                    <td>
                      <span className="text-cyan fw-bold">${inv.amount.toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="badge badge-status badge-active">
                        <FiCheckCircle className="me-1" size={11} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => setActiveReceipt(inv)}
                        className="btn btn-secondary-glass btn-sm d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '0.78rem' }}
                      >
                        <FiFileText size={13} />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <Modal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          title={`Receipt: ${activeReceipt.id}`}
        >
          <div className="p-2" id="printable-receipt">
            {/* Header with Gymkhana Branding */}
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
              <div>
                <h4 className="text-white font-weight-bold mb-1">GYMKHANA FITNESS</h4>
                <small className="text-muted d-block">{activeReceipt.billing_address}</small>
                <small className="text-muted">GST/VAT Reg: GYM-US-8942-X</small>
              </div>
              <div className="text-end">
                <span className="badge badge-status badge-active mb-1">PAID IN FULL</span>
                <span className="d-block font-monospace text-cyan small fw-bold">{activeReceipt.id}</span>
                <small className="text-muted">{activeReceipt.date}</small>
              </div>
            </div>

            {/* Bill Details */}
            <div className="glass-card-static p-3 rounded-3 mb-3">
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Payment Mode:</span>
                <strong className="text-white">{activeReceipt.payment_method}</strong>
              </div>
              <div className="d-flex justify-content-between text-muted small">
                <span>Transaction Status:</span>
                <strong className="text-success">Successful / Confirmed</strong>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-3">
              <table className="table table-sm table-dark bg-transparent">
                <thead>
                  <tr className="text-muted small">
                    <th>Description</th>
                    <th className="text-end">Qty</th>
                    <th className="text-end">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-white fw-semibold">{activeReceipt.plan_title}</td>
                    <td className="text-end text-muted">1</td>
                    <td className="text-end text-white">${(activeReceipt.amount - (activeReceipt.tax_amount || 0)).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Estimated Tax (8%)</td>
                    <td className="text-end text-muted">-</td>
                    <td className="text-end text-muted">${(activeReceipt.tax_amount || 0).toFixed(2)}</td>
                  </tr>
                  <tr className="border-top border-secondary">
                    <td className="text-white fw-bold fs-6">Grand Total Paid</td>
                    <td></td>
                    <td className="text-end text-cyan fw-bold fs-6">${activeReceipt.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-25">
              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
              >
                <FiPrinter size={14} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="btn btn-primary-gradient btn-sm"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
