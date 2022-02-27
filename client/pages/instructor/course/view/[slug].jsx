import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";

const CourseView = () => {
  const [course, setCourse] = useState({});

  //lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  //student count in course
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    // console.log(slug);
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    setStudents(data.length);
  };

  // function for adding lessons
  const handleAddLesson = async (e) => {
    e.preventDefault();
    // console.log(values);
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      // console.log(data)
      setValues({ ...values, title: "", content: "", video: {} });
      setProgress(0);
      setUploadButtonText("Upload Video");
      setVisible(false);
      setCourse(data);
      toast("Lesson Added");
    } catch (error) {
      console.log(error);
      // toast("Lesson Add failed");
    }
  };

  const handleVideo = async (e) => {
    // console.log("handle video upload");
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);
      //save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      //once res is recieved
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast("Video Upload Failed");
    }
  };

  const handleVideoRemove = async () => {
    // console.log("handleVideoRemove");
    try {
      uploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText("Upload an other video");
    } catch (error) {
      setUploading(false);
      toast("Video Upload Failed");
      console.log(error);
    }
  };

  const handlePublish = async (e, courseId) => {
    // console.log("handlePublish");
    try {
      let answer = window.confirm(
        "Once yu publish the course, it will be live for users to enroll"
      );
      if (!answer) return;

      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast("congrats! course published");
    } catch (error) {
      console.log(error);
      toast("Course failed to Publish");
    }
  };

  const handleUnpublish = async (e, courseId) => {
    // console.log("handleUnpublish");
    try {
      let answer = window.confirm(
        "Once yu publish the course, it will not be live for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
    } catch (error) {
      console.log(error);
      toast("Course failed to Unpublish");
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />
              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>
                  <div className="d-flex pt-1">
                    <Tooltip title={`${students} enrolled`}>
                      <UserSwitchOutlined className="h5 pointer text-info mr-4" />
                    </Tooltip>

                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                        className="h5 pointer text-warning mr-4"
                      />
                    </Tooltip>

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lesssons required to publish course">
                        <QuestionOutlined className="h5  pointer text-danger" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublish">
                        <CloseOutlined
                          onClick={(e) => handleUnpublish(e, course._id)}
                          className="h5  pointer text-danger"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <CheckOutlined
                          onClick={(e) => handlePublish(e, course._id)}
                          className="h5  pointer text-success"
                        />
                      </Tooltip>
                    )}
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <ReactMarkdown source={course.description} />
                    </div>
                  </div>
                  <div className="row">
                    <Button
                      onClick={() => setVisible(true)}
                      className="col-md-6 offset-md-3 text-center"
                      type="primary"
                      shape="round"
                      icon={<UploadOutlined />}
                      size="large"
                    >
                      Add Lesson
                    </Button>
                  </div>
                  <br />
                  <Modal
                    title="Add lesson"
                    centered
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                  >
                    <AddLessonForm
                      values={values}
                      setValues={setValues}
                      handleAddLesson={handleAddLesson}
                      uploading={uploading}
                      uploadButtonText={uploadButtonText}
                      handleVideo={handleVideo}
                      progress={progress}
                      handleVideoRemove={handleVideoRemove}
                    />
                  </Modal>
                </div>
              </div>
            </div>
            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></Item.Meta>
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
