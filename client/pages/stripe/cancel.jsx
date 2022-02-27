import { CloudSyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";

const StripeCancel = () => {
  return (
    <UserRoute showNav={false}>
      <div className="row text-center">
        <div className="col">
          <CloudSyncOutlined className="display-1 text-danger p-5 " />
          <p className="lead">Payment Failed.. Try again</p>
        </div>
        <div className="col-md-3"> </div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
