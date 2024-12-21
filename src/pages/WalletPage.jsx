//========================================================================================================================================================
// Wallet Page for displaying user's wallet data
//========================================================================================================================================================
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TopBar from "../components/TopBar";
import BurgerMenu from "../components/BurgerMenu";
import "../styles/Global.css";
import "../styles/WalletPage.css";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [recipientQuery, setRecipientQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipientData, setRecipientData] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [userCache, setUserCache] = useState({}); // Cache to store user info by UDIS/email key

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch wallet on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/wallet`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWallet(response.data);
      } catch (err) {
        setError("Error fetching wallet details.");
      }
    };
    fetchWallet();
  }, [API_BASE_URL]);
//========================================================================================================================================================
  const fetchUserInfo = useCallback(async (identifier) => {
    if (!identifier) return null;
    if (userCache[identifier]) return userCache[identifier]; // return cached data

    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/verify/${identifier}`);
      const userData = res.data;
      // Store in cache
      setUserCache((prev) => ({ ...prev, [identifier]: userData }));
      return userData;
    } catch {
      return null;
    }
  }, [API_BASE_URL, userCache]);

  // Fetch user info for transactions once wallet is loaded
  useEffect(() => {
    const fetchTransactionsUsers = async () => {
      if (!wallet || !wallet.transactions) return;
      const uniqueIds = new Set();
      wallet.transactions.forEach((tx) => {
        uniqueIds.add(tx.from);
        uniqueIds.add(tx.to);
      });

      for (let id of uniqueIds) {
        await fetchUserInfo(id);
      }
    };
    fetchTransactionsUsers();
  }, [wallet, fetchUserInfo]);
//========================================================================================================================================================

  const handleSendMoney = async () => {
    if (!recipientData) {
      setError("No recipient selected.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/wallet/send`,
        {
          recipientId: recipientData.email || recipientData.udisId,
          amount: parseFloat(amount),
          description: description.trim() || "No description provided",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setError("");
      alert(response.data.message);
      const updatedWallet = await axios.get(`${API_BASE_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWallet(updatedWallet.data); // Update wallet after sending money and clear the fi
      setRecipientData(null);
      setRecipientQuery("");
      setAmount("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending money.");
    }
  };
//========================================================================================================================================================
  const handleSearchRecipient = async () => {
    if (!recipientQuery.trim()) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/verify/${recipientQuery.trim()}`);
      setRecipientData(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
      setRecipientData(null);
    }
  };
//========================================================================================================================================================
  const handleScan = () => {
    // don't forget *****
    alert("Scanner logic not implemented yet.");
  };
//========================================================================================================================================================
  const toggleTransactionDetails = (idx) => {
    setExpandedTransaction(expandedTransaction === idx ? null : idx);
  };
//========================================================================================================================================================
  const getTransactionColor = (type) => {
    return type === "OUT" ? "red-amount" : "green-amount";
  };
//========================================================================================================================================================
  const renderUserLabel = (identifier) => {
    const uData = userCache[identifier];
    if (!uData) return identifier; // fallback to raw identifier if not found
    return `${uData.name} (${uData.udisId})`;
  };
//========================================================================================================================================================
  const getUserAvatar = (identifier) => {
    const uData = userCache[identifier];
    if (!uData) return "/images/default_avatar.png";
    if (uData.avatarPicture && uData.avatarPicture.startsWith("/uploads")) {
      return `${API_BASE_URL}${uData.avatarPicture}`;
    }
    return uData.avatarPicture || "/images/default_avatar.png";
  };

  return (
    <div className="wallet-page-container">
      <TopBar title="Wallet" />
      <BurgerMenu />
      {error && <p className="error-message">{error}</p>}

      {/* Balance Card */}
      <div className="balance-section" style={{ marginTop: "40px" }}>
        <h2 className="balance-title">Balance</h2>
        <p className="balance-amount">${wallet ? wallet.balance : "Loading..."}</p>
      </div>

      {/* Divider */}
      <hr className="divider" />

      {/* Send Money */}
      <h3 className="section-title">Send Money</h3>
      <div className="send-money-section">
        <div className="send-controls">
          <input
            type="text"
            placeholder="Enter Email or UDIS ID"
            value={recipientQuery}
            onChange={(e) => setRecipientQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearchRecipient}>🔍</button>
          <button className="scan-button" onClick={handleScan}>📷</button>
        </div>

        {recipientData && (
          <div className="recipient-info">
            <img
              src={
                recipientData.avatarPicture && recipientData.avatarPicture.startsWith("/uploads")
                  ? `${API_BASE_URL}${recipientData.avatarPicture}`
                  : recipientData.avatarPicture || "/images/default_avatar.png"
              }
              alt="Recipient Avatar"
              className="recipient-avatar"
            />
            <p>{recipientData.name} ({recipientData.udisId})</p>
            <p>{recipientData.email || recipientData.udisId}</p>
          </div>
        )}

        {recipientData && (
          <div className="amount-description">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="send-button" onClick={handleSendMoney}>Send</button>
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="divider" />

      {/* Recent Transactions */}
      <h3 className="section-title">Recent Transactions</h3>
      <div className="transactions-section">
        {wallet?.transactions && wallet.transactions.length > 0 ? (
          <ul className="transactions-list">
            {wallet.transactions.map((tx, idx) => {
              const isExpanded = expandedTransaction === idx;
              const otherParty = tx.type === "OUT" ? tx.to : tx.from;
              const otherUserAvatar = getUserAvatar(otherParty);

              return (
                <li key={idx} className="transaction-item">
                  <div className="transaction-summary" onClick={() => toggleTransactionDetails(idx)}>
                    <img src={otherUserAvatar} alt="User Avatar" className="transaction-avatar" />
                    <span className="transaction-name">{renderUserLabel(otherParty)}</span>
                    <span className={`transaction-amount ${getTransactionColor(tx.type)}`}>${tx.amount}</span>
                    <span className="transaction-arrow">{isExpanded ? '▼' : '▶'}</span>
                  </div>
                  {isExpanded && (
                    <div className="transaction-details">
                      <p>Description: {tx.description || "No description"}</p>
                      <p>Date: {new Date(tx.date).toLocaleString()}</p>
                      <p>From: {renderUserLabel(tx.from)}</p>
                      <p>To: {renderUserLabel(tx.to)}</p>
                      <p>Type: {tx.type}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </div>
  );
};
//========================================================================================================================================================
export default WalletPage;