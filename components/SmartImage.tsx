import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import type { ComponentType } from 'react';

// SmartImage renders PNG (number from require) or SVG (React component from transformer)
// Usage: <SmartImage source={iconMap.calendarSvg} style={{ width: 16, height: 16 }} />

export type SmartImageSource = number | ComponentType<any>;

type Props = {
  source: SmartImageSource;
  style?: StyleProp<ImageStyle>;
  // Optional tint/fill color for SVG
  color?: string;
};

function extractSize(style?: StyleProp<ImageStyle>): { width?: number; height?: number } {
  if (!style) return {};
  const flat = Array.isArray(style) ? Object.assign({}, ...style) : (style as ImageStyle);
  const width = typeof flat.width === 'number' ? flat.width : undefined;
  const height = typeof flat.height === 'number' ? flat.height : undefined;
  return { width, height };
}

export const SmartImage: React.FC<Props> = ({ source, style, color }) => {
  // If source is a number, it's a PNG via require -> use RN Image
  if (typeof source === 'number') {
    return <Image source={source} style={style} resizeMode="contain" />;
  }

  // Otherwise, assume it's an SVG React component (from react-native-svg-transformer)
  // Some bundlers/transformers may wrap the component under a `default` export.
  const maybeModule = source as any;
  const SvgComponent: ComponentType<any> =
    (maybeModule && typeof maybeModule === 'object' && 'default' in maybeModule)
      ? (maybeModule.default as ComponentType<any>)
      : (maybeModule as ComponentType<any>);
  const { width, height } = extractSize(style);

  return (
    <SvgComponent
      width={width}
      height={height}
      // Common SVG props
      color={color}
      fill={color}
      // Allow passing style container for alignment/margins
      style={Array.isArray(style) ? Object.assign({}, ...style) : style}
    />
  );
};

export default SmartImage;
