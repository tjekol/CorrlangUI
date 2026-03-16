import { useCalculation } from '../hooks/useCalculation';
import { usePath } from '../hooks/usePath';
import {
  IActionConnection,
  IAtrConnection,
  IMethodConnection,
  INodeConnection,
} from '../interface/IConnections';
import { IPendingCon } from '../interface/IStates';

export default function NodeConnection({
  cons,
  childCons,
  deleteCon,
  deleteChildCon,
  midCon,
  pendingNodeCon,
  onConClick,
  conType,
}: {
  cons: INodeConnection[] | IActionConnection[];
  childCons: IAtrConnection[] | IMethodConnection[];
  deleteCon(id: number): void;
  deleteChildCon(id: number): void;
  midCon: Record<number, { x: number; y: number }>;
  pendingNodeCon: IPendingCon | null;
  onConClick: (conID: number, id: number) => boolean | void;
  conType: number;
}) {
  const { getNodePosition, calculateMidpoint, getMidpoint } = useCalculation();
  const { getPathData, getShortestPath } = usePath();

  const nodeConColor = '#22223B';
  const strokeOpacity = 0.8;

  const getNodeIDs = (nodeConID: number): number[] | undefined => {
    const nodeCon = cons.find((c) => c.id === nodeConID);
    if (nodeCon) {
      if ('nodes' in nodeCon) return nodeCon.nodes.map((n) => n.id);
      if ('actions' in nodeCon) return nodeCon.actions.map((n) => n.id);
    }
  };

  return (
    <>
      {cons.map((c) => {
        const conID = c.id;
        const nodeIDs = getNodeIDs(conID);
        // attributes of nodes
        const relatedAtrCons = childCons.filter((atrCon) => {
          if ('attributes' in atrCon && nodeIDs) {
            return atrCon.attributes.every((atr) =>
              nodeIDs.includes(atr.nodeID),
            );
          } else if ('methods' in atrCon && nodeIDs) {
            return atrCon.methods.every((atr) =>
              nodeIDs.includes(atr.actionID),
            );
          }
        });

        if (nodeIDs && nodeIDs.length === 2) {
          const srcNodeID = nodeIDs[0];
          const trgtNodeID = nodeIDs[1];

          const pos1 = getNodePosition(srcNodeID, conType);
          const pos2 = getNodePosition(trgtNodeID, conType);

          if (pos1 && pos2) {
            const type = conType === 0 ? 0 : 3;
            return (
              <g key={conID}>
                <path
                  ref={(pathElement) => {
                    if (pathElement) {
                      setTimeout(
                        () => calculateMidpoint(pathElement, conID, type),
                        0,
                      );
                    }
                  }}
                  d={getPathData(conType, pos1, pos2, srcNodeID, trgtNodeID)}
                  stroke={nodeConColor}
                  strokeWidth={3.5}
                  fill='none'
                  onClick={() => {
                    if (confirm('Delete connection?')) {
                      // delete the node connection and all related attribute connections
                      deleteCon(conID);
                      relatedAtrCons.forEach((atrCon) => {
                        deleteChildCon(atrCon.id);
                      });
                    }
                  }}
                  className='hover:cursor-pointer'
                  strokeOpacity={strokeOpacity}
                />
                {/* circle in the middle of connection */}
                {midCon[conID] && (
                  <circle
                    cx={midCon[conID].x}
                    cy={midCon[conID].y}
                    r={6}
                    fill='white'
                    stroke={nodeConColor}
                    className='hover:opacity-100 opacity-70'
                    onClick={() => {
                      if (pendingNodeCon) {
                        onConClick(conID, pendingNodeCon.id);
                      } else {
                        alert(
                          'Click a node first, then the circle to create a multi-connection.',
                        );
                      }
                    }}
                  />
                )}
              </g>
            );
          }
        } else if (nodeIDs) {
          const nodePositions = nodeIDs
            .map((nodeID) => getNodePosition(nodeID, conType))
            .filter((pos): pos is { x: number; y: number } => pos !== null);
          const midpoint = getMidpoint(nodePositions);
          if (midpoint && nodePositions.length > 0) {
            return nodePositions.map((position, index) => (
              <g key={index}>
                <path
                  key={conID}
                  stroke={nodeConColor}
                  strokeWidth={3}
                  strokeOpacity={strokeOpacity}
                  d={getShortestPath(
                    conType,
                    midpoint,
                    position,
                    nodeIDs[index],
                  )}
                />
                {/* diamond */}
                <path
                  d={`M ${midpoint.x} ${midpoint.y - 12} 
                  L ${midpoint.x + 7} ${midpoint.y} 
                  L ${midpoint.x} ${midpoint.y + 12} 
                  L ${midpoint.x - 7} ${midpoint.y} Z`}
                  onClick={() => {
                    if (pendingNodeCon) {
                      onConClick(conID, pendingNodeCon.id);
                    } else {
                      if (confirm('Delete node connection?')) {
                        deleteCon(conID);
                        relatedAtrCons.map((atrCon) =>
                          deleteChildCon(atrCon.id),
                        );
                      }
                    }
                  }}
                />
              </g>
            ));
          }
        }
        return null;
      })}
    </>
  );
}
