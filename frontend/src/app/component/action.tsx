'use client';

import { useLayoutEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { IAction } from '../interface/IAction';
import {
  liveActionPositionsAtom,
  liveMethodPositionsAtom,
  actionLengthAtom,
  actionConAtom,
  methodConAtom,
  height,
} from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';
import { useDraggable } from '../hooks/useDraggable';
import DrawChild from './draw/child';
import { IPosition } from '../interface/IPosition';
import DrawParent from './draw/parent';

interface ActionProps extends IAction {
  color: string;
  onNodeClick: (id: number, circlePosition: IPosition) => void;
  onAttributeClick: (id: number, circlePosition: IPosition) => void;
}

export default function Action({
  id,
  name: title,
  methods,
  positionX,
  positionY,
  color,
  onNodeClick,
  onAttributeClick,
}: ActionProps) {
  const setLiveNodePositions = useSetAtom(liveActionPositionsAtom);
  const setLiveAtrPosition = useSetAtom(liveMethodPositionsAtom);

  const handlePositionChange = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });

    setLiveNodePositions((prev) => {
      const existing = prev.find((pos) => pos.id === id);
      if (existing) {
        return prev.map((pos) =>
          pos.id === id ? { id: id, positionX: newX, positionY: newY } : pos,
        );
      } else {
        return [...prev, { id: id, positionX: newX, positionY: newY }];
      }
    });

    setLiveAtrPosition((prev) => {
      const filteredPrev = prev.filter(
        (atr) => !methods.some((attr) => attr.id === atr.childID),
      );

      const newAtrPositions = methods
        .map((attribute, i) => {
          const leftPos = {
            parentID: id,
            childID: attribute.id,
            positionX: newX,
            positionY: newY + height + (height / 2) * i,
          };

          return [leftPos];
        })
        .flat();

      return [...filteredPrev, ...newAtrPositions];
    });
  };

  const { position, setPosition } = useDraggable(
    positionX,
    positionY,
    handlePositionChange,
  );
  const { calculateNodeLength, calcChildCirclePos, calcParentCirclePos } =
    useCalculation();
  const [actionLengths, setActionLengths] = useAtom(actionLengthAtom);
  const actionCons = useAtomValue(actionConAtom);
  const methodCons = useAtomValue(methodConAtom);

  useLayoutEffect(() => {
    const width = calculateNodeLength(methods, title);

    setActionLengths((prevLengths) => {
      const existing = prevLengths.find((item) => item.id === id);
      if (existing) {
        return prevLengths;
      }
      return [...prevLengths, { id: id, length: width }];
    });
  }, [id, methods, title, calculateNodeLength, setActionLengths]);

  const nodeLength = actionLengths.find((item) => item.id === id)?.length || 0;

  const { leftCirclePosition, rightCirclePosition } = calcParentCirclePos(
    position,
    nodeLength,
  );

  const isConnected = actionCons.some((con) =>
    con.actions.find((n) => n.id === id),
  );

  return (
    <>
      {/* Header */}
      <DrawParent
        positionX={positionX}
        positionY={positionY}
        nodeLength={nodeLength}
        color={color}
        leftCirclePosition={leftCirclePosition}
        rightCirclePosition={rightCirclePosition}
        isConnected={isConnected}
        onParentClick={onNodeClick}
        id={id}
        title={title}
        handlePositionChange={handlePositionChange}
      >
        {methods}
      </DrawParent>

      {methods.map((method, i) => {
        const methodID = method.id;

        const { leftCirclePosition, rightCirclePosition } = calcChildCirclePos(
          position,
          nodeLength,
          i,
        );

        const isActive = methodCons.some((con) =>
          con.methods.find((a) => a.id === methodID),
        );
        const alertMsg = 'Connect actions before connecting methods.';
        const methodInput = method.input
          .replaceAll(',', ', ')
          .trim()
          .slice(0, -1);

        const text = method.input
          ? `${method.name}(${methodInput}): ${method.output}`
          : `${method.name}: ${method.output}`;

        return (
          <DrawChild
            key={methodID}
            i={i}
            child={method}
            childID={methodID}
            isConnected={isConnected}
            isActive={isActive}
            leftCirclePosition={leftCirclePosition}
            rightCirclePosition={rightCirclePosition}
            onChildClick={onAttributeClick}
            color={color}
            alertMsg={alertMsg}
            childText={text}
            position={position}
          />
        );
      })}
    </>
  );
}
