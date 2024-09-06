import React, { useRef } from "react";
import { Grid } from "@mui/material";
import ButtonComponent from "../../common/ButtonComponent";
import { useDrag, useDrop } from "react-dnd";

const CategoryCard = ({
  index,
  id,
  category,
  handleDeleteCategory,
  handleEditCategory,
  moveCard,
  priority,
}) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{ opacity, backgroundColor: "#2c2d30" }}
      data-handler-id={handlerId}
      className="p-3 my-2 rounded-md cursor-move"
    >
      <Grid container columnSpacing={2} rowSpacing={1}>
        <Grid item xs={12} sm={3} md={3}>
          <span className="mx-3 px-2 py-1 rounded-full bg-white text-black">
            {priority}
          </span>
          <span className="mx-3">{category.categoryName}</span>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className="h-24 max-w-sm">
            <img src={category.url} alt="" className="w-full h-full" />
          </div>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <ButtonComponent
            btnClass={"btn-success"}
            btnText={"Edit"}
            onClick={() => handleEditCategory(category)}
          />
          <ButtonComponent
            btnClass={"btn-danger"}
            btnText={"Delete"}
            onClick={() => handleDeleteCategory(category._id)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryCard;
