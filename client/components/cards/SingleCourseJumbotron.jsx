import { currencyFormatter } from "../../utils/helpers";
import { Badge, Button } from "antd";
import ReactPlayer from "react-player";
import { LoadingOutlined, SaftyOutlined } from "@ant-design/icons";

const singleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  user,
  loading,
  handleFreeEnrollment,
  handlePaidEnrollment,
  enrolled,
  setEnrolled,
}) => {
  //destructure
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  return (
    <>
    <div className="jumbotron bg-primary square">
      <div className="row">
        <div className="col-md-8 p-0">
          {/* title */}
          <h1 className="text-light font-weight-bold">{name}</h1>
          {/* description */}
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          {/* category */}
          <Badge
            count={category}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-4 mr-2"
          />
          {/* author */}
          <p>Created by {instructor.name}</p>
          {/* updatedAt  */}
          <p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>
          {/* price */}
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "usd",
                })
              : "free"}
          </h4>
        </div>
        <div className="col-md-4">
          {/* show video preview or course image */}
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                className=""
                url={lessons[0].video.Location}
                light={image.Location}
                width="100%"
                height="320px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}
          {/* enroll button */}
          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <Button
                className="mb-3 mt-3"
                type="danger"
                block
                shape="round"
                icon={<SaftyOutlined />}
                size="large"
                disabled={loading}
                onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
              >
                {user
                  ? enrolled.status
                    ? "Got to Course"
                    : "Enroll"
                  : "Login to Enroll"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default singleCourseJumbotron;
