'use client'

import Sidebar from '../../components/sidebar'
import { Bell, ChevronRight, Search } from '../../components/Icons'

const transactions = [
  {
    date: 'Oct, 16 2025',
    account: '......3423',
    amount: '-Rs. 4500.00'
  },
  {
    date: 'Oct, 16 2025',
    account: '......4876',
    amount: '-Rs. 10,000.00'
  },
  {
    date: 'Oct, 16 2025',
    account: '......6754',
    amount: '-Rs. 9870.00'
  }
]

export default function Dashboard() {
  return (
    <main className="dashboard">
      <Sidebar />

      <section className="content">
        {/* Header */}
        <header className="content-header">
          <h1 className="page-title">Dashboard</h1>
          <div className="header-actions">
            <div className="icon-btn">
              <Search size={22} />
            </div>
            <div className="icon-btn">
              <Bell size={22} />
            </div>
            <img src="/person-logo.png" alt="profile" className="avatar" />
          </div>
        </header>

        {/* Top Section */}
        <div className="top-section">
          <div className="welcome-card">
            <h2 className="welcome-title">Welcome back, Dilara!</h2>
            {/* 💡 Spacing සහ Position එක හරියටම මැදට සෙට් කළා */}
            <div className="balance-card">
              <p className="balance-label">Current Balance</p>
              <p className="balance-amount">Rs. 100,000</p>
              <ChevronRight className="balance-chevron" size={24} />
            </div>
            <div className="carousel-dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <img
              src="/dashboard-logo.png"
              alt="woman"
              className="welcome-image"
            />
          </div>

          <div className="payees-card">
            <h3 className="payees-title">Saved Payees</h3>
            <div className="payees-list">
              {[1, 2].map((item) => (
                <div key={item} className="payee-item">
                  <img
                    src="/person-logo.png"
                    alt="user"
                    className="avatar-sm"
                  />
                  <div className="payee-info">
                    <p className="payee-name">HKDS Wickramanayake</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all">
              <span>View all</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* Transactions - 💡 කපලා යන ලෙඩේ 100% ක්ම හැදුවා */}
        <div className="transactions-section">
          <h2 className="transactions-title">Recent Transactions</h2>
          <div className="transactions-card">
            <div className="transaction-list-wrapper">
              {transactions.map((t, index) => (
                <div key={index} className="transaction-item">
                  <div className="tx-left">
                    <img
                      src="/person-logo.png"
                      alt="user"
                      className="avatar-sm"
                    />
                    <span className="transaction-date">{t.date}</span>
                  </div>
                  <span className="transaction-account">{t.account}</span>
                  <span className="transaction-amount">{t.amount}</span>
                  <span className="transaction-status">Success</span>
                </div>
              ))}
            </div>
            <div className="view-all border-top">
              <span>View all</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard {
          width: 100vw;
          min-height: 100vh;
          background: #f8f9fa;
          display: flex;
          gap: 0;
          overflow-x: hidden;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-btn {
          color: #4b5563;
          cursor: pointer;
          transition: color 0.2s;
        }
        .icon-btn:hover {
          color: #111827;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .avatar-sm {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .top-section {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .welcome-card {
          flex: 2;
          min-width: 450px;
          height: 220px;
          background: #e5dbe7;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
        }

        .welcome-title {
          font-size: 22px;
          font-weight: 700;
          color: #1f1a24;
          margin-bottom: 1rem;
        }

        .balance-card {
          width: 320px;
          height: 95px;
          background: #111827;
          border-radius: 18px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 1.5rem;
          position: relative;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }

        .balance-label {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .balance-amount {
          color: #a7d93a;
          font-size: 24px;
          font-weight: 700;
          margin: 4px 0 0 0;
        }

        .balance-chevron {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .carousel-dots {
          position: absolute;
          bottom: 1.25rem;
          display: flex;
          gap: 0.35rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #9ca3af;
          border-radius: 50%;
        }
        .dot.active {
          width: 24px;
          border-radius: 4px;
          background: #450043;
        }

        .welcome-image {
          position: absolute;
          right: 1rem;
          bottom: 0;
          height: 210px;
          object-fit: cover;
          z-index: 1;
        }

        .payees-card {
          flex: 1;
          min-width: 280px;
          height: 220px;
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
        }

        .payees-title {
          font-weight: 700;
          font-size: 16px;
          color: #111827;
          margin-bottom: 1rem;
        }

        .payees-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }

        .payee-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .payee-name {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .view-all {
          font-size: 13px;
          font-weight: 600;
          color: #450043;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .view-all:hover {
          opacity: 0.8;
        }

        .transactions-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transactions-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .transactions-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          padding: 1.5rem;
        }

        .transaction-list-wrapper {
          display: flex;
          flex-direction: column;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .transaction-item:last-child {
          border-bottom: none;
        }

        .tx-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 180px;
        }

        .transaction-date {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .transaction-account {
          font-size: 14px;
          color: #6b7280;
        }

        .transaction-amount {
          font-size: 14px;
          font-weight: 700;
          color: #ef4444;
        }

        .transaction-status {
          background: #ecfdf5;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          color: #059669;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          min-width: 90px;
        }

        .border-top {
          border-top: 1px solid #f3f4f6;
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 1024px) {
          .welcome-card {
            flex: 100%;
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            flex-direction: column;
          }
          .content {
            padding: 1rem;
          }
          .top-section {
            gap: 1rem;
          }
          .welcome-card {
            min-width: 100%;
          }
          .transaction-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .transaction-status {
            align-self: flex-end;
          }
        }
      `}</style>
    </main>
  )
}
