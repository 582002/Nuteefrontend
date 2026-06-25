import React from "react";
import { Rnd } from "react-rnd";

export default function DesignEditor({ design, pos, setPos }) {
  return (
    <div style={{ width: 400, height: 300, border: "1px solid #ccc", background: "#f4f4f4", position: "relative" }}>
      <Rnd
        size={{ width: pos.width, height: pos.height }}
        position={{ x: pos.x, y: pos.y }}
        onDragStop={(e, d) => setPos({ ...pos, x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, position) =>
          setPos({
            ...pos,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            x: position.x,
            y: position.y,
          })
        }
        bounds="parent"
        lockAspectRatio={false}
        enableResizing={{
          top: true, right: true, bottom: true, left: true,
          topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
        }}
      >
        <img src={design} style={{ width: "100%", height: "100%", pointerEvents: "none" }} alt="Design preview" />
      </Rnd>
    </div>
  );
}
