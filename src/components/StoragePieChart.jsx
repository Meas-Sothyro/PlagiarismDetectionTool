import { PieChart, Pie, Cell, Label } from 'recharts';
import '../css/pie.css'; // Assuming you'll put the CSS here

const StoragePieChart = ({ capacity }) => {
  const pieData = [
    { name: 'Used', value: capacity.used },
    { name: 'Free', value: capacity.free }
  ];

  return (
    <div className="drive-status-container">
      <div className="drive-status-box">
        <div className="left-section">
          <PieChart width={160} height={160}>
            <Pie
              data={pieData}
              innerRadius={50}
              outerRadius={70}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#C62828" /> {/* Used */}
              <Cell fill="#00ff15" /> {/* Free */}
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#333"
                      fontSize={13}
                      fontWeight="bold"
                    >
                      {capacity.used.toFixed(0)} GiB
                      <tspan x={cx} dy="1.2em">
                        Used
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </div>

        <div className="right-section">
          <div className="drive-info">
            <p className="label">Drive Name</p>
            <p className="value">/data</p>
          </div>
          <div className="drive-info">
            <p className="label">Used Capacity</p>
            <p className="value">{capacity.used.toFixed(1)} GiB</p>
            <p className="subtext">
              {(capacity.used / capacity.total * 100).toFixed(2)}% of {capacity.total.toFixed(1)} GiB
            </p>
          </div>
          <div className="drive-info">
            <p className="label">Available Capacity</p>
            <p className="value">{capacity.free.toFixed(1)} GiB</p>
            <p className="subtext">
              {(capacity.free / capacity.total * 100).toFixed(2)}% of {capacity.total.toFixed(1)} GiB
            </p>
          </div>
          <div className="drive-info">
            <p className="label">Drive Status</p>
            <p className={`status ${capacity.status === 'online' ? 'online' : 'offline'}`}>
              ● {capacity.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoragePieChart;
