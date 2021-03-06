import { Piece as PieceType, Position, Color, Hovered, State } from "./types";
import { useGLTF } from "@react-three/drei/useGLTF";
import { arrayEqual } from "./utils";
import getAvailableMoves from "./getAvailableMoves";

const Piece = ({
  piece,
  position,
  color,
  game,
  hovered,
  setHovered
}: {
  piece: PieceType;
  position: Position;
  color: Color;
  game: State;
  hovered: Hovered | null;
  setHovered: (hovered: Hovered | null) => void;
}) => {
  const { nodes } = useGLTF("/public/figures.gltf");
  const adjusted: [number, number, number] = [
    position[0] - 4,
    hovered && hovered.selected && arrayEqual(hovered.position, position)
      ? 1
      : 0,
    position[1] - 4
  ];

  const onPointerOver = () => {
    if (game.currentTurn !== color) {
      return;
    }

    if (hovered?.selected) {
      return;
    }
    const available = getAvailableMoves(game, position);
    setHovered(
      available ? { position, selected: false, available: available! } : null
    );
  };

  const onPointerOut = () => {
    if (
      hovered !== null &&
      !hovered.selected &&
      arrayEqual(hovered.position, position)
    ) {
      setHovered(null);
    }
  };

  const onPointerUp = () => {
    // Don't allow to select piece with no available moves.
    if (
      hovered === null ||
      (hovered.available.moves.length === 0 &&
        hovered.available.takes.length === 0)
    ) {
      return;
    }

    setHovered({ ...hovered, selected: true });
  };

  const calculatedColor =
    hovered !== null && arrayEqual(hovered.position, position)
      ? "#ff00ff"
      : color === "white"
      ? "#fff"
      : "#111";

  return (
    <group scale={[0.7, 0.7, 0.7]} position={adjusted} dispose={null}>
      <mesh
        castShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerUp={onPointerUp}
        geometry={nodes[piece].geometry}
      >
        <meshStandardMaterial color={calculatedColor} />
      </mesh>
    </group>
  );
};

export default Piece;
