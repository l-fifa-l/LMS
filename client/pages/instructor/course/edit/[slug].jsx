import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Avatar, List, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Item } = List;

export default function CourseEdit() {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    loading: false,
    imagePreview: "",
    category: "",
    lesson: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Image Upload");
  //
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("image uploaded", data);
        //set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (error) {
        console.log(error);
        setValues({ ...values, loading: false });
        toast("image upload failed");
      }
    });
  };

  const handleImageRemove = async (e) => {
    // console.log("REMOVE IMAGE");
    try {
      setValues({ ...values, loading: true });
      const { data } = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("upload again");
      setValues({ ...values, loading: false });
    } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false });
      toast("image removed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast("Course Updated");
      //   router.push("/instructor");
    } catch (error) {
      // console.log(error);
      toast(error.response.data);
    }
  };

  const handleDrag = (e, index) => {
    console.log("on drag =>", index);
    // e.dataTransfer.setData("item index", index);
  };

  const handleDrop = async (e, index) => {
    console.log("on drop =>", index);
    // const movingItemIndex = e.dataTransfer.getData("itemIndex");
    // const targetItemIndex = index;
    // let allLessons = values.lessons;

    // let movingItem = allLessons[movingItemIndex]; //clicked // gradded item to reorder
    // allLessons.splice(movingItemIndex, 1); // remove 1 item from given index
    // allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    // setValues({ ...values, lessons: [...allLessons] });

    // // save the new lesson array in database
    // const { data } = await axios.put(`/api/course/${slug}`, {
    //   ...values,
    //   image,
    // });
    // toast("lessons re-ordered");
  };

  const handleDelete = async (index) => {
    const answer = window.confirm("Are you sure you want to delete");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });

    //send req to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    console.log("data", data);
  };

  /*
   *
   */

  const handleVideo = async (e) => {
    //remove previous video
    console.log(current.video);
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
      console.log("REMOVED ==>", res);
    }

    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);
    //send video as form data
    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);
    //save progress bar and  send video aS FROM DATA TO BACKEND
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    // console.log("handle update lesson");
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    setUploadVideoButtonText("Upload video");
    setVisible(false);
    // setCourse(data);
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast("lesson Updated");
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          editPage={true}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(values, null, 4)}</pre> */}
      <hr />

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>

                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-right"
                />
              </Item>
            )}
          ></List>
        </div>
      </div>
      <Modal
        title="Update Lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleUpdateLesson={handleUpdateLesson}
          handleVideo={handleVideo}
          uploadVideoButtonText={uploadButtonText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
}
