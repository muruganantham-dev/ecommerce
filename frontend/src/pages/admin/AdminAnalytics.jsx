import { useEffect } from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesAnalytics, fetchTopProducts, fetchRevenueSummary } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const { salesData, topProducts, revenueSummary, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchSalesAnalytics());
    dispatch(fetchTopProducts({ limit: 10 }));
    dispatch(fetchRevenueSummary());
  }, [dispatch]);

  const chartData = {
    labels: (salesData || []).map((d) => `${monthNames[(d._id?.month || 1) - 1]} ${d._id?.year || ''}`),
    datasets: [
      {
        label: 'Sales (₹)',
        data: (salesData || []).map((d) => d.totalSales),
        backgroundColor: 'rgba(13, 110, 253, 0.5)',
      },
    ],
  };

  if (loading && !salesData?.length && !topProducts?.length) return <LoadingSpinner />;

  return (
    <>
      <h4 className="mb-4">Analytics</h4>
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="small text-muted">Total Revenue</Card.Title>
              <h3>₹{revenueSummary?.totalRevenue ?? 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="small text-muted">This Month Revenue</Card.Title>
              <h3>₹{revenueSummary?.thisMonthRevenue ?? 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="mb-4">
        <Card.Header>Monthly Sales</Card.Header>
        <Card.Body>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>Top Selling Products</Card.Header>
        <Card.Body className="p-0">
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(topProducts || []).map((p, i) => (
                <tr key={p._id || i}>
                  <td>{p.name}</td>
                  <td>{p.totalQty}</td>
                  <td>₹{p.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {(!topProducts || topProducts.length === 0) && <p className="text-center text-muted py-3 mb-0">No data.</p>}
        </Card.Body>
      </Card>
    </>
  );
}
