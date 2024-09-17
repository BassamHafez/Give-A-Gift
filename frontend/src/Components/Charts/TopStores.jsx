import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "react-responsive";

const topShapes = [
  { _id: "a", image: "shop1.png", cardsCount: 3 },
  { _id: "b", image: "shop2.png", cardsCount: 4 },
  { _id: "c", image: "shop3.png", cardsCount: 5 },
  { _id: "d", image: "shop4.png", cardsCount: 6 },
  { _id: "e", image: "shop5.png", cardsCount: 7 },
  { _id: "f", image: "shop6.jpg", cardsCount: 3 },
  { _id: "g", image: "shop7.png", cardsCount: 10 },
  { _id: "h", image: "shop8.jpg", cardsCount: 8 },
  { _id: "i", image: "shop9.jpg", cardsCount: 10 },
  { _id: "j", image: "shop10.jpg", cardsCount: 11 },
  { _id: "k", image: "shop11.png", cardsCount: 12 },
  { _id: "l", image: "shop12.jpeg", cardsCount: 3 },
  { _id: "m", image: "shop13.jpeg", cardsCount: 4 },
  { _id: "p", image: "shop14.png", cardsCount: 5 },
  { _id: "q", image: "shop15.png", cardsCount: 1 },
  { _id: "r", image: "shop16.png", cardsCount: 0 },
];

const data = topShapes.map((shape) => ({
  name: shape._id,
  sales: shape.cardsCount,
  img: `${process.env.REACT_APP_Host}shops/${shape.image}`,
}));

const CustomXAxisTick = ({ x, y, payload }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const shapeData = data.find((d) => d.name === payload.value);
  if (!shapeData) return null;

  const tickX = isMobile ? x - 40 : x - 20;
  const tickY = isMobile ? y - 20 : y + 15;

  return (
    <g transform={`translate(${tickX},${tickY})`}>
      <svg width={40} height={40} viewBox="0 0 40 40">
        <image
          href={shapeData.img}
          x="0"
          y="0"
          width={40}
          height={40}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </g>
  );
};

const TinyBar = (props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { fill, x, y, width, height } = props;
  const adjustedX = isMobile ? x : x + ( width/2 + 2);
  return <rect x={adjustedX} y={y} width={width} height={height} fill={fill} />;
};

const CustomLabel = ({ x, y, value }) => {
  return (
    <text
      x={x + 40}
      y={y}
      textAnchor="middle"
      fill="#b62026"
      fontWeight={600}
      fontSize={12}
      dy={-10}
    >
      {value}
    </text>
  );
};

const TopStores = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const barWidth = isMobile ? 10 : 27;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        {isMobile ? (
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={<CustomXAxisTick />} />
            <Bar
              dataKey="sales"
              fill="#8884d8"
              shape={<TinyBar />}
              label={{ position: "right" }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={"#0088FE"} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={<CustomXAxisTick />} />
            <YAxis />
            <Bar
              dataKey="sales"
              fill="#8884d8"
              shape={<TinyBar width={barWidth} />}
              label={<CustomLabel />}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={"#0088FE"} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TopStores;
