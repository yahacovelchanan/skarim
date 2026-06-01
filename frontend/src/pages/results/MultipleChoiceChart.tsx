import {
  Card,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  title: string;

  data: {
    name: string;
    value: number;
  }[];
};

const MultipleChoiceChart =
  ({
    title,
    data,
  }: Props) => {
    return (
      <Card
        sx={{
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
          }}
        >
          {title}
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={
                100
              }
              label
            >
              {data.map(
                (
                  _,
                  index
                ) => (
                  <Cell
                    key={
                      index
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    );
  };

export default MultipleChoiceChart;