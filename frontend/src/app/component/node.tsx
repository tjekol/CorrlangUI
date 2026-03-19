'use client';

import { useLayoutEffect } from 'react';
import { INode } from '@/app/interface/INode';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  liveNodePositionsAtom,
  liveAtrPositionsAtom,
  nodeLengthAtom,
  nodeConAtom,
  atrConAtom,
  height,
} from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';
import { useDraggable } from '../hooks/useDraggable';
import DrawChild from './draw/child';
import { IPosition } from '../interface/IPosition';
import DrawParent from './draw/parent';

interface NodeProps extends INode {
  color: string;
  onNodeClick: (id: number, circlePosition: IPosition) => void;
  onAttributeClick: (id: number, circlePosition: IPosition) => void;
}

export default function Node({
  id,
  title,
  attributes,
  positionX,
  positionY,
  color,
  onNodeClick,
  onAttributeClick,
}: NodeProps) {
  const setLiveNodePositions = useSetAtom(liveNodePositionsAtom);
  const setLiveAtrPosition = useSetAtom(liveAtrPositionsAtom);

  const handlePositionChange = (newX: number, newY: number) => {
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
        (atr) => !attributes.some((attr) => attr.id === atr.childID),
      );

      const newAtrPositions = attributes
        .map((attribute, i) => {
          const leftPos = {
            childID: attribute.id,
            parentID: id,
            positionX: newX,
            positionY: newY + height + (height / 2) * i,
          };

          return [leftPos];
        })
        .flat();

      return [...filteredPrev, ...newAtrPositions];
    });
  };

  const { position } = useDraggable(positionX, positionY, handlePositionChange);
  const { calculateNodeLength, calcChildCirclePos, calcParentCirclePos } =
    useCalculation();
  const [nodeLengths, setNodeLengths] = useAtom(nodeLengthAtom);
  const nodeCons = useAtomValue(nodeConAtom);
  const atrCons = useAtomValue(atrConAtom);

  useLayoutEffect(() => {
    const width = calculateNodeLength(attributes, title);

    setNodeLengths((prevLengths) => {
      const existing = prevLengths.find((item) => item.id === id);
      if (existing) {
        return prevLengths;
      }
      return [...prevLengths, { id: id, length: width }];
    });
  }, [id]);

  const nodeLength = nodeLengths.find((item) => item.id === id)?.length || 0;

  const { leftCirclePosition, rightCirclePosition } = calcParentCirclePos(
    position,
    nodeLength,
  );

  const isConnected = nodeCons.some((con) =>
    con.nodes.find((n) => n.id === id),
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
        children={attributes}
        handlePositionChange={handlePositionChange}
      />

      {attributes.map((attribute, i) => {
        const atrID = attribute.id;
        const { leftCirclePosition, rightCirclePosition } = calcChildCirclePos(
          position,
          nodeLength,
          i,
        );

        const isActive = atrCons.some((con) =>
          con.attributes.find((a) => a.id === atrID),
        );
        const alertMsg = 'Connect nodes before connecting attributes.';
        const text = `${attribute.text}: ${attribute.type}`;

        return (
          <DrawChild
            key={atrID}
            i={i}
            child={attribute}
            childID={atrID}
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
