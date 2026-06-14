const MarketDashboard = require('../models/MarketDashboard');

const getDashboard = async (req, res, next) => {
  try {
    let dashboard = await MarketDashboard.findOne();

    if (!dashboard) {
      dashboard = await MarketDashboard.create({
        title: 'BDX Current Price',
        currentPrice: '₹7.51',
        networkStatus: 'Active',
        recommendedHorizon: '3–5 Years',
        currentTrend: 'Bullish',
        chartData: [
          { label: 'Jan', value: 6.8 },
          { label: 'Feb', value: 7.0 },
          { label: 'Mar', value: 7.2 },
          { label: 'Apr', value: 7.4 },
          { label: 'May', value: 7.5 },
          { label: 'Jun', value: 7.5 },
        ],
      });
    }

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

const updateDashboard = async (req, res, next) => {
  try {
    const { title, currentPrice, networkStatus, recommendedHorizon, currentTrend, chartData } = req.body;

    let dashboard = await MarketDashboard.findOne();

    if (!dashboard) {
      dashboard = new MarketDashboard();
    }

    if (title !== undefined) dashboard.title = title;
    if (currentPrice !== undefined) dashboard.currentPrice = currentPrice;
    if (networkStatus !== undefined) dashboard.networkStatus = networkStatus;
    if (recommendedHorizon !== undefined) dashboard.recommendedHorizon = recommendedHorizon;
    if (currentTrend !== undefined) dashboard.currentTrend = currentTrend;
    if (chartData !== undefined) dashboard.chartData = chartData;

    await dashboard.save();

    res.json({
      success: true,
      message: 'Market dashboard updated successfully',
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, updateDashboard };
