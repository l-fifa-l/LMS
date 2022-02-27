import React from "react";
import { List, Avatar } from "antd";
const { Item } = List;

export default function SingleCourseLessons({
  lessons,
  setPreview,
  showModal,
  setShowModal,
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col lessons-list">
          {lessons && <h4>{lessons.lenght} Lessons</h4>}
        </div>
        <hr />
        <List
          itemLayout={"horizontal"}
          dataSource={lessons}
          renderItem={(item, index) => (
            <Item>
              <Item.Meta
                avatar={<Avatar>{index + 1}</Avatar>}
                title={item.title}
              />
              {item.video && item.video !== null && item.free_preview && (
                <span
                  className="text-primary pointer"
                  onClick={() => {
                    setPreview(item.video.Location);
                    setShowModal(!showModal);
                  }}
                >
                  Preview
                </span>
              )}
            </Item>
          )}
        />
      </div>
    </div>
  );
}
