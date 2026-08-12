import Svg, { Circle, Line } from 'react-native-svg';

export function ScissorsIcon({
  size = 36,
  color = '#000',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={6} cy={6} r={3} stroke={color} strokeWidth={1.8} />
      <Circle cx={6} cy={18} r={3} stroke={color} strokeWidth={1.8} />
      <Line
        x1={20}
        y1={4}
        x2={8.12}
        y2={15.88}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Line
        x1={14.47}
        y1={14.48}
        x2={20}
        y2={20}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Line
        x1={8.12}
        y1={8.12}
        x2={12}
        y2={12}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
