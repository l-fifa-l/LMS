import { useState, useEffect, useContext } from "react";
import { context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  DollarOutlined,
  SettingOutlined,
  LoadingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helpers";

export default function revenue() {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/instructor/payout-settings`);
      window.Location.href(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Unable to access payout setting. Try later");
    }
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              <DollarOutlined /> Revenu report
            </h2>
            <small>
              You get paid directly from stripe to your bank Account every 48
              hours
            </small>
            <hr />
            <h4>
              Pending balance
              {balance.pending &&
                balance.pending.map((bp, i) => {
                  <span key={i} className="float-right">
                    {stripeCurrencyFormatter(bp)}
                  </span>;
                })}
            </h4>
            <small>For last 48 balance</small>
            <hr />
            <h4>
              Payout{" "}
              {!loading ? (
                <SettingOutlined
                  className="float-right pointer"
                  onClick={handlePayoutSettings}
                />
              ) : (
                <SyncOutlined spin className="float-right pointer" />
              )}
            </h4>
            <small>Update your stripe account details or view </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
}
