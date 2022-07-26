import { useMount } from "ahooks";
import { useRef } from "react";
import "./DraggableLayout.less";

const styleMap: any = {
  horizontal: {
    firstStyle: {
      width: `calc(30% - 5px)`,
    },
    secondStyle: {
      width: `calc(70% - 5px)`,
    },
  },
  vertical: {
    firstStyle: {
      height: `calc(75% - 5px)`,
    },
    secondStyle: {
      height: `calc(25% - 5px)`,
    },
  },
};

// 原理 通过拖动draggable-line，计算偏移量
const DraggableLayout = (props: any) => {
  const draggableLineRef = useRef(null);
  const draggableLayoutRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const { dir } = props;
  const drag = () => {
    const draggableDom: any = draggableLineRef.current;
    const contentDom: any = draggableLayoutRef.current;
    const firstDom: any = firstRef.current;
    const secondDom: any = secondRef.current;
    draggableDom.onmousedown = (e: any) => {
      let _e = e;
      // const dir = "vertical"; // 设置好方向 可通过变量控制默认水平方向 horizontal | vertical
      const startCoordinate = dir === "horizontal" ? _e.clientX : _e.clientY; // 获取第一次点击的横坐标
      const secondDomStartSize: number =
        dir === "horizontal" ? secondDom.offsetWidth : secondDom.offsetHeight; // 获取到元素的宽度

      // 移动过程中对左右元素宽度计算赋值
      document.onmousemove = (_event: any) => {
        _e = _event;
        // 可扩展上下拖动等
        switch (dir) {
          case "horizontal":
            const moveOffset: number = _e.clientX - startCoordinate;
            // @ts-ignore
            const baifenbi1 =
              (
                // @ts-ignore
                `${
                  contentDom.offsetWidth - 15 - secondDomStartSize + moveOffset
                }` / (contentDom.offsetWidth - 10)
              ) * 100;
            // @ts-ignore
            const baifenbi2 =
              (
                (secondDomStartSize - moveOffset + 5) / (
                  contentDom.offsetWidth - 10
                )
              ) * 100;
            firstDom.style.width = `calc(${baifenbi1}% - 5px)`;
            secondDom.style.width = `calc(${baifenbi2}% - 5px)`;
            break;

          case "vertical":
            const moveOffset1: number = _e.clientY - startCoordinate;
            // @ts-ignore
            const baifenbi4 =
              (
                // @ts-ignore
                `${
                  contentDom.offsetHeight -
                    15 -
                    secondDomStartSize + moveOffset1
                }` / (contentDom.offsetHeight - 10)
              ) * 100;
            // @ts-ignore
            const baifenbi3 =
              (
                (secondDomStartSize - moveOffset1 + 5) / (
                  contentDom.offsetHeight - 10
                )
              ) * 100;

            firstDom.style.height = `calc(${baifenbi4}% - 5px)`;
            secondDom.style.height = `calc(${baifenbi3}% - 5px)`;
            break;

          default:
            break;
        }
      };
      // 在左侧和右侧元素父容器上绑定松开鼠标解绑拖拽事件
      contentDom.onmouseup = () => {
        document.onmousemove = null;
      };
      return false;
    };
  };

  useMount(() => {
    drag();
  });

  return (
    <div
      ref={draggableLayoutRef}
      className={"draggable-layout"}
      style={{ display: dir === "horizontal" ? "flex" : "block" }}
    >
      <div ref={firstRef} style={styleMap[dir].firstStyle}>
        {props.children[0]}
      </div>
      <div
        ref={draggableLineRef}
        className={"draggable-line"}
        style={{
          cursor: dir === "horizontal" ? "ew-resize" : "ns-resize",
          padding: `${dir === "horizontal" ? "0" : "10"}px ${
            dir === "horizontal" ? "10" : "0"
          }px`,
        }}
      >
        <div
          style={{
            width: `${dir === "horizontal" ? "1px" : "100%"}`,
            height: `${dir === "horizontal" ? "100%" : "1px"}`,
          }}
        />
      </div>
      <div ref={secondRef} style={styleMap[dir].secondStyle}>
        {props.children[1]}
      </div>
    </div>
  );
};

export default DraggableLayout;
