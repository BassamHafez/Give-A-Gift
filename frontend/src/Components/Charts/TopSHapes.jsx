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
  { _id: "a", image: "1OSMraS.png", cardsCount: 3 },
  { _id: "b", image: "e4rKcS0.png", cardsCount: 4 },
  { _id: "c", image: "v0NFtm0.png", cardsCount: 5 },
  { _id: "d", image: "WBxoxBK.png", cardsCount: 6 },
  { _id: "e", image: "oiPl2QX.png", cardsCount: 7 },
  { _id: "f", image: "mmetlwc.png", cardsCount: 3 },
  { _id: "g", image: "FruSxNc.png", cardsCount: 10 },
  { _id: "h", image: "fhPyEBT.png", cardsCount: 8 },
  { _id: "i", image: "RmpX0dp.png", cardsCount: 10 },
  { _id: "j", image: "P5w31EM.png", cardsCount: 11 },
  { _id: "k", image: "WjFaCGZ.png", cardsCount: 12 },
  { _id: "l", image: "gSHwOPr.png", cardsCount: 3 },
  { _id: "m", image: "KnIE0ry.png", cardsCount: 4 },
  { _id: "p", image: "8Nnc16G.png", cardsCount: 5 },
  { _id: "q", image: "removebg1.png", cardsCount: 1 },
  { _id: "r", image: "removebg2.png", cardsCount: 0 },
];

const data = topShapes.map((shape) => ({
  name: shape._id,
  sales: shape.cardsCount,
  img: `${process.env.REACT_APP_Host}shapes/${shape.image}`,
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
  const adjustedX = isMobile ? x : x +( width/2 + 2);
  const adjustedY = isMobile ? y + 8 : y;
  const adjustedHeight = isMobile ? height / 2 : height;
  return (
    <rect
      x={adjustedX}
      y={adjustedY}
      width={width}
      height={adjustedHeight}
      fill={fill}
    />
  );
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

const TopShapes = () => {
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

export default TopShapes;
