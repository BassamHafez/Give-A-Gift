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

const CustomXAxisTick = ({ x, y, payload, data }) => {

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const shopData = data.find((d) => d.name === payload.value);
  if (!shopData) return null;

  const tickX = isMobile ? x - 40 : x - 20;
  const tickY = isMobile ? y - 20 : y + 15;

  return (
    <g transform={`translate(${tickX},${tickY})`}>
      <svg width={40} height={40}>
        <image
          href={shopData.img}
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
  const adjustedX = isMobile ? x : x + (width / 2 + 2);
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

const TopStores = ({ topShops }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const barWidth = isMobile ? 10 : 27;

  const data = topShops?.map((shop,index) => ({
    name: index,
    sales: shop.cardsCount,
    img: `${process.env.REACT_APP_Host}shops/${shop.logo}`,
  }));

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
            <YAxis dataKey="name" type="category" tick={<CustomXAxisTick data={data} />} />
            <Bar
              dataKey="sales"
              fill="#8884d8"
              shape={<TinyBar />}
              label={{ position: "right" }}
            >
              {data?.map((entry, index) => (
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
            <XAxis dataKey="name" tick={<CustomXAxisTick data={data} />} />
            <YAxis />
            <Bar
              dataKey="sales"
              fill="#8884d8"
              shape={<TinyBar width={barWidth} />}
              label={<CustomLabel />}
            >
              {data?.map((entry, index) => (
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
