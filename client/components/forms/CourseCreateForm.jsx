import { Select, Button, Avatar, Badge } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

const CourseCreateForm = ({
  handleChange,
  handleSubmit,
  handleImage,
  values,
  setValues,
  preview,
  uploadButtonText,
  // if the function is not sending a prop the there will not be any error
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const childern = [];
  for (let i = 9.99; i <= 99.99; i++) {
    childern.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }
  return (
    <>
      {values && (
        <form className="form-group">
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              type="text"
              name="description"
              rows="7"
              cols="7"
              className="form-control"
              value={values.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row ">
            <div className="col">
              <div className="form-group">
                <Select
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                  value={values.paid}
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>
            {values.paid && (
              <div className="form-group">
                <Select
                  defaultValue="9.99"
                  style={{ width: "100%" }}
                  onChange={(v) => setValues({ ...values, price: v })}
                  tokenSeparators={[,]}
                  size="large "
                >
                  {childern}
                </Select>
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept=".png, .jpg, .jpeg"
                    hidden
                  />
                </label>
              </div>
            </div>

            {preview && (
              <Badge count="x" onClick={handleImageRemove} className="pointer">
                <Avatar src={preview} />
              </Badge>
            )}

            {editPage && values.image && <Avatar src={values.image.Location} />}
          </div>

          <div className="row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary"
                loading={values.loading}
                icon={<SaveOutlined />}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? "Saving..." : "Savea and continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
