import { useCalculation } from '../hooks/useCalculation';
import { IAtrConnection, IMethodConnection } from '../interface/IConnections';
import { IPendingAtrCon } from '../interface/IStates';

export default function ChildConnecton({
  childCons,
  deleteChildCon,
  midChildCon,
  pendingChildCon,
  onChildConClick,
  conType,
}: {
  childCons: IAtrConnection[] | IMethodConnection[];
  deleteChildCon: (id: number) => void;
  midChildCon: Record<number, { x: number; y: number }>;
  pendingChildCon: IPendingAtrCon | null;
  onChildConClick: (conID: number, id: number) => boolean | void;
  conType: number;
}) {
  const {
    getPathData,
    getNode,
    getAction,
    getAttributePosition,
    getMidpoint,
    getShortestPath,
    calculateMidpoint,
  } = useCalculation();

  const atrConColor = '#4A4E69';
  const strokeOpacity = 0.8;

  const getAtrIDs = (atrConID: number): number[] | undefined => {
    const atrCon = childCons.find((con) => con.id === atrConID);
    if (atrCon) {
      if ('attributes' in atrCon) return atrCon.attributes.map((a) => a.id);
      if ('methods' in atrCon) return atrCon.methods.map((a) => a.id);
    }
  };

  return (
    <>
      {childCons.map((atrCon) => {
        const atrConID = atrCon.id;
        const atrIDs = getAtrIDs(atrConID);

        if (atrIDs && atrIDs.length === 2) {
          const srcAtrID = atrIDs[0];
          const trgtAtrID = atrIDs[1];
          const pos1 = getAttributePosition(srcAtrID, conType);
          const pos2 = getAttributePosition(trgtAtrID, conType);
          let srcNode, trgtNode;

          if (conType === 0) {
            srcNode = getNode(srcAtrID);
            trgtNode = getNode(trgtAtrID);
          } else if (conType === 1) {
            srcNode = getAction(srcAtrID);
            trgtNode = getAction(trgtAtrID);
          }

          if (srcNode && trgtNode && pos1 && pos2) {
            const type = conType === 0 ? 1 : 4;
            return (
              <g key={atrConID}>
                <path
                  ref={(pathElement) => {
                    if (pathElement) {
                      setTimeout(
                        () => calculateMidpoint(pathElement, atrConID, type),
                        0,
                      );
                    }
                  }}
                  key={atrConID}
                  d={getPathData(conType, pos1, pos2, srcNode.id, trgtNode.id)}
                  stroke={atrConColor}
                  strokeWidth={3}
                  fill='none'
                  onClick={() => {
                    if (confirm('Delete attribute connection?')) {
                      deleteChildCon(atrConID);
                    }
                  }}
                  className='hover:cursor-pointer'
                  strokeOpacity={strokeOpacity}
                />
                {/* circle in the middle of connection */}
                {midChildCon[atrConID] && (
                  <circle
                    cx={midChildCon[atrConID].x}
                    cy={midChildCon[atrConID].y}
                    r={5}
                    fill='white'
                    stroke={atrConColor}
                    className='hover:opacity-100 opacity-70'
                    onClick={() => {
                      if (pendingChildCon) {
                        onChildConClick(atrConID, pendingChildCon.attributeID);
                      } else {
                        alert(
                          'Click an attribute first, then the circle to add to connection.',
                        );
                      }
                    }}
                  />
                )}
              </g>
            );
          }
        } else if (atrIDs) {
          const atrPositions = atrIDs
            .map((atrID) => getAttributePosition(atrID, conType))
            .filter((pos): pos is { x: number; y: number } => pos !== null);
          const midpoint = getMidpoint(atrPositions);
          if (midpoint && atrPositions.length > 0) {
            return atrPositions.map((position, index) => (
              <g key={index}>
                <path
                  key={`${atrConID}-${index}`}
                  stroke={atrConColor}
                  strokeWidth={3}
                  strokeOpacity={strokeOpacity}
                  d={getShortestPath(
                    conType,
                    midpoint,
                    position,
                    undefined,
                    atrIDs[index],
                  )}
                />
                {/* diamond */}
                <path
                  d={`M ${midpoint.x} ${midpoint.y - 12}
                  L ${midpoint.x + 7} ${midpoint.y}
                  L ${midpoint.x} ${midpoint.y + 12}
                  L ${midpoint.x - 7} ${midpoint.y} Z`}
                  onClick={() => {
                    if (pendingChildCon) {
                      onChildConClick(atrConID, pendingChildCon.attributeID);
                    } else {
                      if (confirm('Delete attribute connection?')) {
                        deleteChildCon(atrConID);
                      }
                    }
                  }}
                />
              </g>
            ));
          }
        }
      })}
    </>
  );
}
