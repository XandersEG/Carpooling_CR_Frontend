import { useState } from 'react';

/**
 * Estado de "hover" para Pressable (solo tiene efecto en web). Uso:
 *
 *   const { hovered, hoverProps } = useHover();
 *   <Pressable {...hoverProps} style={[styles.base, hovered && styles.hover]} />
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);

  return {
    hovered,
    hoverProps: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
    },
  };
}
