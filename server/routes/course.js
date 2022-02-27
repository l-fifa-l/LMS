import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { isInstructor, requireSignin, isEnrolled } from "../middleware";
import {
  courses,
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  update,
  addLesson,
  removeLesson,
  updateLesson,
  publishCourse,
  unPublishCourse,
  checkEnrollment,
  freeEnrollment,
  paidEnrollment,
  stripeSuccess,
  userCourses,
  markCompleted,
  markIncompleted,
  listCompleted,
} from "../controllers/course.js";

router.get("/courses", courses);

//image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);

//course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

//Publish && Unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unPublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

//enrollment
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);

router.get("/stripe-success/:courseId", requireSignin, stripeSuccess);
router.get("/user-courses", requireSignin, userCourses);

router.get("/user/course/:slug", requireSignin, isEnrolled, read);

//mark as completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/mark-incompleted", requireSignin, markIncompleted);
router.post("/list-completed", requireSignin, listCompleted);

module.exports = router;
