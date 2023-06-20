import React, { useState,useEffect  } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function PreferenceOrder({ values,onPreferenceChange  }) {
  const [orderedValues, setOrderedValues] = useState(values);

  useEffect(() => {
    setOrderedValues(values);
  }, [values]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
  
    const newValues = Array.from(orderedValues);
    const [reorderedValue] = newValues.splice(result.source.index, 1);
    newValues.splice(result.destination.index, 0, reorderedValue);
  
    setOrderedValues(newValues);
    onPreferenceChange(newValues);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="preference-order">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              background: "#F2F2F2",
              padding: "16px",
              borderRadius: "4px",
              minHeight: "100px",
            }}
          >
            {orderedValues.map((value, index) => (
              <Draggable key={value} draggableId={value} index={index}>
                {(provided, snapshot) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{
                      userSelect: "none",
                      padding: "12px",
                      marginBottom: "8px",
                      backgroundColor: snapshot.isDragging
                        ? "#A0AEC0"
                        : "#daf0f7  ",
                      color: snapshot.isDragging ? "white" : "black",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {value}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default PreferenceOrder;